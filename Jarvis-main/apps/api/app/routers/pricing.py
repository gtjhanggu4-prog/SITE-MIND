from fastapi import APIRouter
from app.schemas.contracts import PricingRecommendation
from app.services.stub_service import stub_service

router = APIRouter(prefix="/v1/projects/{project_id}", tags=["pricing"])


@router.get("/pricing-recommendations", response_model=list[PricingRecommendation])
def pricing_recommendations(project_id: str) -> list[PricingRecommendation]:
    _ = project_id
    return stub_service.pricing()
