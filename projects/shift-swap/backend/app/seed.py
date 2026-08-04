from datetime import date, time

from sqlmodel import Session, select

from app.database import engine, init_db
from app.models import Role, Shift, User
from app.security import hash_password

DEMO_PASSWORD = "password123"


def seed() -> None:
    init_db()
    with Session(engine) as session:
        if session.exec(select(User)).first():
            print("Database already has data, skipping seed.")
            return

        manager = User(
            name="Dana Ruiz",
            email="manager@example.com",
            password_hash=hash_password(DEMO_PASSWORD),
            role=Role.manager,
        )
        alice = User(
            name="Alice Chen",
            email="alice@example.com",
            password_hash=hash_password(DEMO_PASSWORD),
            role=Role.employee,
        )
        bo = User(
            name="Bo Martinez",
            email="bo@example.com",
            password_hash=hash_password(DEMO_PASSWORD),
            role=Role.employee,
        )
        session.add_all([manager, alice, bo])
        session.commit()
        session.refresh(alice)
        session.refresh(bo)

        shifts = [
            Shift(user_id=alice.id, work_date=date(2026, 8, 10), start_time=time(9, 0), end_time=time(17, 0)),
            Shift(user_id=alice.id, work_date=date(2026, 8, 11), start_time=time(9, 0), end_time=time(17, 0)),
            Shift(user_id=bo.id, work_date=date(2026, 8, 10), start_time=time(12, 0), end_time=time(20, 0)),
            Shift(user_id=bo.id, work_date=date(2026, 8, 12), start_time=time(12, 0), end_time=time(20, 0)),
        ]
        session.add_all(shifts)
        session.commit()
        print(f"Seeded demo data. Accounts: manager@example.com / alice@example.com / bo@example.com — password: {DEMO_PASSWORD}")


if __name__ == "__main__":
    seed()
