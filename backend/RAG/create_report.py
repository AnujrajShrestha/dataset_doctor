from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent / "reports"

REPORT_DIR = BASE_DIR / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)


def extract_doctor_response(doctor_result):

    messages = doctor_result.get("messages", [])

    for message in reversed(messages):
        if getattr(message, "type", None) == "ai":
            return message.content

    raise ValueError("No AI response found")


def create_report(doctor_response):

    if not isinstance(doctor_response, str):
        raise TypeError(
            f"Expected doctor_response to be str, got {type(doctor_response).__name__}"
        )

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    report = f"""# 🩺 Dataset Doctor Report

**Generated:** {timestamp}

---

{doctor_response}

---

## End of Report
"""

    report_path = REPORT_DIR / "doctor_report.md"

    report_path.write_text(
        report,
        encoding="utf-8"
    )

    print(f"Report saved to: {report_path}")

    return report_path