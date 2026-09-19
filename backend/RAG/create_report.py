from pathlib import Path
from datetime import datetime


REPORT_DIR = Path(__file__).parent / "reports"

REPORT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


def extract_doctor_response(doctor_result):
    """
    Extract the final AI response from the Doctor Agent.
    """

    messages = doctor_result.get("messages", [])

    for message in reversed(messages):

        if getattr(message, "type", None) == "ai":

            return message.content

    raise ValueError(
        "No AI response found from Doctor Agent."
    )


def create_report(doctor_result, filename="doctor_report.md"):
    """
    Creates a Markdown report from the Doctor Agent response.
    """

    doctor_response = extract_doctor_response(
        doctor_result
    )

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    report = f"""
# 🩺 Dataset Doctor Report

**Generated:** {timestamp}

---

{doctor_response}

---

## End of Report
"""

    report_path = REPORT_DIR / filename

    report_path.write_text(
        report,
        encoding="utf-8"
    )

    return report_path