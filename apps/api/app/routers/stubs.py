"""Placeholder routers for domain boundaries not implemented yet."""
from fastapi import APIRouter

router = APIRouter(prefix="/v1", tags=["stubs"])


@router.get("/auth/me")
def auth_me() -> dict[str, str]:
    return {"message": "auth module scaffold"}


@router.get("/projects")
def projects() -> dict[str, str]:
    return {"message": "projects module scaffold"}


@router.get("/sites")
def sites() -> dict[str, str]:
    return {"message": "sites/buildings/units module scaffold"}


@router.get("/admin/zoning/rules")
def admin_rules() -> dict[str, str]:
    return {"message": "admin_rules module scaffold"}
