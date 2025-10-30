# Tasks: Todo App with CRUD Operations

**Feature**: 001-todo-crud-app
**Generated**: 2025-10-30
**Input**: Design documents from `/specs/001-todo-crud-app/`

**Tests**: Tests are MANDATORY per constitution (TDD principle). Every user story MUST have tests written BEFORE implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [Story?] Description`

- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions
- **Note**: All tasks should be executed sequentially (no parallel execution)

## Path Conventions

This is a **web application** with separate backend and frontend:
- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **Database**: PostgreSQL with PascalCase naming (Todos, Id, Title, CreatedAt, etc.)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

### Backend Setup

- [X] T001 Initialize backend project with uv in backend/ directory (run: uv init)
- [X] T002 Add backend dependencies to backend/pyproject.toml (fastapi, sqlalchemy[asyncio], pydantic, uvicorn[standard], asyncpg, python-dotenv, alembic)
- [X] T003 Add backend dev dependencies to backend/pyproject.toml (pytest, pytest-asyncio, httpx, ruff, mypy)
- [X] T004 Create backend directory structure (src/models, src/schemas, src/services, src/api/routes, tests/unit, tests/integration)
- [X] T005 Create backend/.env file with DATABASE_URL and CORS configuration
- [X] T006 Configure ruff and mypy in backend/pyproject.toml

### Frontend Setup

- [X] T007 Initialize frontend project with Vite + React + TypeScript in frontend/ directory (npm create vite)
- [X] T008 Add frontend dependencies to frontend/package.json (@mui/material, @emotion/react, @emotion/styled, @tanstack/react-query, axios, react-hook-form, zod, @hookform/resolvers, react-router-dom)
- [X] T009 Add frontend dev dependencies to frontend/package.json (@testing-library/react, @testing-library/jest-dom, @testing-library/user-event, vitest, jsdom, msw)
- [X] T010 Create frontend directory structure (src/components, src/pages, src/services, src/hooks, src/types, src/validation, tests/unit, tests/integration)
- [X] T011 Create frontend/.env file with VITE_API_URL
- [X] T012 Configure ESLint and Prettier in frontend/

### Database Setup

- [X] T013 ~~Create docker-compose.yml in project root for PostgreSQL 15~~ (Using local PostgreSQL 17 instead)
- [X] T014 Create database migration script for Todos table with PascalCase columns in backend/alembic/

### Contracts & Types

- [X] T015 Copy contracts/api-types.ts to frontend/src/types/api-types.ts
- [X] T016 Verify Zod schemas are properly configured in frontend/src/types/api-types.ts

**Checkpoint**: Project structure created, dependencies installed, database ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [X] T017 Create database connection module in backend/src/database.py with async engine and session management
- [X] T018 Create base SQLAlchemy model in backend/src/models/__init__.py
- [X] T019 Create FastAPI app initialization in backend/src/main.py with CORS middleware
- [X] T020 Create pytest fixtures in backend/tests/conftest.py (db_session, async_client)
- [X] T021 Create base test utilities in backend/tests/conftest.py

### Frontend Foundation

- [X] T022 Create Axios instance configuration in frontend/src/services/api.ts with base URL and error interceptors
- [X] T023 Create TanStack Query provider wrapper in frontend/src/App.tsx
- [X] T024 Create MUI theme configuration in frontend/src/theme.ts
- [X] T025 Create MSW handlers setup in frontend/tests/setup.ts
- [X] T026 Create test utilities in frontend/tests/setup.ts

**Checkpoint**: Foundation ready - user story implementation can now begin sequentially

---

## Phase 3: User Story 1 - Create and View Todo Items (Priority: P1) 🎯 MVP

**Goal**: Users can create new todo items with title and content, then view all their todos in an overview with creation timestamps.

**Independent Test**: Create one or more todo items and verify they appear in the overview with correct title, content, and creation timestamp.

### Tests for User Story 1 (MANDATORY - TDD Red Phase) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation**
> This is the RED phase of TDD - tests must fail to prove they test the right thing

#### Backend Tests

- [ ] T027 [US1] Contract test for POST /api/todos in backend/tests/integration/test_todos_api.py (test_create_todo_success, test_create_todo_validates_title, test_create_todo_whitespace_title_rejected)
- [ ] T028 [US1] Contract test for GET /api/todos in backend/tests/integration/test_todos_api.py (test_list_todos_empty, test_list_todos_sorted_by_created_at)
- [ ] T029 [US1] Unit test for Todo model in backend/tests/unit/test_models.py (test_todo_creation, test_title_validation, test_is_completed_property)
- [ ] T030 [US1] Unit test for TodoService.create_todo in backend/tests/unit/test_services.py (test_create_todo_trims_whitespace)
- [ ] T031 [US1] Unit test for TodoService.list_todos in backend/tests/unit/test_services.py (test_list_todos_sorted)

#### Frontend Tests

- [ ] T032 [US1] Unit test for TodoForm component in frontend/tests/unit/components/TodoForm.test.tsx (test_validates_required_title, test_validates_title_length, test_submits_valid_data)
- [ ] T033 [US1] Unit test for TodoList component in frontend/tests/unit/components/TodoList.test.tsx (test_displays_todos, test_shows_empty_state)
- [ ] T034 [US1] Integration test for create todo flow in frontend/tests/integration/CreateTodo.test.tsx (test_create_todo_e2e)

### Implementation for User Story 1

#### Backend Implementation

- [ ] T035 [US1] Create Todo SQLAlchemy model in backend/src/models/todo.py (Id, Title, Content, CreatedAt, CompletedAt, IsCompleted property, PascalCase column names)
- [ ] T036 [US1] Create Pydantic schemas in backend/src/schemas/todo.py (TodoCreate, TodoResponse with title validation and trimming)
- [ ] T037 [US1] Create TodoService in backend/src/services/todo_service.py (create_todo, list_todos methods)
- [ ] T038 [US1] Create API router in backend/src/api/routes/todos.py (POST /api/todos, GET /api/todos endpoints)
- [ ] T039 [US1] Register todos router in backend/src/main.py

#### Frontend Implementation

- [ ] T040 [US1] Create Todo type interfaces in frontend/src/types/todo.ts (re-export from api-types.ts)
- [ ] T041 [US1] Create validation schemas in frontend/src/validation/todoSchema.ts (createTodoSchema using Zod)
- [ ] T042 [US1] Create todoService API client in frontend/src/services/todoService.ts (createTodo, getTodos with Zod validation)
- [ ] T043 [US1] Create TanStack Query hooks in frontend/src/hooks/useTodos.ts (useTodos, useCreateTodo with optimistic updates)
- [ ] T044 [US1] Create TodoForm component in frontend/src/components/TodoForm.tsx (React Hook Form + Zod validation)
- [ ] T045 [US1] Create TodoItem component in frontend/src/components/TodoItem.tsx (display single todo with timestamps)
- [ ] T046 [US1] Create TodoList component in frontend/src/components/TodoList.tsx (display in-progress and completed sections)
- [ ] T047 [US1] Create TodosPage in frontend/src/pages/TodosPage.tsx (main overview page)
- [ ] T048 [US1] Create CreateTodoPage in frontend/src/pages/CreateTodoPage.tsx (create new todo page)
- [ ] T049 [US1] Setup routing in frontend/src/App.tsx (/, /create routes)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create and view todos

---

## Phase 4: User Story 2 - Mark Todos as Completed (Priority: P2)

**Goal**: Users can mark todo items as completed (with completion timestamp) and revert completed todos back to in-progress.

**Independent Test**: Create a todo, mark it as completed, verify completion timestamp is recorded and status changes in overview. Revert to in-progress and verify timestamp is removed.

### Tests for User Story 2 (MANDATORY - TDD Red Phase) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation**

#### Backend Tests

- [ ] T050 [US2] Contract test for PATCH /api/todos/{id}/complete in backend/tests/integration/test_todos_api.py (test_complete_todo, test_uncomplete_todo, test_complete_idempotent)
- [ ] T051 [US2] Unit test for TodoService.complete_todo in backend/tests/unit/test_services.py (test_sets_completed_at, test_clears_completed_at)

#### Frontend Tests

- [ ] T052 [US2] Unit test for TodoItem completion toggle in frontend/tests/unit/components/TodoItem.test.tsx (test_complete_button_works, test_uncomplete_button_works)
- [ ] T053 [US2] Integration test for completion flow in frontend/tests/integration/CompleteTodo.test.tsx (test_complete_todo_e2e)

### Implementation for User Story 2

#### Backend Implementation

- [ ] T054 [US2] Add TodoComplete Pydantic schema in backend/src/schemas/todo.py (is_completed field)
- [ ] T055 [US2] Add complete_todo method to TodoService in backend/src/services/todo_service.py (sets/clears CompletedAt timestamp)
- [ ] T056 [US2] Add PATCH /api/todos/{id}/complete endpoint in backend/src/api/routes/todos.py

#### Frontend Implementation

- [ ] T057 [US2] Add completeTodo method to todoService in frontend/src/services/todoService.ts (PATCH /api/todos/{id}/complete)
- [ ] T058 [US2] Add useCompleteTodo mutation hook in frontend/src/hooks/useTodos.ts (optimistic update)
- [ ] T059 [US2] Add completion toggle button to TodoItem component in frontend/src/components/TodoItem.tsx (checkbox or button)
- [ ] T060 [US2] Update TodoList component in frontend/src/components/TodoList.tsx to show completed_at timestamp for completed todos

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - create, view, and complete todos

---

## Phase 5: User Story 3 - Edit Todo Items (Priority: P2)

**Goal**: Users can edit any todo item's title and content, regardless of completion status.

**Independent Test**: Create a todo, edit its title and content, verify changes are saved. Edit a completed todo to ensure status doesn't block editing.

### Tests for User Story 3 (MANDATORY - TDD Red Phase) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation**

#### Backend Tests

- [ ] T061 [US3] Contract test for PATCH /api/todos/{id} in backend/tests/integration/test_todos_api.py (test_update_todo_title, test_update_todo_content, test_update_preserves_completion, test_update_validates_title)
- [ ] T062 [US3] Contract test for GET /api/todos/{id} in backend/tests/integration/test_todos_api.py (test_get_todo_by_id, test_get_todo_not_found)
- [ ] T063 [US3] Unit test for TodoService.update_todo in backend/tests/unit/test_services.py (test_update_preserves_created_at, test_update_preserves_completed_at)

#### Frontend Tests

- [ ] T064 [US3] Unit test for TodoForm in edit mode in frontend/tests/unit/components/TodoForm.test.tsx (test_loads_existing_data, test_validates_on_edit)
- [ ] T065 [US3] Integration test for edit todo flow in frontend/tests/integration/EditTodo.test.tsx (test_edit_todo_e2e)

### Implementation for User Story 3

#### Backend Implementation

- [ ] T066 [US3] Add TodoUpdate Pydantic schema in backend/src/schemas/todo.py (optional title, content)
- [ ] T067 [US3] Add get_todo_by_id method to TodoService in backend/src/services/todo_service.py
- [ ] T068 [US3] Add update_todo method to TodoService in backend/src/services/todo_service.py (preserves timestamps and status)
- [ ] T069 [US3] Add GET /api/todos/{id} endpoint in backend/src/api/routes/todos.py
- [ ] T070 [US3] Add PATCH /api/todos/{id} endpoint in backend/src/api/routes/todos.py

#### Frontend Implementation

- [ ] T071 [US3] Add getTodoById and updateTodo methods to todoService in frontend/src/services/todoService.ts
- [ ] T072 [US3] Add useTodo and useUpdateTodo hooks in frontend/src/hooks/useTodos.ts
- [ ] T073 [US3] Update TodoForm component in frontend/src/components/TodoForm.tsx to support edit mode (isEdit prop)
- [ ] T074 [US3] Add edit button to TodoItem component in frontend/src/components/TodoItem.tsx (navigates to edit page)
- [ ] T075 [US3] Create EditTodoPage in frontend/src/pages/EditTodoPage.tsx (loads existing todo and shows form)
- [ ] T076 [US3] Add /edit/:id route in frontend/src/App.tsx

**Checkpoint**: All user stories 1, 2, and 3 should now work independently - create, view, complete, and edit todos

---

## Phase 6: User Story 4 - Delete Todo Items with Confirmation (Priority: P3)

**Goal**: Users can delete todo items after confirming by typing "DELETE" in a confirmation dialog.

**Independent Test**: Attempt to delete a todo, verify confirmation dialog appears, test that deletion only proceeds when "DELETE" is correctly entered.

### Tests for User Story 4 (MANDATORY - TDD Red Phase) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation**

#### Backend Tests

- [ ] T077 [US4] Contract test for DELETE /api/todos/{id} in backend/tests/integration/test_todos_api.py (test_delete_todo, test_delete_todo_not_found)
- [ ] T078 [US4] Unit test for TodoService.delete_todo in backend/tests/unit/test_services.py (test_delete_removes_todo)

#### Frontend Tests

- [ ] T079 [US4] Unit test for DeleteDialog component in frontend/tests/unit/components/DeleteDialog.test.tsx (test_requires_DELETE_text, test_cancel_works, test_case_sensitive)
- [ ] T080 [US4] Integration test for delete flow in frontend/tests/integration/DeleteTodo.test.tsx (test_delete_todo_e2e, test_prevent_accidental_deletion)

### Implementation for User Story 4

#### Backend Implementation

- [ ] T081 [US4] Add delete_todo method to TodoService in backend/src/services/todo_service.py
- [ ] T082 [US4] Add DELETE /api/todos/{id} endpoint in backend/src/api/routes/todos.py (returns 204 No Content)

#### Frontend Implementation

- [ ] T083 [US4] Add deleteTodo method to todoService in frontend/src/services/todoService.ts
- [ ] T084 [US4] Add useDeleteTodo mutation hook in frontend/src/hooks/useTodos.ts (optimistic update)
- [ ] T085 [US4] Create DeleteDialog component in frontend/src/components/DeleteDialog.tsx (confirmation with case-sensitive "DELETE" input)
- [ ] T086 [US4] Add delete button to TodoItem component in frontend/src/components/TodoItem.tsx (opens DeleteDialog)
- [ ] T087 [US4] Integrate DeleteDialog with TodosPage in frontend/src/pages/TodosPage.tsx (manages dialog state)

**Checkpoint**: All user stories should now be independently functional - full CRUD with completion tracking and safe deletion

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

### Code Quality

- [ ] T088 Run ruff check and format on backend (uv run ruff check . && uv run ruff format .)
- [ ] T089 Run mypy type checking on backend (uv run mypy src)
- [ ] T090 Run ESLint and Prettier on frontend (npm run lint && npm run format)
- [ ] T091 Run TypeScript compiler check on frontend (npm run type-check)

### Testing

- [ ] T092 Run all backend tests with coverage (uv run pytest --cov=src --cov-report=html)
- [ ] T093 Run all frontend tests with coverage (npm run test:coverage)
- [ ] T094 Verify >80% test coverage for backend business logic
- [ ] T095 Verify >80% test coverage for frontend components

### Performance & Optimization

- [ ] T096 Verify database indexes are created (idx_todos_created_at, idx_todos_is_completed)
- [ ] T097 Add loading states to all TanStack Query operations in frontend
- [ ] T098 Add error boundaries in frontend/src/App.tsx
- [ ] T099 Test with 1,000 todos to verify performance targets (<200ms API, <3s page load)

### Documentation

- [ ] T100 Update backend/README.md with setup and run instructions
- [ ] T101 Update frontend/README.md with setup and run instructions
- [ ] T102 Verify quickstart.md is accurate and complete
- [ ] T103 Generate OpenAPI spec from FastAPI and verify it matches contracts/openapi.yaml

### Final Validation

- [ ] T104 Run through all acceptance scenarios from spec.md manually
- [ ] T105 Verify all edge cases are handled (whitespace validation, deletion confirmation, etc.)
- [ ] T106 Test cross-browser compatibility (Chrome, Firefox, Safari)
- [ ] T107 Verify mobile responsiveness of frontend UI

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories MUST proceed sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P2) → US4 (P3)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable

### Within Each User Story

**TDD Workflow (MANDATORY):**

1. **RED Phase**: Write tests FIRST and ensure they FAIL (proves they test the right thing)
2. **GREEN Phase**: Implement minimal code to make tests pass
3. **REFACTOR Phase**: Improve code structure while keeping tests green

**Task Order within Story:**
- Tests BEFORE implementation (TDD Red phase - NON-NEGOTIABLE)
- Backend models before services
- Backend services before API endpoints
- Frontend types/schemas before components
- Frontend API service before hooks
- Frontend hooks before components
- Frontend components before pages
- Core implementation before integration

### Sequential Execution

**Note**: All tasks must be executed sequentially in the order listed. No parallel execution is permitted.

**Execution Order:**
1. Complete all Setup Phase (Phase 1) tasks in order (T001-T016)
2. Complete all Foundational Phase (Phase 2) tasks in order (T017-T026)
3. Complete User Story phases sequentially in priority order:
   - Phase 3: User Story 1 (P1) - T027-T049
   - Phase 4: User Story 2 (P2) - T050-T060
   - Phase 5: User Story 3 (P2) - T061-T076
   - Phase 6: User Story 4 (P3) - T077-T087
4. Complete Polish Phase (Phase 7) tasks in order (T088-T107)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Minimum Viable Product - Fastest path to value:**

1. Complete Phase 1: Setup (T001-T016)
2. Complete Phase 2: Foundational (T017-T026) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T027-T049)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
6. Gather feedback before building more

**Why this works:**
- Users can create and view todos (core value)
- Proves the full stack works end-to-end
- Validates technical approach
- Enables early feedback
- Fastest time to first deployment

### Incremental Delivery (Recommended)

**Build value incrementally:**

1. **Foundation** (Phases 1-2): Setup + Foundational → Infrastructure ready
2. **MVP** (Phase 3): Add User Story 1 → Test independently → Deploy/Demo (create + view todos)
3. **Enhancement 1** (Phase 4): Add User Story 2 → Test independently → Deploy/Demo (+ completion tracking)
4. **Enhancement 2** (Phase 5): Add User Story 3 → Test independently → Deploy/Demo (+ editing)
5. **Enhancement 3** (Phase 6): Add User Story 4 → Test independently → Deploy/Demo (+ safe deletion)
6. **Polish** (Phase 7): Quality improvements → Final deployment

**Benefits:**
- Each phase adds value without breaking previous features
- Early deployment means early user feedback
- Can stop at any phase and still have working product
- Risk is spread across iterations
- Easier to debug (smaller changes)

### Sequential Team Strategy

**Single developer or sequential execution:**

1. **Week 1**: Complete Setup + Foundational phases (T001-T026) - Critical infrastructure
2. **Week 2-3**: Complete User Story 1 (P1) sequentially (T027-T049) - Create + view todos
3. **Week 4**: Complete User Story 2 (P2) sequentially (T050-T060) - Completion tracking
4. **Week 5**: Complete User Story 3 (P2) sequentially (T061-T076) - Editing
5. **Week 6**: Complete User Story 4 (P3) sequentially (T077-T087) - Deletion
6. **Week 7**: Complete Polish phase sequentially (T088-T107) - Final quality improvements

**Why this works:**
- Clear linear progression ensures no conflicts
- Each phase builds on previous work
- Easier to track progress and debug issues
- Each story can be tested/demoed independently before moving to next
- Simpler coordination and planning

---

## Task Execution Checklist

Before starting ANY task:

- [ ] Read the constitution (`.specify/memory/constitution.md`)
- [ ] Read the spec (`specs/001-todo-crud-app/spec.md`)
- [ ] Review the implementation plan (`specs/001-todo-crud-app/plan.md`)
- [ ] Understand the data model (`specs/001-todo-crud-app/data-model.md`)
- [ ] Review API contracts (`specs/001-todo-crud-app/contracts/`)

For each task:

- [ ] **TDD**: If it's a test task, write test and ensure it FAILS first
- [ ] **Implementation**: Write minimal code to pass tests
- [ ] **Refactor**: Improve structure while keeping tests green
- [ ] **Quality**: Run linter/formatter (ruff for backend, ESLint for frontend)
- [ ] **Type Safety**: Run type checker (mypy for backend, tsc for frontend)
- [ ] **Verify**: Run tests to ensure nothing broke
- [ ] **Commit**: Commit after each task or Red-Green-Refactor cycle

---

## Notes

- **[Story] labels**: Map tasks to specific user stories for traceability (US1, US2, US3, US4)
- **Sequential execution**: All tasks must be executed in order (no parallel execution)
- **TDD MANDATORY**: Tests MUST fail before implementing (Red), then pass (Green), then refactor
- **Independent stories**: Each user story should be independently completable and testable
- **PascalCase database**: All PostgreSQL table and column names use PascalCase (Todos, Id, Title, CreatedAt, CompletedAt, IsCompleted)
- **Zod-first frontend**: Zod schemas are source of truth, TypeScript types inferred from schemas
- **Quality gates**: Keep functions under 50 lines, complexity under 10, meaningful names
- **Commit strategy**: Commit after each task or logical group (ideally after each Red-Green-Refactor cycle)
- **Checkpoints**: Stop at any checkpoint to validate story independently
- **Performance targets**: API <200ms p95, Frontend load <3s, Support 1,000 todos
- **Avoid**: Vague tasks, same file conflicts, cross-story dependencies that break independence, over-engineering

---

## Summary

**Total Tasks**: 107
- **Phase 1 (Setup)**: 16 tasks
- **Phase 2 (Foundational)**: 10 tasks (BLOCKS all user stories)
- **Phase 3 (US1 - Create & View)**: 23 tasks (15 implementation + 8 tests)
- **Phase 4 (US2 - Complete)**: 11 tasks (7 implementation + 4 tests)
- **Phase 5 (US3 - Edit)**: 16 tasks (11 implementation + 5 tests)
- **Phase 6 (US4 - Delete)**: 11 tasks (7 implementation + 4 tests)
- **Phase 7 (Polish)**: 20 tasks

**MVP Scope (Fastest Path to Value)**: Phases 1-3 (49 tasks)
- Setup + Foundation + User Story 1 = Create and view todos

**Execution Mode**: Sequential execution only (no parallel execution permitted)

**Independent Test Criteria**:
- **US1**: Create todos and verify they appear in overview with timestamps
- **US2**: Mark todos complete/in-progress and verify timestamp behavior
- **US3**: Edit todos and verify changes are saved with preserved metadata
- **US4**: Delete todos and verify confirmation prevents accidental deletion

**User Story Mapping**:
- **US1 (P1)**: 23 tasks (T027-T049) - Create and view todos
- **US2 (P2)**: 11 tasks (T050-T060) - Completion tracking
- **US3 (P2)**: 16 tasks (T061-T076) - Editing
- **US4 (P3)**: 11 tasks (T077-T087) - Safe deletion

---

**Ready for Implementation**: All tasks follow checklist format, include exact file paths, and are organized by user story for independent delivery.

**Next Steps**:
1. Review this task list with team
2. Decide on MVP scope (recommended: Phases 1-3)
3. Begin with Phase 1 Setup tasks
4. Complete Phase 2 Foundational (CRITICAL before any stories)
5. Start User Story 1 with TDD approach (Red-Green-Refactor)
