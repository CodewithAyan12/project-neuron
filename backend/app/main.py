import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from . import crud
from .routers import problems, analytics, study_plan, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)

    # Seed initial demo data for college presentation demo
    db = SessionLocal()
    try:
        crud.seed_initial_data_if_empty(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title="Project Neuron API",
    description="Agentic AI-Based Personalized Coding Mentor Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
frontend_env = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [url.strip() for url in frontend_env.split(",") if url.strip()]
if "http://localhost:5173" not in allowed_origins:
    allowed_origins.append("http://localhost:5173")
# Also allow local network/vite previews
if "http://localhost:4173" not in allowed_origins:
    allowed_origins.append("http://localhost:4173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(problems.router)
app.include_router(analytics.router)
app.include_router(study_plan.router)
app.include_router(ai.router)


@app.get("/")
def read_root():
    return {"message": "Project Neuron API is running"}


@app.get("/health")
def read_health():
    return {"status": "healthy"}
