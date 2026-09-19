from pathlib import Path
import shutil
import pandas as pd

file_data = None
file_path = None

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def dataset_loader(path):
    global file_data, file_path

    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")

    if path.suffix.lower() not in [".csv", ".json", ".xlsx", ".xls"]:
        raise ValueError(f"Unsupported file type: {path.suffix}")

    saved_path = UPLOAD_DIR / path.name
    shutil.copy2(path, saved_path)

    file_path = saved_path

    if path.suffix.lower() == ".csv":
        file_data = pd.read_csv(path)

    elif path.suffix.lower() == ".json":
        file_data = pd.read_json(path)

    elif path.suffix.lower() in [".xlsx", ".xls"]:
        file_data = pd.read_excel(path)

    print(f"Dataset loaded successfully: {file_data.shape}")

    return file_data