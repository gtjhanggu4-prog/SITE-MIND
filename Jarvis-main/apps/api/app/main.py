from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.routers import admin_rules, analysis_jobs, ai, auth, crm, health, manual_adjustments, market, pricing, projects, reports, sites, tenant_validation, zoning

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_allow_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(sites.router)
app.include_router(admin_rules.router)
app.include_router(market.router)
app.include_router(tenant_validation.router)
app.include_router(pricing.router)
app.include_router(manual_adjustments.router)
app.include_router(zoning.router)
app.include_router(crm.router)
app.include_router(reports.router)
app.include_router(analysis_jobs.router)
app.include_router(ai.router)
