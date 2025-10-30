# Claude Code Context

This file provides context and guidelines for Claude Code when working on this project.

---

## Project Overview

**Project**: Todo App with CRUD Operations
**Feature Branch**: 001-todo-crud-app
**Type**: Web Application (Full-stack)

### Description

A full-stack todo application with CRUD operations featuring user-friendly interfaces for creating, viewing, updating, and deleting todos. Todos have completion status tracking with timestamps, and deletion requires explicit confirmation.

---

## Technology Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI (async)
- **ORM**: SQLAlchemy v2.x (async engine)
- **Validation**: Pydantic v2.x
- **Package Manager**: uv
- **Database**: PostgreSQL 15+ (PascalCase naming convention)
- **Testing**: pytest + pytest-asyncio + httpx

### Frontend
- **Language**: TypeScript 5.x
- **Framework**: React 19
- **UI Library**: Material-UI (MUI) v7
- **Data Fetching**: TanStack Query (React Query) v5
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library + MSW

### Database
- **System**: PostgreSQL 15+
- **Naming Convention**: PascalCase (e.g., Id, Title, CreatedAt, CompletedAt)

---

## Project Structure

```
backend/
├── src/
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── api/routes/      # FastAPI routes
│   ├── database.py      # DB connection
│   └── main.py          # FastAPI app
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
└── pyproject.toml

frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   ├── validation/      # Zod schemas
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
└── vite.config.ts

specs/001-todo-crud-app/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Technical decisions
├── data-model.md        # Data model
├── quickstart.md        # Developer guide
└── contracts/           # API contracts
    ├── openapi.yaml
    ├── api-types.ts
    └── README.md
```

---

## Development Principles

The project follows a strict constitution defined in `.specify/memory/constitution.md`. Key principles:

### 1. Test-Driven Development (TDD) - NON-NEGOTIABLE

- **Red-Green-Refactor**: Write failing tests first, then implement, then refactor
- **No code without tests**: Implementation begins ONLY after tests are written
- **Coverage requirement**: Maintain >80% test coverage for business logic

### 2. Simplicity & YAGNI

- Start with the simplest solution
- Add abstraction only when needed (Rule of Three)
- Reject speculative features
- Every layer of indirection must be justified

### 3. Readability First

- Self-documenting code with meaningful names
- Single Responsibility: One function does one thing
- Max function length: 50 lines (hard limit: 100 with justification)
- Max cyclomatic complexity: 10 per function
- Comments explain "why", not "what"

### 4. Maintainability

- Loose coupling between modules
- High cohesion within modules
- Clear module boundaries
- Configuration separated from code
- Dependencies explicit and minimal

### 5. Quality Standards

- Zero warnings from linters
- All tests passing before merge
- Code reviews required
- Build succeeds on CI/CD
- No commented-out code
- No TODO comments without tracked issues

---

## Code Quality Tools

### Backend
- **Linter/Formatter**: ruff
- **Type Checker**: mypy
- **Testing**: pytest

### Frontend
- **Linter**: ESLint
- **Formatter**: Prettier
- **Type Checker**: TypeScript compiler
- **Testing**: Vitest

---

## API Design

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List all todos (filterable by status) |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/{id}` | Get a single todo |
| PATCH | `/api/todos/{id}` | Update todo title/content |
| PATCH | `/api/todos/{id}/complete` | Mark as completed/in-progress |
| DELETE | `/api/todos/{id}` | Delete a todo |

### Validation Rules

**Title**:
- Required, 1-200 characters
- Cannot be only whitespace
- Automatically trimmed

**Content**:
- Optional, max 10,000 characters
- Can be empty or whitespace

**Completion**:
- Idempotent operations
- CompletedAt set to timestamp when completed
- CompletedAt cleared when reverted to in-progress

### Status Codes

- 200 OK: Successful GET/PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 404 Not Found: Resource doesn't exist
- 422 Validation Error: Invalid input
- 500 Internal Server Error: Server error

---

## Database Schema

### Table: Todos

```sql
CREATE TABLE "Todos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Content" TEXT DEFAULT '',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CompletedAt" TIMESTAMP WITH TIME ZONE,
    "IsCompleted" BOOLEAN GENERATED ALWAYS AS ("CompletedAt" IS NOT NULL) STORED,
    CONSTRAINT "title_not_empty" CHECK (LENGTH(TRIM("Title")) > 0)
);

