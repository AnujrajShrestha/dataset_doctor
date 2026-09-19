                    heart.csv
                       ↓
               Dataset Profiler
                       ↓
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
 Data Quality     Statistical        Schema
       ↓               ↓                ↓
 Missing: 2%      Age mean: 54       age → int
 Duplicates: 12   target 90/10        sex → category
 Outliers: 32     corr: 0.72          target → binary
       └───────────────┼────────────────┘
                       ↓
                 Findings JSON
                       ↓
                 RAG Retriever
                       ↓
          ML knowledge / best practices
                       ↓
                 Doctor Agent
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     Problems      ML Readiness   Prescriptions
        ↓              ↓              ↓
   Missing data        72%       Impute values
   Imbalance                    Stratified split
   Outliers                     Investigate outliers
        └──────────────┼──────────────┘
                       ↓
                Doctor's Report
                       ↓
                 React Dashboard