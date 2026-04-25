from fastapi import APIRouter
from app.schemas.contracts import AnalysisJobStatus
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/analysis/jobs", tags=["analysis_jobs"])


@router.get("/{job_id}", response_model=AnalysisJobStatus)
def job_status(job_id: str) -> AnalysisJobStatus:
    return stub_service.job_status(job_id)
