# Data Model: Todo App

**Feature**: 001-todo-crud-app
**Date**: 2025-10-30

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the todo CRUD application.

---

## Entity: Todo

### Description
Represents a single todo item with title, content, timestamps, and completion status.

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `Id` | Integer | Primary key, auto-increment | Unique identifier |
| `Title` | String | Required, max 200 chars, not whitespace-only | The todo's title |
| `Content` | String | Max 10,000 chars, nullable/empty allowed | Detailed description |
| `CreatedAt` | DateTime | Required, auto-generated on creation | When todo was created |
| `CompletedAt` | DateTime | Nullable, set when marked complete | When todo was completed |
| `IsCompleted` | Boolean | Required, default false, derived from CompletedAt | Whether todo is completed |

### Database Schema (PostgreSQL)

```sql
CREATE TABLE "Todos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Content" TEXT,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CompletedAt" TIMESTAMP WITH TIME ZONE,
    "IsCompleted" BOOLEAN GENERATED ALWAYS AS ("CompletedAt" IS NOT NULL) STORED,

    CONSTRAINT "title_not_empty" CHECK (LENGTH(TRIM("Title")) > 0)
);

-- Index for sorting by creation time (newest first)
CREATE INDEX "idx_todos_created_at" ON "Todos"("CreatedAt" DESC);

-- Index for filtering by completion status
CREATE INDEX "idx_todos_is_completed" ON "Todos"("IsCompleted");
```

**Naming Convention**: PascalCase for table name and all column names as specified.

**Note on IsCompleted**: This is a generated column (computed from `CompletedAt IS NOT NULL`) to simplify queries. It's not stored separately but automatically maintained by PostgreSQL.

### SQLAlchemy Model (Backend)

```python
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Boolean, Index, CheckConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    pass

class Todo(Base):
    __tablename__ = "Todos"

    Id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    Title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    Content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default=""
    )

    CreatedAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    CompletedAt: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None
    )

    # Note: IsCompleted is a computed column in the database
    # For queries, we derive it from CompletedAt in Python
    @property
    def IsCompleted(self) -> bool:
        return self.CompletedAt is not None

    __table_args__ = (
        CheckConstraint(
            "LENGTH(TRIM(\"Title\")) > 0",
            name="title_not_empty"
        ),
        Index("idx_todos_created_at", "CreatedAt", postgresql_using="btree"),
        Index("idx_todos_is_completed", "CompletedAt", postgresql_using="btree"),
    )

    def __repr__(self) -> str:
        return f"<Todo(Id={self.Id}, Title='{self.Title}', IsCompleted={self.IsCompleted})>"
```

### Pydantic Schemas (Backend API)

```python
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict

# Request schemas
class TodoCreate(BaseModel):
    """Schema for creating a new todo"""
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Todo title (required, 1-200 characters)"
    )
    content: str = Field(
        default="",
        max_length=10000,
        description="Todo content (optional, max 10,000 characters)"
    )

    @field_validator('title')
    @classmethod
    def title_not_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be only whitespace")
        return v.strip()  # Normalize by trimming whitespace

class TodoUpdate(BaseModel):
    """Schema for updating an existing todo"""
    title: str | None = Field(
        None,
        min_length=1,
        max_length=200,
        description="Updated title (optional)"
    )
    content: str | None = Field(
        None,
        max_length=10000,
        description="Updated content (optional)"
    )

    @field_validator('title')
    @classmethod
    def title_not_whitespace(cls, v: str | None) -> str | None:
        if v is not None:
            if not v.strip():
                raise ValueError("Title cannot be only whitespace")
            return v.strip()
        return v

class TodoComplete(BaseModel):
    """Schema for completing/uncompleting a todo"""
    is_completed: bool = Field(
        ...,
        description="True to mark as completed, False to revert to in-progress"
    )

# Response schemas
class TodoResponse(BaseModel):
    """Schema for todo responses"""
    id: int = Field(..., description="Todo ID")
    title: str = Field(..., description="Todo title")
    content: str = Field(..., description="Todo content")
    created_at: datetime = Field(..., description="Creation timestamp")
    completed_at: datetime | None = Field(None, description="Completion timestamp (null if in-progress)")
    is_completed: bool = Field(..., description="Whether todo is completed")

    model_config = ConfigDict(
        from_attributes=True,  # Enable ORM mode for SQLAlchemy models
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "Buy groceries",
                "content": "Milk, eggs, bread",
                "created_at": "2025-10-30T10:00:00Z",
                "completed_at": None,
                "is_completed": False
            }
        }
    )

class TodoListResponse(BaseModel):
    """Schema for list of todos"""
    todos: list[TodoResponse]
    total: int = Field(..., description="Total number of todos")
```

