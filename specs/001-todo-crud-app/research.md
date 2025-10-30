# Research & Technical Decisions: Todo App

**Feature**: 001-todo-crud-app
**Date**: 2025-10-30
**Status**: Complete

## Overview

This document captures the technical research and architectural decisions for the todo CRUD application. All technology choices were specified upfront based on project requirements.

---

## Decision 1: Frontend Technology Stack

**Decision**: React 19 + TypeScript + Vite

**Rationale**:
- **React 19**: Latest version with improved concurrent features, Server Components support (future-ready), and better performance
- **TypeScript 5.x**: Strong type safety prevents runtime errors, improves IDE support, and serves as living documentation
- **Vite**: Fast development server with HMR, optimized production builds, native ESM support

**Alternatives Considered**:
- Next.js: Rejected because this is a simple SPA without SSR requirements (over-engineering for current scope)
- Vue/Angular: Not considered per project requirements

**Best Practices**:
- Use functional components with hooks exclusively
- Implement code splitting with React.lazy() for route-based chunks
- Enable strict mode in TypeScript (strict: true)
- Use React.memo() sparingly, only for expensive renders

---

## Decision 2: UI Component Library

**Decision**: Material-UI (MUI) v7

**Rationale**:
- Comprehensive component library reduces custom CSS
- Built-in accessibility (ARIA) support
- Theming system for consistent design
- Well-documented with large community support
- v7 is latest stable with React 19 compatibility

**Best Practices**:
- Use sx prop for one-off styling (avoid styled-components for simple cases per YAGNI)
- Create theme at app root to centralize design tokens
- Import components individually to enable tree-shaking: `import { Button } from '@mui/material'`
- Use MUI's Grid v2 (Grid2) for layouts

---

## Decision 3: State Management & Data Fetching

**Decision**: TanStack Query (React Query) v5

**Rationale**:
- Handles server state management (caching, refetching, synchronization)
- Eliminates need for global state library (Redux) for simple CRUD app (YAGNI principle)
- Automatic background refetching and stale-while-revalidate pattern
- Built-in loading/error states reduce boilerplate
- Optimistic updates for better UX

**Alternatives Considered**:
- Redux Toolkit + RTK Query: Overkill for single-entity CRUD application
- Zustand/Jotai: Not needed when TanStack Query handles server state (local UI state is minimal)

**Best Practices**:
- Use query keys with hierarchical structure: `['todos'], ['todos', id]`
- Implement optimistic updates for mutations (immediate UI feedback)
- Set staleTime appropriately: 30s for todo list (balance freshness vs network calls)
- Use `useMutation` with onSuccess/onError callbacks for side effects

---

## Decision 4: Form Management & Validation (Zod-First Approach)

**Decision**: React Hook Form + Zod + Runtime API Validation

**Rationale**:
- **React Hook Form**: Minimal re-renders (uncontrolled inputs), small bundle size (8.5KB), excellent performance
- **Zod-First**: Schemas as single source of truth for both types and validation
- **Runtime Validation**: Zod validates API responses, catching contract violations immediately
- **Type Inference**: TypeScript types automatically derived from Zod schemas (no duplication)
- Tight integration between RHF and Zod via `@hookform/resolvers/zod`

**Alternatives Considered**:
- Formik: More re-renders, larger bundle, slower performance
- Yup: Not TypeScript-first, requires separate type definitions
- OpenAPI type generation: No runtime validation, compile-time only

**Why Zod-First Wins**:
1. **Single Source of Truth**: Define schema once, get types + validation + transformations
2. **Runtime Safety**: Catch API changes/violations at runtime, not just compile time
3. **Form Integration**: `zodResolver` seamlessly integrates with React Hook Form
4. **Transformations**: `.transform()` allows data normalization (e.g., trim whitespace)
5. **Better DX**: Clear error messages, excellent TypeScript inference

