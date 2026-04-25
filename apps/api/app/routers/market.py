from fastapi import APIRouter, Query
from app.schemas.common import OutputMode
from app.schemas.contracts import CategoryComparisonResponse
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}", tags=["market"])


@router.get("/category-comparison", response_model=CategoryComparisonResponse)
def category_comparison(project_id: str, mode: OutputMode = Query(default=OutputMode.internal)) -> CategoryComparisonResponse:
    return stub_service.category_comparison(project_id, mode)
