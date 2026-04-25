from fastapi import APIRouter

router = APIRouter(prefix="/v1/admin/zoning", tags=["admin_rules"])


@router.get("/rules")
def list_rules() -> dict[str, list[dict[str, str]]]:
    return {"items": [{"rule_code": "PARKING-CHK", "status": "published"}]}
