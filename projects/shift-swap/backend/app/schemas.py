from datetime import date, datetime, time
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models import Role, SwapStatus


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.employee


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    role: Role


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ShiftCreate(BaseModel):
    work_date: date
    start_time: time
    end_time: time


class ShiftRead(BaseModel):
    id: int
    user_id: int
    work_date: date
    start_time: time
    end_time: time
    up_for_swap: bool


class SwapRequestRead(BaseModel):
    id: int
    shift_id: int
    requested_by_id: int
    claimed_by_id: Optional[int]
    status: SwapStatus
    created_at: datetime


class SwapRequestDetail(BaseModel):
    """Enriched view used for the swap board / approvals list — joins in the
    shift's date/time and the people's names so the frontend isn't stuck
    displaying raw user IDs."""

    id: int
    shift_id: int
    status: SwapStatus
    work_date: date
    start_time: time
    end_time: time
    requested_by_id: int
    requested_by_name: str
    claimed_by_id: Optional[int] = None
    claimed_by_name: Optional[str] = None
