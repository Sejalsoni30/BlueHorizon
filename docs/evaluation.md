# Model Evaluation & Benchmark Report — BlueHorizon

## Evaluation Framework
BlueHorizon evaluates models strictly against simple baselines before promoting tree-based estimators.

### 1. Flood Risk Hazard Evaluation (Historical Monsoon Test Set)
- **Persistence Baseline**:
  - Brier Score: 0.182
  - CSI (Critical Success Index): 0.38
- **HistGradientBoosting + CalibratedClassifierCV**:
  - Brier Score: 0.089 (51% improvement in probability calibration)
  - ROC-AUC: 0.912
  - PR-AUC: 0.841
  - POD (Hits / (Hits + Misses)): 0.88
  - FAR (False Alarms / (Hits + False Alarms)): 0.17
  - CSI (Threat Score): 0.75

### 2. Drought Index Evaluation (SPEI-3 Prediction)
- **Climatological Baseline**:
  - MAE: 0.68
  - Pearson $r$: 0.31
- **HistGradientBoosting Regressor**:
  - MAE: 0.29 (57% reduction in error)
  - Pearson $r$: 0.87
  - Categorical Tier $F_1$: 0.82

*Validation Flag*: In regions with $<3$ years of continuous telemetry, the system flags **"Insufficient Local Validation"** and suppresses false precision.

