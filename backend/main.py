from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from dotenv import load_dotenv
from pydantic import BaseModel
from pathlib import Path
import json

from RAG.pipeline import run_pipeline

load_dotenv()

app = FastAPI(title="Dataset Doctor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

PLOTS_DIR = BASE_DIR / "plots"
PLOTS_DIR.mkdir(parents=True, exist_ok=True)

REPORT_DIR = BASE_DIR / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)


app.mount(
    "/plots",
    StaticFiles(directory=str(PLOTS_DIR)),
    name="plots"
)

@app.get("/")
def home():
    return {
        "message": "Dataset Doctor API"
    }

class ModelResponse(BaseModel):
    doctor_report: dict
    report_path: str
    plot_files: list[str]

@app.post("/diagnose", response_model=ModelResponse)
async def diagnose(file: UploadFile = File(...)):

    try:

        file_extension = Path(file.filename).suffix.lower()

        if file_extension not in [".csv", ".json", ".xlsx", ".xls"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format"
            )

        file_path = UPLOAD_DIR / file.filename

        contents = await file.read()

        with open(file_path, "wb") as fs:
            fs.write(contents)


        result = run_pipeline(str(file_path))

        plot_files = [
            f"/plots/{plot.name}"
            for plot in PLOTS_DIR.iterdir()
            if plot.is_file()
            and plot.suffix.lower()
            in [".png", ".jpg", ".jpeg", ".webp", ".svg"]
        ]

        report_path = REPORT_DIR / "doctor_report.md"
        
        with open(report_path, 'w',encoding="utf-8") as fs:
            json.dump(result['doctor_report'],fs,indent= 4,ensure_ascii= False)

        return {
            "doctor_report": result["doctor_report"],
            "report_path": str(report_path),
            "plot_files": plot_files
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong: {str(e)}"
        )