### TypeScript Interfaces (Frontend)

```typescript
// src/types/todo.ts

/**
 * Todo item representation
 */
export interface Todo {
  id: number;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 datetime string
  completedAt: string | null; // ISO 8601 datetime string or null
  isCompleted: boolean;
}

/**
 * Request payload for creating a todo
 */
export interface CreateTodoRequest {
  title: string;
  content?: string;
}

/**
 * Request payload for updating a todo
 */
export interface UpdateTodoRequest {
  title?: string;
  content?: string;
}

/**
 * Request payload for completing/uncompleting a todo
 */
export interface CompleteTodoRequest {
  isCompleted: boolean;
}

/**
 * Response from list todos endpoint
 */
export interface TodoListResponse {
  todos: Todo[];
  total: number;
}
```

---

## Validation Rules

### Title Validation

**Rules** (enforced at all layers):
1. **Required**: Cannot be null or empty
2. **Length**: 1-200 characters
3. **Whitespace**: Cannot be only whitespace (spaces, tabs, newlines)
4. **Trimming**: Leading/trailing whitespace automatically trimmed before storage

**Error Messages**:
- Empty: "Title is required"
- Whitespace-only: "Title cannot be only whitespace"
- Too long: "Title must be 200 characters or less"

**Validation Layers**:
1. **Frontend (Zod)**:
```typescript
const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .refine(val => val.trim().length > 0, "Title cannot be only whitespace")
    .transform(val => val.trim()),
  content: z.string().max(10000, "Content must be 10,000 characters or less").optional()
});
```

2. **Backend (Pydantic)**: See `TodoCreate` schema above
3. **Database (CHECK constraint)**: See SQL schema above

### Content Validation

**Rules**:
1. **Optional**: Can be empty, null, or whitespace
2. **Length**: Max 10,000 characters

**Error Messages**:
- Too long: "Content must be 10,000 characters or less"

### Completion Validation

**Rules**:
1. **Idempotent**: Marking completed todo as completed again has no effect
2. **Timestamp**: `CompletedAt` set to current time when marked completed
3. **Removal**: `CompletedAt` set to null when reverted to in-progress

---

## State Transitions

### States
1. **In-Progress**: `CompletedAt` is null, `IsCompleted` is false
2. **Completed**: `CompletedAt` has timestamp, `IsCompleted` is true

### Transitions

```
┌─────────────┐                               ┌─────────────┐
│             │  COMPLETE (set CompletedAt)   │             │
│ In-Progress │ ───────────────────────────>  │  Completed  │
│             │                               │             │
│ (default)   │  UNCOMPLETE (clear CompletedAt│             │
│             │ <──────────────────────────── │             │
└─────────────┘                               └─────────────┘
      │                                              │
      │                                              │
      └──────────────────────────────────────────────┘
                       EDIT (preserve state)
                     DELETE (remove entirely)
```

### Transition Rules

**COMPLETE** (In-Progress → Completed):
- Precondition: `CompletedAt` is null
- Action: Set `CompletedAt` to current timestamp
- Postcondition: `IsCompleted` becomes true
- Idempotent: If already completed, no change

**UNCOMPLETE** (Completed → In-Progress):
- Precondition: `CompletedAt` is not null
- Action: Set `CompletedAt` to null
- Postcondition: `IsCompleted` becomes false
- Idempotent: If already in-progress, no change

**EDIT**:
- Allowed in any state (completed or in-progress)
- Updates `Title` and/or `Content`
- Preserves `CreatedAt`, `CompletedAt`, and `IsCompleted`
- Does NOT change completion status

