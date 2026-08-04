from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import aliased
from sqlmodel import Session, select

from app.database import get_session
from app.deps import get_current_user, require_manager
from app.models import Shift, SwapRequest, SwapStatus, User
from app.schemas import SwapRequestDetail, SwapRequestRead

router = APIRouter(prefix="/swaps", tags=["swaps"])


def _fetch_details(session: Session, status: SwapStatus) -> list[SwapRequestDetail]:
    requester = aliased(User)
    claimer = aliased(User)
    stmt = (
        select(SwapRequest, Shift, requester, claimer)
        .join(Shift, Shift.id == SwapRequest.shift_id)
        .join(requester, requester.id == SwapRequest.requested_by_id)
        .outerjoin(claimer, claimer.id == SwapRequest.claimed_by_id)
        .where(SwapRequest.status == status)
    )
    rows = session.exec(stmt).all()
    return [
        SwapRequestDetail(
            id=swap.id,
            shift_id=shift.id,
            status=swap.status,
            work_date=shift.work_date,
            start_time=shift.start_time,
            end_time=shift.end_time,
            requested_by_id=req_user.id,
            requested_by_name=req_user.name,
            claimed_by_id=claim_user.id if claim_user else None,
            claimed_by_name=claim_user.name if claim_user else None,
        )
        for swap, shift, req_user, claim_user in rows
    ]


@router.get("/open", response_model=list[SwapRequestDetail])
def open_swaps(
    session: Session = Depends(get_session),
    _: User = Depends(get_current_user),
):
    return _fetch_details(session, SwapStatus.open)


@router.get("/pending", response_model=list[SwapRequestDetail])
def pending_swaps(
    session: Session = Depends(get_session),
    _: User = Depends(require_manager),
):
    return _fetch_details(session, SwapStatus.claimed)


@router.post("/{shift_id}", response_model=SwapRequestRead)
def request_swap(
    shift_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    shift = session.get(Shift, shift_id)
    if not shift or shift.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Shift not found")
    existing = session.exec(select(SwapRequest).where(SwapRequest.shift_id == shift_id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Swap already requested for this shift")

    shift.up_for_swap = True
    swap = SwapRequest(shift_id=shift_id, requested_by_id=current_user.id)
    session.add(shift)
    session.add(swap)
    session.commit()
    session.refresh(swap)
    return swap


@router.post("/{swap_id}/claim", response_model=SwapRequestRead)
def claim_swap(
    swap_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    swap = session.get(SwapRequest, swap_id)
    if not swap or swap.status != SwapStatus.open:
        raise HTTPException(status_code=404, detail="Open swap not found")
    if swap.requested_by_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot claim your own swap")

    swap.claimed_by_id = current_user.id
    swap.status = SwapStatus.claimed
    session.add(swap)
    session.commit()
    session.refresh(swap)
    return swap


@router.post("/{swap_id}/approve", response_model=SwapRequestRead)
def approve_swap(
    swap_id: int,
    _: User = Depends(require_manager),
    session: Session = Depends(get_session),
):
    swap = session.get(SwapRequest, swap_id)
    if not swap or swap.status != SwapStatus.claimed:
        raise HTTPException(status_code=404, detail="Claimed swap not found")

    shift = session.get(Shift, swap.shift_id)
    swap.status = SwapStatus.approved
    shift.user_id = swap.claimed_by_id
    shift.up_for_swap = False
    session.add(swap)
    session.add(shift)
    session.commit()
    session.refresh(swap)
    return swap


@router.post("/{swap_id}/deny", response_model=SwapRequestRead)
def deny_swap(
    swap_id: int,
    _: User = Depends(require_manager),
    session: Session = Depends(get_session),
):
    swap = session.get(SwapRequest, swap_id)
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")

    swap.status = SwapStatus.denied
    session.add(swap)
    session.commit()
    session.refresh(swap)
    return swap
