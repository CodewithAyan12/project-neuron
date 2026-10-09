# Project Neuron - FastAPI Backend

FastAPI backend for **Project Neuron: An Agentic AI-Based Personalized Coding Mentor**.

## Tech Stack
- **FastAPI**: Asynchronous high-performance web framework
- **SQLAlchemy**: ORM for database abstraction
- **PostgreSQL / SQLite**: Primary relational database with instant SQLite zero-setup fallback
- **Pydantic v2**: Request/Response serialization and data validation
- **Uvicorn**: Lightning-fast ASGI production server

---

## Directory Structure
```text
backend/
├── app/
│   ├── main.py              # Application entrypoint & CORS
│   ├── database.py          # SQLAlchemy connection & session manager
│   ├── models.py            # PostgreSQL table definitions
│   ├── schemas.py           # Pydantic request/response models
│   ├── crud.py              # Database queries & initial data seeding
│   ├── dependencies.py      # Dependency injections (Auth/DB)
│   └── routers/
│       ├── problems.py      # /api/problems (CRUD)
│       ├── analytics.py     # /api/analytics
│       ├── study_plan.py    # /api/study-plan
│       └── ai.py            # /api/ai/chat
├── .env.example
├── .env
├── requirements.txt
└── README.md
```

---

## Quickstart

### 1. Install Dependencies
```bash
python -m pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
By default, the backend runs seamlessly using local SQLite:
```env
DATABASE_URL=sqlite:///./neuron.db
FRONTEND_URL=http://localhost:5173
```
To connect PostgreSQL (Local, Neon.tech, or Supabase), update `DATABASE_URL`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/neuron_db
```

### 3. Run Development Server
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### 4. Interactive API Documentation
Open your browser and navigate to:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Endpoints

### System
- `GET /` - Root health message
- `GET /health` - Health check status

### Problems
- `GET /api/problems` - Fetch all logged coding problems for the user
- `POST /api/problems` - Log a new coding problem
- `DELETE /api/problems/{problem_id}` - Delete a problem

### Analytics
- `GET /api/analytics` - Get aggregated metrics (solve counts, avg time, topic performance, recent activity)

### Study Plan
- `GET /api/study-plan` - Get 7-day personalized study schedule
- `POST /api/study-plan/{plan_id}/complete` - Toggle completion status of a day

### AI Mentor
- `POST /api/ai/chat` - Interact with the AI Mentor with context-aware responses
