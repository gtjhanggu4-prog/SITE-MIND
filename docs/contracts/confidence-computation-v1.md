# Confidence Computation v1

Formula:
`confidence = 0.40*source_quality + 0.30*freshness + 0.20*coverage + 0.10*model_stability`

Penalties:
- missing zoning critical input: -25
- pricing comps <3: -20 and cap <=65
- demographic coverage gaps >30%: -15

Manual review if:
- `confidence < 60`
- or `missing_data_warning=true`
- or zoning status `manual_review`
