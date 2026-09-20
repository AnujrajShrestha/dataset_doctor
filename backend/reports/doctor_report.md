# 🩺 Dataset Doctor Report

**Generated:** 2026-09-20 11:56:29

---

# Dataset Doctor Diagnosis

## Problems

### Problem 1  
- **Problem:** Zero values in **RestingBP** (minimum = 0)  
- **Evidence:** Data Quality table lists “RestingBP: minimum value 0.0 (physiologically impossible)”. Statistical table shows Min = 0.0.  
- **Severity:** **High**  
- **Why it matters:** Blood‑pressure cannot be zero; such entries will heavily distort any model that uses this feature, biasing coefficients or tree splits and reducing predictive performance.

### Problem 2  
- **Problem:** Zero values in **Cholesterol** (minimum = 0)  
- **Evidence:** Data Quality table notes “Cholesterol: minimum value 0.0 (physiologically impossible)”. Statistical table shows Min = 0.0.  
- **Severity:** **High**  
- **Why it matters:** Cholesterol values of 0 mg/dL are impossible in living patients. They act as extreme outliers, corrupting summary statistics, scaling, and model training.

### Problem 3  
- **Problem:** Negative values in **Oldpeak** (range down to –2.6)  
- **Evidence:** Outliers / suspicious values section reports “Oldpeak: negative values down to –2.6 (possible but should be verified)”. Statistical table shows Min = –2.6.  
- **Severity:** **Medium**  
- **Why it matters:** While negative ST‑depression can occur in some ECG interpretations, many clinical datasets treat Oldpeak as non‑negative. Unchecked negatives may mislead the model or cause scaling issues.

### Problem 4  
- **Problem:** Extreme high values in **Oldpeak** (> 5)  
- **Evidence:** Second analysis notes “values >5 are rare and may be extreme outliers”. Max = 6.2.  
- **Severity:** **Medium**  
- **Why it matters:** Very high Oldpeak values are uncommon and could represent measurement error or rare clinical cases; they can overly influence distance‑based or linear models.

### Problem 5  
- **Problem:** Moderate class imbalance in target **HeartDisease** (≈55 % positive, 45 % negative)  
- **Evidence:** Both analyses state “HeartDisease is binary with a 55/45 split”.  
- **Severity:** **Low**  
- **Why it matters:** The imbalance is modest, but if left unaddressed some algorithms may bias toward the majority class, slightly affecting metrics such as accuracy.

## ML Readiness

- **Readiness:** **75 %**  
- **Evaluated dimensions:**  
  1. **Data completeness** – No missing entries reported (acceptable).  
  2. **Duplicate quality** – 0 duplicate rows (acceptable).  
  3. **Data‑type consistency** – All columns have appropriate types (acceptable).  
  4. **Outlier situation** – Presence of impossible zeros, negatives, and extreme Oldpeak values (not acceptable).  
  5. **Class balance** – Moderately balanced (acceptable).  
  6. **Feature quality** – Invalid numeric entries degrade feature reliability (not acceptable).  
  7. **Target suitability** – Binary target with reasonable distribution (acceptable).  
  8. **Potential data leakage** – No leakage identified (acceptable).  

- **Unknown dimensions:** *None* – every dimension could be assessed from the supplied analysis.  

- **Reasoning:** Six of the eight evaluated dimensions are currently acceptable, giving a score of 6 / 8 = 75 %. The two dimensions that lower the score are the outlier situation and overall feature quality, both driven by the zero and implausible numeric values identified above.

## Prescriptions

### Prescription 1  
- **Problem:** Zero values in **RestingBP**  
- **Action:** Replace all 0 entries with `NaN`, then impute using the median (or mean) of the non‑zero RestingBP values. If the source data can be verified, correct the entries directly.  
- **Reason:** Imputation restores a realistic distribution while preserving the sample size; median is robust to any remaining outliers.

### Prescription 2  
- **Problem:** Zero values in **Cholesterol**  
- **Action:** Same as Prescription 1 – convert zeros to `NaN` and impute with the median cholesterol level (or use a model‑based imputation if desired).  
- **Reason:** Prevents a physiologically impossible value from skewing model training and statistical summaries.

### Prescription 3  
- **Problem:** Negative **Oldpeak** values  
- **Action:** Verify with domain experts or source documentation whether negative ST‑depression is valid. If deemed erroneous, set negatives to `NaN` and impute (median) or cap at zero.  
- **Reason:** Guarantees that the feature reflects the intended clinical measurement; avoids feeding impossible values to the model.

### Prescription 4  
- **Problem:** Extreme high **Oldpeak** values (> 5)  
- **Action:** Flag records with Oldpeak > 5 for review. Options: (a) cap/winsorize at the 95th percentile, or (b) treat as outliers and consider removal if they are confirmed errors.  
- **Reason:** Reduces undue influence of rare extreme points on models sensitive to scale while preserving genuine extreme cases if they are clinically valid.

### Prescription 5  
- **Problem:** Moderate class imbalance in **HeartDisease**  
- **Action:** When splitting data, use stratified train/validation splits to preserve the 55/45 ratio. For algorithms that are sensitive to imbalance, apply class‑weighting (e.g., `class_weight='balanced'` in scikit‑learn) or consider mild oversampling/undersampling after validation.  
- **Reason:** Ensures that performance metrics are not biased toward the majority class and that the model learns from both classes adequately.

## Priority Actions

1. **Clean impossible numeric values** – convert zeros in RestingBP and Cholesterol to missing and impute (median).  
2. **Validate and correct Oldpeak** – address negative values and review extreme > 5 values.  
3. **Document all cleaning steps** – keep a reproducible record of imputation and outlier handling.  
4. **Encode categorical variables** (one‑hot or ordinal) after cleaning numeric fields.  
5. **Create train/validation splits with stratification** to respect the modest class imbalance.  
6. **Proceed to feature engineering / modeling** once the above cleaning is complete.  

---

## End of Report
