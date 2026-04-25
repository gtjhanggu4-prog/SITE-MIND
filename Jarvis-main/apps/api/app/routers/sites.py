from fastapi import APIRouter

router = APIRouter(prefix="/v1/sites", tags=["sites/buildings/units"])


@router.get("/{site_id}")
def get_site(site_id: str) -> dict[str, str]:
    return {"site_id": site_id, "status": "stub"}