**Best Practices**:
```typescript
// contracts/api-types.ts - Define schemas once
export const TodoCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .refine(val => val.trim().length > 0, "Title cannot be only whitespace")
    .transform(val => val.trim()), // Normalize data
  content: z.string().max(10000).optional().default('')
});

// Infer TypeScript type from schema
export type TodoCreate = z.infer<typeof TodoCreateSchema>;

// Form component - Use schema for validation
import { zodResolver } from '@hookform/resolvers/zod';

function TodoForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<TodoCreate>({
    resolver: zodResolver(TodoCreateSchema),
    mode: 'onBlur' // Validate on blur
  });

  const onSubmit = (data: TodoCreate) => {
    // data is validated AND transformed (title trimmed)
    createTodo(data);
  };
}

// API service - Validate responses at runtime
async function createTodo(data: TodoCreate) {
  const response = await axios.post('/api/todos', data);
  // Validate response matches contract
  return TodoResponseSchema.parse(response.data);
}
```

**Additional Configuration**:
- Use `mode: 'onBlur'` for validation (balance UX vs validation timing)
- Set `shouldUnregister: false` to preserve form data during unmount
- Use `.safeParse()` for graceful error handling instead of throwing
- Validate ALL API responses to catch backend contract violations early

---

## Decision 5: HTTP Client

**Decision**: Axios

**Rationale**:
- Automatic JSON transformation
- Interceptors for centralized request/response handling (auth tokens, error handling)
- Request cancellation support
- Better error handling than fetch API
- Works seamlessly with TanStack Query

**Best Practices**:
```typescript
// Create configured instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401, 403, 500, etc.
    return Promise.reject(error)
  }
)
```

---

## Decision 6: Backend Framework

**Decision**: FastAPI

**Rationale**:
- Async/await support for concurrent requests (important for 200ms p95 goal)
- Automatic OpenAPI documentation generation
- Built-in request/response validation via Pydantic
- High performance (comparable to Node.js)
- Excellent type hints and IDE support

**Best Practices**:
- Use APIRouter for modular route organization
- Enable CORS middleware for frontend communication
- Implement dependency injection for database sessions
- Use async route handlers with await
- Generate OpenAPI spec for frontend type generation

---

## Decision 7: ORM & Database

**Decision**: SQLAlchemy v2 (async) + PostgreSQL

**Rationale**:
- **SQLAlchemy v2**: New async API, improved type hints, better performance
- **PostgreSQL**: ACID compliance, rich data types, excellent performance for relational data
- **PascalCase naming**: Specified requirement (Id, CreatedAt, CompletedAt)

**Best Practices**:
```python
# Use async engine
engine = create_async_engine("postgresql+asyncpg://...")

# Use declarative_base with mapped_column (SQLAlchemy 2.0 style)
class Todo(Base):
    __tablename__ = "Todos"  # PascalCase

    Id: Mapped[int] = mapped_column(primary_key=True)
    Title: Mapped[str] = mapped_column(String(200))
    Content: Mapped[str] = mapped_column(Text)
    CreatedAt: Mapped[datetime] = mapped_column(default=func.now())
    CompletedAt: Mapped[datetime | None] = mapped_column(nullable=True)
```
- Use async session with `async with` context manager
- Create indexes on CreatedAt for sorting performance
- Use connection pooling (default asyncpg settings sufficient for single-user)

---

## Decision 8: Validation Layer

**Decision**: Pydantic v2

**Rationale**:
- Native FastAPI integration
- v2 has Rust-powered core (pydantic-core) for 5-50x faster validation
- Automatic JSON serialization
- Type coercion and validation in single step

**Best Practices**:
```python
from pydantic import BaseModel, Field, field_validator

class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(default="", max_length=10000)

    @field_validator('title')
    @classmethod
    def title_not_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be only whitespace")
        return v

class TodoResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    completed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)  # For ORM compatibility
```

---

## Decision 9: Package Management

**Decision**: uv (for Python)

**Rationale**:
- 10-100x faster than pip
- Cargo-like lockfile (uv.lock) for reproducible builds
- Virtual environment management built-in
- Compatible with pyproject.toml standard
- Growing adoption in Python community

**Best Practices**:
```bash
# Initialize project
uv init

# Add dependencies
uv add fastapi sqlalchemy[asyncio] pydantic uvicorn

# Add dev dependencies
uv add --dev pytest pytest-asyncio ruff

# Run with uv
uv run uvicorn src.main:app --reload
```

