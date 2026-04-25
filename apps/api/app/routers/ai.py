from fastapi import APIRouter
from app.schemas.contracts import ReliabilityIndicator
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}", tags=["ai"])


@router.get("/reliability", response_model=ReliabilityIndicator)
def reliability(project_id: str, module_name: str = "tenant_validation") -> ReliabilityIndicator:
    _ = project_id
    return stub_service.reliability(module_name)
