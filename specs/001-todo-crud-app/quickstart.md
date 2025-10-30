# Quickstart Guide: Todo App Development

**Feature**: 001-todo-crud-app
**Last Updated**: 2025-10-30

This guide helps developers set up and start developing the Todo App.

---

## Prerequisites

### Required Software

**Backend**:
- Python 3.11 or higher
- PostgreSQL 15 or higher
- uv package manager: [Install guide](https://github.com/astral-sh/uv)

**Frontend**:
- Node.js 18+ (LTS recommended)
- npm or pnpm or yarn

**Tools**:
- Git
- VS Code (recommended) or your preferred IDE
- Docker Desktop (optional, for PostgreSQL)

### System Requirements

- OS: Windows 10+, macOS 11+, or Linux
- RAM: 8GB minimum, 16GB recommended
- Disk: 2GB free space for dependencies

---

## Initial Setup

### 1. Clone and Navigate

```bash
# Assuming you're already in the project
cd D:\Udemy\todo-app
```

### 2. Database Setup

**Option A: Docker (Recommended)**

```bash
# Create docker-compose.yml in project root
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: todoapp_db
    environment:
      POSTGRES_DB: todoapp
      POSTGRES_USER: todouser
      POSTGRES_PASSWORD: todopass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todouser"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
EOF

# Start PostgreSQL
docker-compose up -d

# Verify it's running
docker-compose ps
```

**Option B: Local PostgreSQL Installation**

```bash
# Install PostgreSQL (example for macOS)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
psql postgres -c "CREATE DATABASE todoapp;"
psql postgres -c "CREATE USER todouser WITH PASSWORD 'todopass';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE todoapp TO todouser;"
```

### 3. Backend Setup

```bash
# Navigate to backend directory (will be created during implementation)
cd backend

# Install uv if not already installed
# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Initialize Python project (if pyproject.toml doesn't exist)
uv init

# Add dependencies
uv add fastapi sqlalchemy[asyncio] pydantic uvicorn[standard] asyncpg python-dotenv

# Add dev dependencies
uv add --dev pytest pytest-asyncio httpx ruff mypy

# Create .env file
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql+asyncpg://todouser:todopass@localhost:5432/todoapp

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true

# CORS Configuration
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Logging
LOG_LEVEL=INFO
EOF

# Create directory structure (if not exists)
mkdir -p src/models src/schemas src/services src/api/routes
mkdir -p tests/unit tests/integration

# Run database migrations (after models are created)
# uv run alembic upgrade head
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (will be created during implementation)
cd ../frontend

# Create Vite + React + TypeScript project (if not exists)
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install additional packages
npm install @mui/material @emotion/react @emotion/styled \
  @tanstack/react-query axios react-hook-form zod \
  @hookform/resolvers react-router-dom

# Install dev dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event vitest jsdom msw

# Create .env file
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000/api
EOF

# Create directory structure (if not exists)
mkdir -p src/components src/pages src/services src/hooks src/types src/validation
mkdir -p tests/unit/components tests/integration
```

---

## Running the Application

### Development Mode

**Terminal 1 - Database** (if using Docker):
```bash
docker-compose up
```

**Terminal 2 - Backend**:
```bash
cd backend

# Run with auto-reload
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Or with custom settings
uv run python -m uvicorn src.main:app --reload
```

The backend will be available at:
- API: http://localhost:8000/api
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Terminal 3 - Frontend**:
```bash
cd frontend

# Start Vite dev server
npm run dev
```

The frontend will be available at: http://localhost:5173

### Verify Setup

```bash
# Check backend health
curl http://localhost:8000/health

# Check database connection
curl http://localhost:8000/api/todos

# Check frontend (open browser)
open http://localhost:5173
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
# Already on: 001-todo-crud-app
git status

# If needed, create new branch
# git checkout -b 001-todo-crud-app
```

### 2. TDD Workflow (Example: Create Todo Endpoint)

**Step 1: Write Test First (Red)**

```python
# backend/tests/integration/test_api.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_todo(client: AsyncClient):
    """Test creating a new todo"""
    response = await client.post(
        "/api/todos",
        json={"title": "Buy groceries", "content": "Milk, eggs, bread"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy groceries"
    assert data["content"] == "Milk, eggs, bread"
    assert data["is_completed"] is False
    assert "id" in data
    assert "created_at" in data
```

Run test (should fail):
```bash
cd backend
uv run pytest tests/integration/test_api.py::test_create_todo
```

**Step 2: Implement Code (Green)**

```python
# backend/src/api/routes/todos.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas.todo import TodoCreate, TodoResponse
from src.services.todo_service import TodoService
from src.database import get_db

router = APIRouter(prefix="/api/todos", tags=["todos"])

@router.post("", response_model=TodoResponse, status_code=201)
async def create_todo(
    todo: TodoCreate,
    db: AsyncSession = Depends(get_db)
):
    service = TodoService(db)
    return await service.create_todo(todo)
```

Run test (should pass):
```bash
uv run pytest tests/integration/test_api.py::test_create_todo
```

**Step 3: Refactor**
- Improve code structure
- Extract common logic
- Keep tests green

### 3. Running Tests

**Backend**:
```bash
cd backend

# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=html

# Run specific test file
uv run pytest tests/unit/test_models.py

# Run with verbose output
uv run pytest -v

# Run tests matching pattern
uv run pytest -k "test_create"
```

**Frontend**:
```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- TodoForm.test.tsx
```

### 4. Code Quality Checks

**Backend**:
```bash
cd backend

# Linting and formatting with ruff
uv run ruff check .
uv run ruff format .

# Type checking with mypy
uv run mypy src

# Run all checks
uv run ruff check . && uv run ruff format . && uv run mypy src
```

**Frontend**:
```bash
cd frontend

# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check

# Or using package.json scripts:
npm run lint:fix
```

### 5. Database Migrations

**Create Migration** (after modifying models):
```bash
cd backend

# Initialize Alembic (first time only)
uv run alembic init alembic

# Create migration
uv run alembic revision --autogenerate -m "Create todos table"

# Apply migration
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1
```

---

## Common Tasks

### Add a New Endpoint

1. **Write test** in `backend/tests/integration/test_api.py`
2. **Create Pydantic schema** in `backend/src/schemas/todo.py`
3. **Add service method** in `backend/src/services/todo_service.py`
4. **Add route handler** in `backend/src/api/routes/todos.py`
5. **Run tests** and ensure they pass

### Add a New Component

1. **Write test** in `frontend/tests/unit/components/`
2. **Create component** in `frontend/src/components/`
3. **Add types** in `frontend/src/types/` if needed
4. **Create Zod schema** in `frontend/src/validation/` if form component
5. **Run tests** and ensure they pass

### Debug the Backend

```bash
# Run with debugger
uv run python -m debugpy --listen 5678 --wait-for-client -m uvicorn src.main:app --reload

# Or use VS Code launch configuration
```

**VS Code launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["src.main:app", "--reload"],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/backend"
      }
    }
  ]
}
```

### Debug the Frontend

```bash
# Open browser DevTools
# Set breakpoints in VS Code or browser

