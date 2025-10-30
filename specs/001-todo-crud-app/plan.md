# Implementation Plan: Todo App with CRUD Operations

**Branch**: `001-todo-crud-app` | **Date**: 2025-10-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-crud-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a full-stack todo application with CRUD operations featuring:
- Frontend: React 19 + MUI v7 + TanStack Query v5 + React Hook Form + Zod validation
- Backend: FastAPI + SQLAlchemy v2 + Pydantic v2, managed with uv
- Database: PostgreSQL with PascalCase naming convention (e.g., "Id", "CreatedAt")
- Core features: Create, read, update, delete todos; track completion status with timestamps; confirmation dialog for deletion

## Technical Context

**Backend**
- **Language/Version**: Python 3.11+
- **Framework**: FastAPI (latest stable)
- **ORM**: SQLAlchemy v2.x (async engine)
- **Validation**: Pydantic v2.x
- **Package Manager**: uv (modern Python package manager)
- **Database**: PostgreSQL 15+ (PascalCase naming: Id, Title, Content, CreatedAt, CompletedAt, IsCompleted)

**Frontend**
- **Language/Version**: TypeScript 5.x
- **Framework**: React 19
- **UI Library**: MUI (Material-UI) v7
- **Data Fetching**: TanStack Query (React Query) v5
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6
- **Build Tool**: Vite

**Testing**
- **Backend**: pytest + pytest-asyncio
- **Frontend**: Vitest + React Testing Library + MSW (Mock Service Worker)

**Target Platform**: Web application (desktop and mobile browsers)

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- API response time < 200ms p95 for CRUD operations
- Frontend initial load < 3 seconds
- Support 1,000 todos per user without UI lag

**Constraints**:
- Title max 200 characters
- Content max 10,000 characters
- Case-sensitive "DELETE" confirmation
- Must handle up to 1,000 todos efficiently

**Scale/Scope**:
- Single-user application (can be extended to multi-user)
- 4 core user stories (Create, Complete, Edit, Delete)
- ~5-8 screens/components (Overview, Create Form, Edit Form, Delete Dialog)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify this feature complies with `.specify/memory/constitution.md`:

- [x] **TDD Readiness**: Acceptance criteria in spec.md are specific enough to write tests first
  - ✓ All user stories have detailed Given-When-Then scenarios
  - ✓ Edge cases explicitly documented (whitespace validation, deletion confirmation)
  - ✓ Success criteria are measurable and testable

- [x] **Simplicity**: No speculative features or premature abstraction planned
  - ✓ Direct CRUD operations with no unnecessary patterns
  - ✓ Single-user scope (multi-user deferred until needed)
  - ✓ Standard REST API endpoints without over-engineering

- [x] **Readability**: Design favors clear naming and single-responsibility modules
  - ✓ Clear component separation: TodoList, TodoForm, TodoItem, DeleteDialog
  - ✓ Backend: models, services, API routes cleanly separated
  - ✓ Meaningful names: CreateTodoRequest, TodoResponse, TodoService

- [x] **Maintainability**: Clear module boundaries and loose coupling in architecture
  - ✓ Frontend/backend separation via REST API
  - ✓ Database access abstracted through SQLAlchemy ORM
  - ✓ Validation logic centralized (Zod on frontend, Pydantic on backend)

- [x] **Quality Gates**: Linting, testing, and review processes defined
  - ✓ Backend: pytest + ruff/black for linting
  - ✓ Frontend: Vitest + ESLint + Prettier
  - ✓ Type safety: TypeScript + Pydantic

*No constitution violations detected. All principles satisfied.*

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── todo.py              # SQLAlchemy Todo model
│   ├── schemas/
│   │   └── todo.py              # Pydantic request/response schemas
│   ├── services/
│   │   └── todo_service.py      # Business logic for todo operations
│   ├── api/
│   │   └── routes/
│   │       └── todos.py         # FastAPI route handlers
│   ├── database.py              # Database connection and session management
│   └── main.py                  # FastAPI application entry point
├── tests/
│   ├── unit/
│   │   ├── test_models.py
│   │   ├── test_schemas.py
│   │   └── test_services.py
│   ├── integration/
│   │   └── test_api.py
│   └── conftest.py              # Pytest fixtures
├── pyproject.toml               # uv configuration
└── README.md

