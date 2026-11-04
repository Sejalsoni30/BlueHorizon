# Model Card — BlueHorizon ML Intelligence Service

## Model Overview
- **Name**: BlueHorizon Environmental Hazard Scorer (v1.0.0)
- **Architecture**: Dual Scikit-learn Pipeline
  - *Flood Risk Pipeline*: `HistGradientBoostingClassifier` with `CalibratedClassifierCV` (Isotonic regression)
  - *Drought Index Pipeline*: `HistGradientBoostingRegressor` with Quantile error bounds
- **Baselines Implemented**:
  - Flood: Persistence baseline & Climatological exceedance rate
  - Drought: Climatological weekly normal & AR(1) lag baseline

## Intended Use
- Complementary intelligence layer calculating calibrated probability of threshold exceedance and uncertainty bounds.
- Not for emergency command decisions without authoritative agency verification.

## Training & Validation Methodology
- **Leakage Prevention**: Expanding-window temporal cross-validation (walk-forward time split) and spatial basin holdouts.
- **Flood Metrics**: ROC-AUC, PR-AUC, Brier Score, POD (Probability of Detection), FAR (False Alarm Ratio), CSI (Critical Success Index).
- **Drought Metrics**: MAE, Pearson correlation $r$, Categorical $F_1$ score across drought tiers.

## Uncertainty & Missing Data Handling
- Probabilities calibrated to reflect empirical frequencies.
- Input data missingness triggers automatic penalty: confidence score is capped and an explicit "Degraded Confidence" banner is displayed.

