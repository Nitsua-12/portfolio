from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.deps import get_current_user, require_manager
from app.models import Shift, User
from app.schemas import ShiftCreate, ShiftRead

router = APIRouter(prefix="/shifts", tags=["shifts"])


@router.get("/mine", response_model=list[ShiftRead])
def my_shifts(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return session.exec(
        select(Shift).where(Shift.user_id == current_user.id).order_by(Shift.work_date)
    ).all()


@router.get("", response_model=list[ShiftRead])
def all_shifts(
    _: User = Depends(require_manager),
    session: Session = Depends(get_session),
):
    return session.exec(select(Shift).order_by(Shift.work_date)).all()


@router.post("", response_model=ShiftRead)
def create_shift(
    payload: ShiftCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    shift = Shift(user_id=current_user.id, **payload.model_dump())
    session.add(shift)
    session.commit()
    session.refresh(shift)
    return shift
