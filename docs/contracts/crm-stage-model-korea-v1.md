# Korean Leasing CRM Stage Model v1

Lead types:
`investor`, `owner_operator`, `franchise`, `exploratory`, `broker_introduced`

Stages:
`lead_new`, `lead_qualified`, `site_fit_review`, `tenant_validation_reviewed`, `proposal_prepared`, `proposal_sent`, `negotiation`, `conditional_approval`, `contract_pending`, `won`, `lost`, `on_hold`

Key gates:
- `proposal_sent`: requires report artifact
- `tenant_validation_reviewed`: requires linked validation ID
- `conditional_approval`: zoning not prohibited + approvals complete
