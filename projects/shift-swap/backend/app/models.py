from datetime import date, datetime, time
from enum import Enum
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class Role(str, Enum):
    employee = "employee"
    manager = "manager"


class SwapStatus(str, Enum):
    open = "open"
    claimed = "claimed"
    approved = "approved"
    denied = "denied"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: Role = Role.employee

    shifts: list["Shift"] = Relationship(back_populates="user")


class Shift(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    work_date: date
    start_time: time
    end_time: time
    up_for_swap: bool = False

    user: Optional[User] = Relationship(back_populates="shifts")
    swap_request: Optional["SwapRequest"] = Relationship(back_populates="shift")


class SwapRequest(SQLModel, table=True):
    """requested_by_id / claimed_by_id are plain FKs (no ORM relationship) —
    two FKs from the same table to User would need disambiguation that isn't
    worth the complexity here; routers resolve the User rows explicitly."""

    id: Optional[int] = Field(default=None, primary_key=True)
    shift_id: int = Field(foreign_key="shift.id", unique=True)
    requested_by_id: int = Field(foreign_key="user.id")
    claimed_by_id: Optional[int] = Field(default=None, foreign_key="user.id")
    status: SwapStatus = SwapStatus.open
    created_at: datetime = Field(default_factory=datetime.utcnow)

    shift: Optional[Shift] = Relationship(back_populates="swap_request")
