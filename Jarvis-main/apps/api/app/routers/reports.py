from fastapi import APIRouter
from app.schemas.contracts import ReportSummary
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}/reports", tags=["reports"])


@router.get("/{report_run_id}/summary", response_model=ReportSummary)
def report_summary(project_id: str, report_run_id: str) -> ReportSummary:
    _ = project_id
    return stub_service.report_summary(report_run_id)
