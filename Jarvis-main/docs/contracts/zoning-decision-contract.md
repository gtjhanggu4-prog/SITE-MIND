# Zoning Decision Contract v1

Enum: `permitted | prohibited | caution | manual_review`

## Required fields
- `decision_status`
- `operator_message`
- `customer_message`
- `legal_basis_text`
- `legal_reference_code`
- `evidence_refs[]`

## State rules
- `prohibited`: requires `blocking_reason_code`, no progression to `conditional_approval`.
- `caution`: requires `caution_items[]`.
- `manual_review`: requires `review_owner_user_id`, `review_due_at`.
- `permitted`: optional `advisory_notes[]`.

## Serialization
- Internal: full legal trace, rule IDs, reviewer fields.
- Customer: simplified message, no internal reviewer identity.