**DELETE**:
- Allowed in any state
- Requires confirmation (user types "DELETE")
- Permanently removes record from database
- Irreversible operation

---

## Sorting & Filtering

### Default Sort Order

**Overview Page**:
- In-Progress section: Sorted by `CreatedAt` DESC (newest first)
- Completed section: Sorted by `CreatedAt` DESC (newest first)

**SQL Example**:
```sql
-- Get in-progress todos
SELECT * FROM "Todos"
WHERE "CompletedAt" IS NULL
ORDER BY "CreatedAt" DESC;

-- Get completed todos
SELECT * FROM "Todos"
WHERE "CompletedAt" IS NOT NULL
ORDER BY "CreatedAt" DESC;
```

### Query Optimization

**Index Usage**:
- `idx_todos_created_at`: Supports ORDER BY CreatedAt DESC
- `idx_todos_is_completed`: Supports WHERE filtering by status

**Performance Target**: < 50ms query time for 1,000 todos

---

## Relationships

**Current Version**: No relationships (single entity)

**Future Extensions** (deferred per YAGNI):
- User entity (for multi-user support)
- Tag entity (many-to-many with Todo)
- Category entity (one-to-many with Todo)

---

## Data Integrity

### Referential Integrity
- N/A (single entity, no foreign keys)

### Domain Integrity
- `Id`: Unique, auto-increment (enforced by PRIMARY KEY)
- `Title`: Not null, length constraint, whitespace check (enforced by NOT NULL + CHECK)
- `Content`: Length constraint (enforced by application layer, TEXT type handles it)
- `CreatedAt`: Not null, auto-default (enforced by NOT NULL + DEFAULT)
- `CompletedAt`: Nullable (enforced by schema)

### Consistency Rules
1. `IsCompleted` MUST always match `CompletedAt IS NOT NULL` (enforced by generated column)
2. `CreatedAt` MUST never be modified after creation (application-level enforcement)
3. `CompletedAt` MUST be null or a valid timestamp after `CreatedAt` (future: add CHECK constraint)

---

## Sample Data

```sql
-- In-progress todos
INSERT INTO "Todos" ("Title", "Content", "CreatedAt") VALUES
('Buy groceries', 'Milk, eggs, bread', NOW() - INTERVAL '2 hours'),
('Finish project report', 'Complete sections 3-5', NOW() - INTERVAL '1 day'),
('Call dentist', 'Schedule appointment for next month', NOW() - INTERVAL '3 hours');

-- Completed todos
INSERT INTO "Todos" ("Title", "Content", "CreatedAt", "CompletedAt") VALUES
('Read chapter 5', 'History textbook', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
('Water plants', '', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days');
```

**Expected Query Result** (sorted by section, then creation time DESC):

In-Progress:
1. Buy groceries (2 hours ago)
2. Call dentist (3 hours ago)
3. Finish project report (1 day ago)

Completed:
1. Water plants (1 week ago, completed 6 days ago)
2. Read chapter 5 (5 days ago, completed 4 days ago)

---

## Migration Strategy

### Initial Migration (v1.0)

```sql
-- Create table
CREATE TABLE "Todos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Content" TEXT DEFAULT '',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CompletedAt" TIMESTAMP WITH TIME ZONE,
    "IsCompleted" BOOLEAN GENERATED ALWAYS AS ("CompletedAt" IS NOT NULL) STORED,
    CONSTRAINT "title_not_empty" CHECK (LENGTH(TRIM("Title")) > 0)
);

-- Create indexes
CREATE INDEX "idx_todos_created_at" ON "Todos"("CreatedAt" DESC);
CREATE INDEX "idx_todos_is_completed" ON "Todos"("IsCompleted");
```

### Rollback Plan

```sql
DROP TABLE IF EXISTS "Todos" CASCADE;
```

---

## Summary

**Entities**: 1 (Todo)
**Relationships**: 0 (single entity)
**States**: 2 (In-Progress, Completed)
**Transitions**: 4 (Complete, Uncomplete, Edit, Delete)

The data model is intentionally simple, following the YAGNI principle. All validation rules are enforced at multiple layers (database, backend, frontend) for defense in depth. The schema supports the performance target of handling 1,000 todos efficiently via appropriate indexes.
