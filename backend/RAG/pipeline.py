from .analysis_agent import build_analysis_agent
from .dataset_loader import dataset_loader
from .db import make_json,run_db
from .doctor_agent import run_doctor_agent
from .create_report import create_report

def run_pipeline(file) -> dict:
    print("Loading dataset...")
    dataset_loader(file)
   
    print("\n"+" -"*50)
    print("Analysis agent is working ...")
    print("\n"+" -"*50)
    
    analysis_agent= build_analysis_agent()
    analysis_result = analysis_agent.invoke({
        "messages": [
            {
                "role": "user",
                "content": """
                Analyze the uploaded CSV dataset.

                You must:
                1. Run EDA_tool
                2. Run visualization_tool
                3. Run correlation_tool
                4. Run summary_tool
                """
            }
        ]
    })
    
    json_content=make_json(analysis_result)
    run_db(json_content)
    
    print("\n" + " -" * 50)
    print("Doctor agent is working...")
    print(" -" * 50)

    doctor_result = run_doctor_agent()
    
    report_path= create_report(doctor_result)
    
    return {
        "analysis": json_content,
        "doctor_report": doctor_result,
        "report_path": str(report_path)
    }
    
if __name__ == "__main__":
    file_path = input("Enter dataset path: ").strip()
    try:
        result = run_pipeline(file_path)

        print("\n" + "=" * 60)
        print("Dataset Doctor completed successfully!")
        print("=" * 60)

        print("\nReport:")
        print(result["report_path"])

    except Exception as e:
        print(f"\nError: {e}")