frontend/
├── src/
│   ├── components/
│   │   ├── TodoList.tsx         # Overview display (in-progress + completed sections)
│   │   ├── TodoItem.tsx         # Single todo item display
│   │   ├── TodoForm.tsx         # Create/edit todo form
│   │   └── DeleteDialog.tsx     # Confirmation dialog for deletion
│   ├── pages/
│   │   ├── TodosPage.tsx        # Main page with overview
│   │   ├── CreateTodoPage.tsx   # Create new todo
│   │   └── EditTodoPage.tsx     # Edit existing todo
│   ├── services/
│   │   ├── api.ts               # Axios instance configuration
│   │   └── todoService.ts       # API calls for CRUD operations
│   ├── hooks/
│   │   └── useTodos.ts          # TanStack Query hooks
│   ├── types/
│   │   └── todo.ts              # TypeScript interfaces
│   ├── validation/
│   │   └── todoSchema.ts        # Zod validation schemas
│   ├── App.tsx                  # Router configuration
│   └── main.tsx                 # Application entry point
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   └── services/
│   ├── integration/
│   │   └── TodosPage.test.tsx
│   └── setup.ts                 # Test configuration
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Structure Decision**: Web application structure with separate frontend and backend directories. Backend uses standard Python package layout with src/ for production code and tests/ for test files. Frontend follows modern React project structure with components, pages, services, and hooks separated by concern. This aligns with the constitution's maintainability principle of clear module boundaries.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected**. The design adheres to all constitution principles without requiring justification for complexity.

---

## Post-Design Constitution Re-evaluation

*Re-check performed after Phase 1 design completion*

### TDD Readiness ✓ PASS

**Assessment**: All acceptance criteria from spec.md are testable and specific enough for TDD.

- Given-When-Then scenarios map directly to test cases
- Edge cases explicitly documented (whitespace validation, deletion confirmation)
- API contract defined in OpenAPI spec provides test expectations
- Data model defines validation rules testable at all layers

**Example Test First Approach**:
```python
# Test first (Red)
def test_create_todo_validates_title():
    response = client.post("/api/todos", json={"title": "   "})
    assert response.status_code == 422
    assert "whitespace" in response.json()["detail"][0]["msg"]

# Then implement (Green)
# Then refactor while keeping tests green
```

### Simplicity & YAGNI ✓ PASS

**Assessment**: Design uses standard patterns without premature abstraction.

- Direct SQLAlchemy ORM access in services (no repository pattern overhead)
- Standard REST endpoints (no GraphQL complexity)
- Single-user scope (multi-user deferred)
- No caching layer (premature optimization)
- No authentication (not in requirements)
- No search/filter/tags (not in current user stories)

**Validation**: All complexity is justified by current requirements. No speculative features added.

### Readability ✓ PASS

**Assessment**: Design promotes clear, single-responsibility modules.

**Backend Structure**:
- `models/` - Pure data models (SQLAlchemy)
- `schemas/` - Request/response validation (Pydantic)
- `services/` - Business logic (TodoService with clear methods)
- `api/routes/` - HTTP handlers (thin layer, delegates to services)

**Frontend Structure**:
- `components/` - Reusable UI components (TodoItem, TodoForm)
- `pages/` - Route-level components (TodosPage, EditTodoPage)
- `services/` - API calls (todoService with CRUD methods)
- `hooks/` - React Query hooks (useTodos, useCreateTodo)

**Naming Quality**: All names are self-documenting (TodoService.create_todo, useTodos, DeleteDialog).

### Maintainability ✓ PASS

**Assessment**: Clear boundaries and loose coupling achieved.

**Module Boundaries**:
- Frontend ↔ Backend: REST API contract (OpenAPI spec)
- Service ↔ Database: SQLAlchemy ORM abstraction
- Components ↔ API: TanStack Query + service layer
- Validation: Centralized (Zod frontend, Pydantic backend, DB constraints)

**Coupling Analysis**:
- Frontend doesn't depend on backend implementation details (only API contract)
- Services can be tested independently with mocked database
- Components can be tested with MSW (mocked API)
- Database schema changes isolated to models + migrations

**Configuration Separation**:
- Backend: .env file (DATABASE_URL, CORS_ORIGINS)
- Frontend: .env file (VITE_API_URL)
- No hardcoded values in production code

### Quality Gates ✓ PASS

**Assessment**: All quality tools and processes defined.

**Backend Quality Gates**:
- Linting: ruff (configured in pyproject.toml)
- Formatting: ruff format (auto-formatting)
- Type Checking: mypy with strict mode
- Testing: pytest with >80% coverage requirement
- API Docs: Auto-generated OpenAPI spec

**Frontend Quality Gates**:
- Linting: ESLint with React plugin
- Formatting: Prettier
- Type Checking: TypeScript with strict mode
- Testing: Vitest + React Testing Library

**CI/CD Readiness** (future):
- All checks can be automated in GitHub Actions
- Tests run in isolation (no shared state)
- Build commands defined in package.json / pyproject.toml

---

## Final Design Approval

**Constitution Compliance**: ✓ PASS (5/5 principles satisfied)

**Design Artifacts Generated**:
- ✓ Technical Context filled with all technology decisions
- ✓ Phase 0: research.md with best practices and technical rationale
- ✓ Phase 1: data-model.md with entity definitions and validation
- ✓ Phase 1: contracts/openapi.yaml with complete API specification
- ✓ Phase 1: contracts/api-types.ts with TypeScript interfaces
- ✓ Phase 1: quickstart.md with developer onboarding guide
- ✓ Agent context updated (CLAUDE.md created)

**Ready for Implementation**: YES

The design is simple, testable, maintainable, and fully documented. All artifacts are ready for the `/speckit.tasks` command to generate the implementation task list.
