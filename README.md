# Project Neuron

Project Neuron is a full-stack AI-powered study assistant built with React + Vite on the frontend and FastAPI on the backend.

## Project structure

- frontend/ — React application and all UI files
- backend/ — FastAPI app, database config, and API routes
- .gitignore — repo ignore rules for env files and build artifacts

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## Backend setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend build

```bash
cd frontend
npm run build
```

## Environment files

- frontend/.env — frontend variables such as VITE_API_URL
- backend/.env — backend variables such as DATABASE_URL and AI_API_KEY

## Tech stack

- Frontend: React, Vite, React Router, Recharts
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: SQLite by default, with PostgreSQL support available
