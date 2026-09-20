# 🩺 Dataset Doctor Report

**Generated:** 2026-09-20 11:36:31

---

# Dataset Doctor Diagnosis

## Problems

### Problem 1  
- **Problem:** Physiologically impossible zero values in **RestingBP** and **Cholesterol** (minimum = 0).  
- **Evidence:** The statistical table shows `RestingBP` min = 0 and `Cholesterol` min = 0; the data‑quality section flags these as “likely data entry errors.”  
- **Severity:** **High**  
- **Why it matters:** Zero blood pressure or cholesterol cannot occur in living patients; these values will distort summary statistics, correlation estimates, and model training if left unchanged.

### Problem 2  
- **Problem:** Negative values in **Oldpeak** (minimum = –2.6).  
- **Evidence:** Outliers/suspicious values section lists negative Oldpeak values; the distribution description notes a range of –2.6 to 6.2.  
- **Severity:** **Medium**  
- **Why it matters:** Oldpeak represents ST‑segment depression, which is defined as a non‑negative measurement in most clinical contexts. Negative entries may be recording mistakes and could mislead models that assume monotonic relationships.

### Problem 3  
- **Problem:** Extreme high values in **Oldpeak** (values > 5 are rare and may be outliers).  
- **Evidence:** Outliers section calls values > 5 “rare and may be extreme outliers.”  
- **Severity:** **Medium**  
- **Why it matters:** Extreme values can overly influence distance‑based algorithms and linear models, leading to unstable coefficients or poor generalisation.

### Problem 4  
- **Problem:** Presence of outliers / suspicious values overall (zero BP/Cholesterol, negative and extreme Oldpeak).  
- **Evidence:** Consolidated in the “Outliers / suspicious values” rows of the analysis.  
- **Severity:** **Medium**  
- **Why it matters:** Outliers can bias model fitting, inflate error metrics, and reduce predictive performance, especially for algorithms sensitive to scale (e.g., logistic regression without regularisation).

*(No other problems such as missing values, duplicates, constant columns, high‑cardinality features, or data‑type mismatches were reported.)*  

---

## ML Readiness

- **Readiness:** **75 %**  

- **Evaluated dimensions:**  
  1. **Data completeness** – No missing entries reported (acceptable).  
  2. **Duplicate quality** – 0 duplicate rows detected (acceptable).  
  3. **Data‑type consistency** – All columns have appropriate types (acceptable).  
  4. **Outlier situation** – Presence of impossible zeros, negative and extreme Oldpeak values (not acceptable).  
  5. **Class balance** – Target `HeartDisease` is roughly 55 % / 45 % (acceptable).  
  6. **Feature quality** – Invalid numeric entries (zeros, negatives) reduce overall feature reliability (not acceptable).  
  7. **Target suitability** – Binary target present and well‑defined (acceptable).  
  8. **Potential data leakage** – No leakage identified in the analysis (acceptable).

- **Unknown dimensions:** None (all eight dimensions could be assessed from the provided analysis).

- **Reasoning:** Six of the eight dimensions meet the “acceptable” criterion, giving a readiness score of 6 / 8 = 75 %. The primary blockers are the outlier situation and feature quality, both tied to the same set of invalid numeric values.

---

## Prescriptions

### Prescription 1  
- **Problem:** Zero values in **RestingBP** and **Cholesterol**.  
- **Action:** Replace each zero with `NaN`, then impute using the median (or mean if distribution is roughly symmetric) of the respective column.  
- **Reason:** Median imputation preserves the central tendency without being skewed by the long right‑tail of cholesterol; it also avoids introducing artificial low values that would bias models.

### Prescription 2  
- **Problem:** Negative **Oldpeak** values.  
- **Action:** Flag any negative `Oldpeak` entries, set them to `NaN`, and impute with the median of the non‑negative `Oldpeak` values (or consider domain‑specific correction if a clinical rule permits).  
- **Reason:** Negative ST‑depression is unlikely; treating them as missing and imputing a realistic non‑negative value prevents the model from learning a spurious negative relationship.

### Prescription 3  
- **Problem:** Extreme high **Oldpeak** values (> 5).  
- **Action:** Review these records manually; if they are confirmed errors, treat as missing and impute, otherwise consider **winsorising** the `Oldpeak` column at the 95th percentile to cap extreme influence.  
- **Reason:** Winsorising reduces the impact of rare extreme values while retaining the information that very high Oldpeak may be clinically relevant.

### Prescription 4  
- **Problem:** General outlier influence on numeric features.  
- **Action:** After handling the specific issues above, apply a robust scaling method (e.g., `RobustScaler`) or use tree‑based models that are less sensitive to outliers.  
- **Reason:** Even after cleaning, the distributions remain right‑skewed; robust scaling mitigates the effect of remaining long tails on distance‑based algorithms.

### Prescription 5  
- **Problem:** Categorical encoding for modeling.  
- **Action:** Convert `Sex`, `ChestPainType`, `RestingECG`, `ExerciseAngina`, and `ST_Slope` to one‑hot encoded columns (or ordinal encoding if an inherent order is known).  
- **Reason:** Machine‑learning algorithms require numeric input; one‑hot encoding preserves nominal information without imposing artificial ordinal relationships.

### Prescription 6  
- **Problem:** Potential class‑imbalance handling.  
- **Action:** When splitting data, use **stratified** train/validation splits to preserve the ~55 % / 45 % class distribution; optionally apply class‑weighting in algorithms (e.g., `class_weight='balanced'` in logistic regression).  
- **Reason:** Guarantees that both training and validation sets reflect the true prevalence, reducing bias in performance estimates.

---

## Priority Actions

1. **Clean impossible numeric entries** – convert zeros in `RestingBP` and `Cholesterol` to missing and impute.  
2. **Correct/handle negative and extreme `Oldpeak` values** – set negatives to missing, review extremes, and apply appropriate imputation or winsorising.  
3. **Encode all categorical variables** (one‑hot or ordinal) to prepare the feature matrix for modeling.  
4. **Perform a stratified train/validation split** to maintain the observed class distribution.  
5. **Choose a modeling pipeline** that incorporates robust scaling or tree‑based learners to mitigate residual outlier effects.  
6. **Document every cleaning and preprocessing step** for reproducibility and future audits.  

---

## End of Report
