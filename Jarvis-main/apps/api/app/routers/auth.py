from fastapi import APIRouter

router = APIRouter(prefix="/v1/auth", tags=["auth"])


@router.get("/me")
def me() -> dict[str, str]:
    return {"user": "stub-admin"}