---

## Decision 10: Testing Strategy

**Decision**:
- **Backend**: pytest + pytest-asyncio + httpx (for async tests)
- **Frontend**: Vitest + React Testing Library + MSW

**Rationale**:
- **pytest**: Standard Python testing framework, excellent async support
- **Vitest**: Vite-native testing (same config), faster than Jest, ESM support
- **React Testing Library**: Tests user behavior, not implementation details
- **MSW (Mock Service Worker)**: Intercepts network requests at service worker level, realistic testing

**Best Practices**:

Backend:
```python
# conftest.py
@pytest.fixture
async def db_session():
    async with async_session() as session:
        yield session
        await session.rollback()

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

Frontend:
```typescript
// setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Decision 11: Code Quality Tools

**Decision**:
- **Backend**: ruff (linting + formatting), mypy (type checking)
- **Frontend**: ESLint + Prettier + TypeScript compiler

**Rationale**:
- **ruff**: 10-100x faster than flake8+black, single tool for linting and formatting
- **mypy**: Catches type errors at development time
- **ESLint + Prettier**: Industry standard for JavaScript/TypeScript projects

**Configuration**:

Backend (pyproject.toml):
```toml
[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "W"]

[tool.mypy]
python_version = "3.11"
strict = true
```

Frontend (.eslintrc.cjs):
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
}
```

---

## Decision 12: Development Environment

**Decision**: Docker Compose for PostgreSQL, local dev servers for frontend/backend

**Rationale**:
- Docker for database ensures consistent environment across developers
- Local dev servers for hot reload (faster iteration than containerized dev)
- Production deployment can fully containerize all services

**Best Practices**:
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: todoapp
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Performance Considerations

**Database Indexes**:
```sql
CREATE INDEX idx_todos_created_at ON "Todos"("CreatedAt" DESC);
-- Supports "newest first" sorting
```

**Frontend Optimization**:
- Virtualize todo list if count exceeds 100 (react-window)
- Debounce search/filter inputs (300ms)
- Lazy load edit/create pages with React.lazy()

**Backend Optimization**:
- Use SELECT with specific columns (avoid SELECT *)
- Connection pool size: 10 (sufficient for single-user)
- Enable gzip compression middleware
- Set appropriate query limits (max 1000 per request)

---

## Security Considerations

**Backend**:
- Use parameterized queries (SQLAlchemy handles this)
- Set CORS allowed origins explicitly (not wildcard in production)
- Implement rate limiting (e.g., slowapi) - defer to future if single-user
- Sanitize error messages (don't expose SQL/stack traces to client)

**Frontend**:
- Sanitize user input display (React handles XSS by default)
- Validate on both client and server (defense in depth)
- Use HTTPS in production (enforce via headers)

---

## Deployment Architecture (Future)

**Not implemented in current phase, documented for future reference:**

- Frontend: Static hosting (Vercel/Netlify) or Nginx
- Backend: Container (Docker) on VM or managed service (Render/Railway)
- Database: Managed PostgreSQL (AWS RDS/DigitalOcean)
- Environment variables for configuration (no secrets in code)

---

## Open Questions & Future Enhancements

**Deferred to post-MVP**:
1. Multi-user support (authentication, user isolation)
2. Search/filter functionality
3. Tags/categories for todos
4. Due dates and reminders
5. Rich text editor for content
6. Undo/redo functionality
7. Bulk operations (multi-select delete/complete)

**Rationale for deferral**: YAGNI principle - implement only what is specified in current user stories. Each enhancement above requires additional complexity that should be justified by real user needs.

---

## Summary

All technical decisions are aligned with:
- **Simplicity**: Standard patterns, no over-engineering
- **Performance**: Async backend, optimistic updates, efficient queries
- **Type Safety**: TypeScript + Pydantic for compile-time error catching
- **Testability**: Comprehensive testing strategy at all levels
- **Maintainability**: Clear separation of concerns, industry-standard tools

The stack is battle-tested, well-documented, and appropriate for the application's scale (1,000 todos, single-user, simple CRUD operations).
