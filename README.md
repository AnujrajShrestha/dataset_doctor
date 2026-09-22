# 🩺 Dataset Doctor

> **An AI-powered dataset diagnosis and machine-learning readiness analysis tool.**

Dataset Doctor analyzes a dataset like a doctor examines a patient.

Upload a **CSV, XLSX, XLS, or JSON** dataset and Dataset Doctor performs profiling, data-quality analysis, statistical analysis, schema inspection, visualization, RAG-based reasoning, and AI-powered diagnosis to identify potential problems before the dataset is used for machine learning.

---

## ✨ Overview

Preparing a dataset for machine learning can involve a lot of repetitive analysis:

* Finding missing values
* Detecting outliers
* Checking class imbalance
* Understanding feature distributions
* Inspecting data types and schema
* Identifying suspicious columns
* Checking correlations
* Determining whether the dataset is suitable for ML
* Deciding what preprocessing should be performed

**Dataset Doctor automates this workflow.**

```text
                 ┌─────────────────────┐
                 │    Upload Dataset    │
                 │ CSV / XLSX / XLS /  │
                 │        JSON         │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Dataset Profiler  │
                 └──────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │ Data       │ │ Statistical│ │   Schema   │
       │ Quality    │ │  Analysis  │ │  Analysis  │
       └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                 ┌─────────────────────┐
                 │   Knowledge Layer   │
                 │    RAG Retrieval    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Doctor Agent     │
                 └──────────┬──────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │      Doctor's Report       │
              │                             │
              │ • Problems                  │
              │ • ML Readiness              │
              │ • Recommendations           │
              │ • Visualizations             │
              └─────────────────────────────┘
```

---

## 🚀 Features

### 📂 Multi-format Dataset Upload

Dataset Doctor supports:

* `.csv`
* `.xlsx`
* `.xls`
* `.json`

---

### 🔬 Dataset Profiling

Automatically analyzes the uploaded dataset and extracts information such as:

* Number of rows
* Number of columns
* Data types
* Numerical columns
* Categorical columns
* Missing values
* Unique values
* Basic statistics
* Dataset structure

---

### 🧹 Data Quality Analysis

Identifies common data-quality issues including:

* Missing values
* Duplicate records
* Invalid or suspicious values
* High-cardinality columns
* Potentially problematic features

---

### 📊 Statistical Analysis

Dataset Doctor examines numerical and categorical features using statistical analysis and exploratory data analysis techniques.

The system can inspect:

* Mean
* Median
* Standard deviation
* Minimum / maximum
* Quantiles
* Distributions
* Correlations
* Feature relationships

---

### 📈 Automatic Visualizations

The analysis pipeline can generate plots to help understand the dataset.

Examples include:

* Distribution plots
* Correlation visualizations
* Missing-value visualizations
* Feature analysis
* Other EDA plots

Generated plots are stored by the backend and can be displayed by the frontend.

---

### ⚖️ Imbalance Detection

For datasets containing target/class information, Dataset Doctor can identify potential class-imbalance problems.

Example:

```text
Class 0 → 92%
Class 1 → 8%

⚠ Significant class imbalance detected.
```

The resulting report can recommend techniques such as:

* Stratified train/test splitting
* Class weighting
* Resampling
* SMOTE or other balancing strategies

---

### 🔎 Outlier Analysis

Dataset Doctor searches for potentially unusual observations in numerical features.

Possible recommendations include:

* Investigate suspicious values
* Apply transformations
* Use robust statistics
* Cap or remove extreme observations where appropriate

---

## 🧠 RAG-powered Dataset Diagnosis

The project goes beyond traditional EDA.

Dataset Doctor converts the analysis results into a structured knowledge representation and uses a **Retrieval-Augmented Generation (RAG)** workflow to provide additional context to the Doctor Agent.

The general workflow is:

```text
Dataset
   │
   ▼
Profiler
   │
   ▼
EDA / Statistical Analysis
   │
   ▼
Structured Analysis
   │
   ▼
Knowledge Database
   │
   ▼
Retrieval
   │
   ▼
Doctor Agent
   │
   ▼
Diagnosis + Recommendations
```

This allows the final diagnosis to be based on both the dataset analysis and relevant retrieved context.

---

## 🩺 Doctor's Report

The final output is designed to answer questions such as:

### What is wrong with the dataset?

```text
Missing Data
────────────
• Age contains missing values
• Income contains missing values
```

### Is the dataset ML-ready?

```text
ML Readiness
────────────
72%
```

### What should be done?

```text
Prescriptions
─────────────
• Impute missing values
• Use stratified splitting
• Investigate detected outliers
• Review class imbalance
```

The exact findings depend on the uploaded dataset.

---

# 🏗️ Architecture

Dataset Doctor consists of a FastAPI backend and a modern React frontend.

```text
┌──────────────────────────────────────────────┐
│                  Frontend                    │
│                                              │
│       React + Vite + Tailwind CSS            │
│                                              │
│       Dataset Upload → Results Dashboard     │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP
                       ▼
┌──────────────────────────────────────────────┐
│                  FastAPI                     │
│                                              │
│                /diagnose                     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│               Dataset Loader                 │
│                                              │
│       CSV / XLSX / XLS / JSON                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             Analysis Agent                   │
│                                              │
│  • EDA                                        │
│  • Statistics                                 │
│  • Schema                                     │
│  • Visualization                              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Knowledge Layer                 │
│                                              │
│        Structured Analysis → Vector DB       │
│                  → Retrieval                 │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                Doctor Agent                  │
│                                              │
│      Diagnosis + Recommendations             │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Report Generator               │
│                                              │
│       JSON / Report / Plots                  │
└──────────────────────────────────────────────┘
```

