from enum import Enum
from pydantic import BaseModel


class OutputMode(str, Enum):
    internal = "internal"
    customer = "customer"


class DecisionBand(str, Enum):
    recommended = "recommended"
    neutral = "neutral"
    risky = "risky"


class ZoningDecision(str, Enum):
    permitted = "permitted"
    prohibited = "prohibited"
    caution = "caution"
    manual_review = "manual_review"


class HealthResponse(BaseModel):
    status: str
    service: str
