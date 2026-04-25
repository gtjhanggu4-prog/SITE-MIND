# Report Section Schema v1

Sections:
1. executive summary
2. site & catchment summary
3. zoning first-screening summary
4. category comparison + unsuitable cards
5. tenant validation summary
6. pricing recommendation summary
7. CRM/leasing status summary
8. reliability & evidence appendix

Each section payload includes:
- `summary_cards[]`
- `detail_rows[]`
- `charts[]`
- `evidence_refs[]`
- `last_updated_at`

Mode matrix:
- internal: full reasoning, source IDs, override details
- customer: simplified narrative, redacted internal fields
