# Scoring Governance v1

Score families:
- site commercial potential
- category suitability
- saturation
- opportunity
- tenant validation
- pricing confidence
- lead score

All scores store `score_version`, `model_version`, `feature_snapshot_id`, `computed_at`.

Calibration cadence:
- weekly: pricing, lead score
- monthly: category, tenant validation
- alert: distribution shift >15% MoM
