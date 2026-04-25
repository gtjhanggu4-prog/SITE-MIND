# Async Job Contract v1

Status lifecycle: `queued -> running -> partial -> succeeded|failed|cancelled`

## Entity
`ai.analysis_jobs` with `job_id`, `module_name`, `project_id`, `status`, `percent_progress`, `partial_payload`, `error_payload`, `retry_token`.

## API
- `GET /v1/analysis/jobs/{job_id}`
- `POST /v1/analysis/jobs/{job_id}/rerun`

## Error payload
```json
{"code":"PROVIDER_TIMEOUT","message":"...","retryable":true,"source":"kakao_map"}
```