# Use React DevTools extension
# Install: https://react.dev/learn/react-developer-tools
```

---

## Troubleshooting

### Database Connection Issues

**Error**: "Could not connect to database"

```bash
# Check if PostgreSQL is running
docker-compose ps  # if using Docker
psql -U todouser -d todoapp -h localhost  # test connection

# Check .env file has correct credentials
cat backend/.env

# Verify DATABASE_URL format
# postgresql+asyncpg://user:password@host:port/database
```

### Port Already in Use

**Error**: "Address already in use"

```bash
# Find process using port 8000 (backend)
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
uv run uvicorn src.main:app --reload --port 8001
```

### Frontend Can't Connect to Backend

**Error**: CORS error or network error

1. **Check backend is running**: `curl http://localhost:8000/api/todos`
2. **Verify CORS settings** in `backend/src/main.py`
3. **Check VITE_API_URL** in `frontend/.env`
4. **Restart both servers** after .env changes

### Module Not Found Errors

**Backend**:
```bash
# Ensure all dependencies are installed
cd backend
uv sync

# Check virtual environment is activated
which python  # should point to .venv/bin/python
```

**Frontend**:
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

After setup is complete:

1. **Review the spec**: Read `specs/001-todo-crud-app/spec.md`
2. **Study the data model**: Review `specs/001-todo-crud-app/data-model.md`
3. **Check the API contract**: Open `specs/001-todo-crud-app/contracts/openapi.yaml`
4. **Start with tests**: Begin TDD cycle for first user story
5. **Implement incrementally**: One feature at a time, test-first

---

## Useful Commands Cheat Sheet

### Backend

```bash
# Development
uv run uvicorn src.main:app --reload

# Testing
uv run pytest
uv run pytest --cov=src

# Code quality
uv run ruff check .
uv run ruff format .
uv run mypy src

# Database
uv run alembic upgrade head
uv run alembic revision --autogenerate -m "Message"

# Add dependencies
uv add package-name
uv add --dev dev-package-name
```

### Frontend

```bash
# Development
npm run dev

# Testing
npm test
npm run test:coverage

# Build
npm run build
npm run preview

# Code quality
npm run lint
npm run format
npm run type-check
```

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean up
docker-compose down -v  # removes volumes
```

---

## Resources

### Documentation

- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/en/20/
- **Pydantic**: https://docs.pydantic.dev/latest/
- **React**: https://react.dev/
- **MUI**: https://mui.com/material-ui/
- **TanStack Query**: https://tanstack.com/query/latest
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/

### Project Files

- Feature Spec: `specs/001-todo-crud-app/spec.md`
- Implementation Plan: `specs/001-todo-crud-app/plan.md`
- Data Model: `specs/001-todo-crud-app/data-model.md`
- API Contracts: `specs/001-todo-crud-app/contracts/`
- Constitution: `.specify/memory/constitution.md`

---

## Getting Help

1. **Check documentation** in `specs/001-todo-crud-app/`
2. **Review constitution** for coding principles
3. **Run tests** to understand expected behavior
4. **Check OpenAPI docs** at http://localhost:8000/docs
5. **Use browser DevTools** for frontend debugging

Happy coding!