---

# 📁 Project Structure

```text
dataset_doctor/
│
├── backend/
│   │
│   ├── main.py
│   │
│   ├── uploads/
│   │   └── uploaded datasets
│   │
│   ├── plots/
│   │   └── generated visualizations
│   │
│   ├── reports/
│   │   └── generated reports
│   │
│   └── RAG/
│       │
│       ├── analysis_agent.py
│       ├── dataset_loader.py
│       ├── tools.py
│       ├── pipeline.py
│       ├── db.py
│       ├── doctor_agent.py
│       └── create_report.py
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Lucide React

The frontend provides:

* Responsive UI
* Dark theme
* Dataset upload
* Drag & drop
* Analysis progress
* Diagnosis dashboard
* Generated visualization display
* Report access

---

## Backend

* Python
* FastAPI
* Uvicorn
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Pydantic

---

## AI / RAG

* LangChain
* LangGraph
* Vector database
* Retrieval-Augmented Generation
* LLM-based analysis
* AI Doctor Agent

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/AnujrajShrestha/dataset_doctor.git

cd dataset_doctor
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\activate
```

### Linux / macOS

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file inside `backend`:

```env
GROQ_API_KEY=your_groq_api_key
```

If your current LLM configuration uses another provider, add the corresponding API key required by the backend.

> **Never commit your `.env` file or API keys to GitHub.**

---

# ▶️ Run the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

# 🔌 API

## `GET /`

Check whether the API is running.

### Example

```http
GET /
```

Expected response:

```json
{
  "message": "Dataset Doctor API"
}
```

---

## `POST /diagnose`

Upload a dataset and run the complete diagnosis pipeline.

### Request

```http
POST /diagnose
Content-Type: multipart/form-data
```

Form field:

```text
file
```

Supported files:

```text
CSV
XLS
XLSX
JSON
```

### Example using cURL

```bash
curl -X POST \
  http://localhost:8000/diagnose \
  -F "file=@dataset.csv"
```

### Response

The response contains the generated diagnosis and report information.

Example structure:

```json
{
  "doctor_report": {},
  "report_path": "reports/report.json",
  "plot_files": [
    "plots/correlation.png",
    "plots/missing_values.png"
  ]
}
```

---

# 🧪 Example Workflow

Suppose you upload:

```text
Housing.csv
```

Dataset Doctor can perform:

```text
Housing.csv
      │
      ▼
Dataset Profiling
      │
      ├── 545 rows
      ├── 13 columns
      ├── Numerical features
      └── Categorical features
      │
      ▼
Data Quality Analysis
      │
      ├── Missing values
      ├── Duplicates
      └── Suspicious values
      │
      ▼
Statistical Analysis
      │
      ├── Distributions
      ├── Correlations
      └── Descriptive statistics
      │
      ▼
RAG Knowledge Layer
      │
      ▼
Doctor Agent
      │
      ▼
Final Diagnosis
```

---

# 📊 What Dataset Doctor Can Help With

| Area              | Analysis                               |
| ----------------- | -------------------------------------- |
| Dataset Structure | Rows, columns and schema               |
| Data Types        | Numerical, categorical and other types |
| Missing Values    | Missing-value detection                |
| Duplicates        | Duplicate record inspection            |
| Distributions     | Feature distributions                  |
| Correlation       | Feature relationships                  |
| Outliers          | Potential unusual observations         |
| Imbalance         | Class distribution                     |
| Visualization     | Automated EDA plots                    |
| ML Readiness      | Dataset preparation assessment         |
| Recommendations   | Suggested preprocessing actions        |
| Reports           | Persistent analysis reports            |

---

# 🔮 Future Improvements

Possible future additions include:

* [ ] Automatic preprocessing pipeline
* [ ] Automatic feature engineering
* [ ] Automatic target-column detection
* [ ] More sophisticated ML-readiness scoring
* [ ] Dataset comparison
* [ ] Interactive EDA dashboard
* [ ] Data drift detection
* [ ] Data leakage detection
* [ ] Automated baseline ML models
* [ ] Model recommendation
* [ ] Experiment tracking
* [ ] Authentication
* [ ] Cloud deployment
* [ ] PostgreSQL metadata storage
* [ ] More LLM providers
* [ ] Streaming analysis for large datasets

---

# ⚠️ Limitations

Dataset Doctor is an AI-assisted analysis tool.

Its recommendations should be treated as **engineering guidance rather than an automatic replacement for domain knowledge or statistical judgment**.

In particular:

* Outliers are not necessarily errors.
* Missing values do not always need to be removed.
* Correlation does not imply causation.
* Class imbalance depends on the problem and evaluation objective.
* ML readiness depends on the intended prediction task.

Always validate automated recommendations against the actual problem you are solving.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.

2. Create a branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.

4. Commit:

```bash
git commit -m "Add your feature"
```

5. Push:

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

# 📜 License

This project is open source. See the repository for the applicable license.

---

# 👨‍💻 Author

**Anuj Shrestha**

GitHub: [@AnujrajShrestha](https://github.com/AnujrajShrestha)

---

# ⭐ Support

If you find Dataset Doctor useful, consider giving the repository a ⭐ on GitHub.

**Repository:**
https://github.com/AnujrajShrestha/dataset_doctor

---

## 🩺 Dataset Doctor

**Upload → Analyze → Retrieve → Diagnose → Improve**

Built with Python, FastAPI, React, RAG, and AI!
