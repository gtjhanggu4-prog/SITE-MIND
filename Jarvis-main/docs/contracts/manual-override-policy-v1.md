# Manual Override Policy v1

Modules:
- category recommendation
- tenant validation
- pricing
- map/business density interpretation
- future development assumptions
- unit strategy assumptions

Policy:
- reason code required for all overrides
- before/after value mandatory
- approval mandatory for high-impact changes (band change, >10% pricing delta)
- reset writes a new audit record with `reset_at`
- all approved overrides are included in internal reports and audit logs
