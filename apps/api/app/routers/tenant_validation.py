from fastapi import APIRouter
from app.schemas.contracts import UnsuitableCategoryCard, ValidationResultResponse
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}", tags=["tenant_validation"])


@router.get("/unsuitable-cards", response_model=list[UnsuitableCategoryCard])
def unsuitable_cards(project_id: str) -> list[UnsuitableCategoryCard]:
    _ = project_id
    return stub_service.unsuitable_cards()


@router.get("/validation/{assessment_id}", response_model=ValidationResultResponse)
def validation_result(project_id: str, assessment_id: str) -> ValidationResultResponse:
    _ = (project_id, assessment_id)
    return stub_service.validation()