CREATE INDEX "idx_todos_created_at" ON "Todos"("CreatedAt" DESC);
CREATE INDEX "idx_todos_is_completed" ON "Todos"("IsCompleted");
```

---

## Common Commands

### Backend

```bash
cd backend

# Run server
uv run uvicorn src.main:app --reload

# Run tests
uv run pytest
uv run pytest --cov=src

# Code quality
uv run ruff check .
uv run ruff format .
uv run mypy src

# Add dependencies
uv add package-name
```

### Frontend

```bash
cd frontend

# Run dev server
npm run dev

# Run tests
npm test
npm run test:coverage

# Code quality
npm run lint
npm run format
npm run type-check

# Build
npm run build
```

### Database

```bash
# Start PostgreSQL (Docker)
docker-compose up -d

# Run migrations
cd backend
uv run alembic upgrade head
```

---

## Current Feature: Todo CRUD

### User Stories (Priority Order)

1. **P1**: Create and view todos (title, content, timestamps)
2. **P2**: Mark todos as completed/in-progress with timestamps
3. **P2**: Edit todos (preserves status and timestamps)
4. **P3**: Delete todos with confirmation (type "DELETE")

### Success Criteria

- Create todo in <30s
- Find/view todo in <10s
- Edit todo in <45s
- Delete confirmation in <15s
- 100% prevention of accidental deletions
- No data loss between sessions
- Support 1,000 todos without performance degradation

---

## Development Workflow

1. **Specification** → `spec.md` with user stories and acceptance criteria
2. **Planning** → `plan.md` with technical approach and architecture
3. **Test Creation** (Red) → Write failing tests for acceptance criteria
4. **Implementation** (Green) → Write minimal code to pass tests
5. **Refactoring** → Improve structure while keeping tests green
6. **Review & Merge** → Code review, all gates passing

---

## Key Files to Reference

- **Feature Spec**: `specs/001-todo-crud-app/spec.md`
- **Implementation Plan**: `specs/001-todo-crud-app/plan.md`
- **Technical Research**: `specs/001-todo-crud-app/research.md`
- **Data Model**: `specs/001-todo-crud-app/data-model.md`
- **API Contracts**: `specs/001-todo-crud-app/contracts/openapi.yaml`
- **Developer Guide**: `specs/001-todo-crud-app/quickstart.md`
- **Constitution**: `.specify/memory/constitution.md`

---

## Important Notes

### Naming Conventions

- **Database**: PascalCase (Id, Title, CreatedAt, CompletedAt, IsCompleted)
- **Python**: snake_case for functions/variables, PascalCase for classes
- **TypeScript**: camelCase for functions/variables, PascalCase for types/interfaces

### Testing Strategy

- **Unit Tests**: Test individual functions in isolation (mocked dependencies)
- **Integration Tests**: Test module interactions (real dependencies where feasible)
- **Acceptance Tests**: Test user scenarios from spec.md (Given-When-Then)

### Performance Targets

- API response time: <200ms p95
- Frontend initial load: <3s
- Support 1,000 todos without UI lag
- Database queries optimized with indexes

---

## When Working on This Project

1. **Always check constitution first**: `.specify/memory/constitution.md`
2. **Read the spec**: Understand acceptance criteria before coding
3. **Write tests first**: TDD is mandatory, not optional
4. **Keep it simple**: Avoid over-engineering (YAGNI principle)
5. **Focus on readability**: Code is read more than written
6. **Run quality checks**: Linting and type checking before committing
7. **Update documentation**: Keep specs in sync with implementation

---

## Getting Help

- Check `specs/001-todo-crud-app/quickstart.md` for setup and troubleshooting
- Review `specs/001-todo-crud-app/research.md` for technical decisions
- Consult OpenAPI docs at http://localhost:8000/docs when backend is running
- Use browser DevTools for frontend debugging

---

**Last Updated**: 2025-10-30
**Feature Branch**: 001-todo-crud-app
**Constitution Version**: 1.0.0
