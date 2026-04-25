from fastapi import APIRouter
from app.schemas.contracts import ZoningScreeningResponse
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}", tags=["zoning"])


@router.get("/zoning-screening/{run_id}", response_model=ZoningScreeningResponse)
def zoning_result(project_id: str, run_id: str) -> ZoningScreeningResponse:
    _ = project_id
    return stub_service.zoning(run_id)
