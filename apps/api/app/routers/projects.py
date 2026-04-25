from fastapi import APIRouter

router = APIRouter(prefix="/v1/projects", tags=["projects"])


@router.get("")
def list_projects() -> dict[str, list[dict[str, str]]]:
    return {"items": [{"id": "40000000-0000-0000-0000-000000000001", "name": "강남역 상업시설 개발"}]}
