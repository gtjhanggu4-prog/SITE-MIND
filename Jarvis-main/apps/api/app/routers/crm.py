from fastapi import APIRouter
from app.schemas.contracts import CRMLeadSummary
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}/crm", tags=["crm"])


@router.get("/leads/{lead_id}/summary", response_model=CRMLeadSummary)
def lead_summary(project_id: str, lead_id: str) -> CRMLeadSummary:
    _ = project_id
    return stub_service.lead_summary(lead_id)
