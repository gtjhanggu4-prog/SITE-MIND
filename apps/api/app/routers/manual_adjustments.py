from fastapi import APIRouter
from app.schemas.contracts import ManualAdjustmentCreateRequest, ManualAdjustmentCreateResponse
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}", tags=["manual_adjustments"])


@router.post("/manual-adjustments", response_model=ManualAdjustmentCreateResponse, status_code=202)
def create_adjustment(project_id: str, req: ManualAdjustmentCreateRequest) -> ManualAdjustmentCreateResponse:
    _ = project_id
    return stub_service.create_adjustment(req)


@router.post("/manual-adjustments/{adjustment_id}/reset", status_code=202)
def reset_adjustment(project_id: str, adjustment_id: str) -> dict[str, str | bool]:
    _ = (project_id, adjustment_id)
    return {"reset": True, "recompute_job_id": "job_01KOMOS0002"}
