from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import auth, shifts, swaps


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Shift Swap API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # Regex, not a fixed origin list — Vite picks the next free port (5173,
    # 5174, ...) whenever another project's dev server is already running.
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(shifts.router)
app.include_router(swaps.router)


@app.get("/health")
def health():
    return {"status": "ok"}
