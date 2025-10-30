# API Contracts

This directory contains the API contract specifications for the Todo App.

## Files

- **openapi.yaml**: OpenAPI 3.1.0 specification for the REST API (backend reference)
- **api-types.ts**: Zod schemas and inferred TypeScript types (frontend source of truth)

## OpenAPI Specification

The `openapi.yaml` file defines:
- All API endpoints (paths)
- Request/response schemas
- Validation rules
- Error responses
- Examples for each operation

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/todos` | List all todos (with optional filtering) |
| POST | `/todos` | Create a new todo |
| GET | `/todos/{todo_id}` | Get a single todo by ID |
| PATCH | `/todos/{todo_id}` | Update todo title/content |
| DELETE | `/todos/{todo_id}` | Delete a todo |
| PATCH | `/todos/{todo_id}/complete` | Mark todo as completed/in-progress |

## Zod Schemas & TypeScript Types

The `api-types.ts` file uses a **Zod-first approach** for maximum type safety:

### Zod Schemas (Runtime Validation)
- Request schemas: `TodoCreateSchema`, `TodoUpdateSchema`, `TodoCompleteSchema`
- Response schemas: `TodoResponseSchema`, `TodoListResponseSchema`
- Error schemas: `ErrorResponseSchema`, `ValidationErrorResponseSchema`
- Query params: `ListTodosParamsSchema`

### TypeScript Types (Inferred from Zod)
- All types are inferred using `z.infer<typeof Schema>`
- Single source of truth prevents type/schema drift
- Runtime validation ensures data integrity

### Usage in Frontend

**Form Validation with React Hook Form:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TodoCreateSchema, type TodoCreate } from './contracts/api-types';

function TodoForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<TodoCreate>({
    resolver: zodResolver(TodoCreateSchema), // Automatic validation
  });

  const onSubmit = (data: TodoCreate) => {
    // data is validated and transformed (title trimmed)
    createTodo(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit">Create</button>
    </form>
  );
}
```

**API Response Validation with TanStack Query:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { TodoListResponseSchema } from './contracts/api-types';

function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await axios.get('/api/todos');
      // Validate at runtime - throws if invalid
      return TodoListResponseSchema.parse(response.data);
    },
  });
}
```

**Benefits of Zod-First:**
- ✅ Runtime validation catches API contract violations
- ✅ Type safety at both compile-time and runtime
- ✅ Automatic form validation with React Hook Form
- ✅ Transform data (e.g., trim whitespace) during validation
- ✅ Single source of truth (no separate types and validators)

## Validation Rules

### Title
- **Required**: Yes
- **Min Length**: 1 character (after trimming whitespace)
- **Max Length**: 200 characters
- **Constraint**: Cannot be only whitespace

### Content
- **Required**: No (defaults to empty string)
- **Min Length**: 0
- **Max Length**: 10,000 characters

## Status Codes

- **200 OK**: Successful GET, PATCH operation
- **201 Created**: Successful POST operation
- **204 No Content**: Successful DELETE operation
- **404 Not Found**: Todo with specified ID doesn't exist
- **422 Unprocessable Entity**: Validation error (invalid input)
- **500 Internal Server Error**: Unexpected server error

## Error Handling

### Validation Error (422)
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "String should have at least 1 character",
      "type": "string_too_short"
    }
  ]
}
```

### Not Found (404)
```json
{
  "detail": "Todo with ID 123 not found"
}
```

### Internal Error (500)
```json
{
  "detail": "An unexpected error occurred"
}
```

## Tools

### Viewing the API Spec

You can view and interact with the API specification using:

1. **Swagger UI**: Visit `http://localhost:8000/docs` when the backend is running
2. **ReDoc**: Visit `http://localhost:8000/redoc` when the backend is running
3. **VS Code**: Use the "OpenAPI (Swagger) Editor" extension

### Zod Schema Validation

The Zod schemas provide automatic runtime validation:

```typescript
import { TodoCreateSchema, safeParseApiResponse } from './api-types';

// Validate form data before sending
const result = TodoCreateSchema.safeParse(formData);
if (!result.success) {
  console.error('Validation errors:', result.error.errors);
}

// Validate API responses
const response = await axios.get('/api/todos');
const parsed = safeParseApiResponse.todoList(response.data);
if (parsed.success) {
  // Type-safe data
  console.log(parsed.data.todos);
} else {
  // Handle invalid response
  console.error('Invalid API response:', parsed.error);
}
```

### No Code Generation Needed

Unlike OpenAPI type generation approaches, Zod schemas:
- Are hand-written once and maintained as the source of truth
- Provide both compile-time types AND runtime validation
- Work seamlessly with React Hook Form
- Catch API contract violations at runtime, not just compile time
- No build step or code generation required

## Testing the API

### Using curl

```bash
# Create a todo
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "content": "Milk, eggs, bread"}'

# List all todos
curl http://localhost:8000/api/todos

# Get a specific todo
curl http://localhost:8000/api/todos/1

# Update a todo
curl -X PATCH http://localhost:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries and supplies"}'

# Complete a todo
curl -X PATCH http://localhost:8000/api/todos/1/complete \
  -H "Content-Type: application/json" \
  -d '{"is_completed": true}'

# Delete a todo
curl -X DELETE http://localhost:8000/api/todos/1
```

### Using HTTPie

```bash
# Create a todo
http POST http://localhost:8000/api/todos title="Buy groceries" content="Milk, eggs, bread"

# List all todos
http GET http://localhost:8000/api/todos

# Complete a todo
http PATCH http://localhost:8000/api/todos/1/complete is_completed:=true
```

## Contract Testing

The API contract is enforced at multiple levels:

### Backend (Pydantic)
- FastAPI auto-generates OpenAPI spec from Pydantic models
- Request/response validation at runtime
- Type hints for IDE support

### Frontend (Zod)
- Zod schemas validate API responses at runtime
- Catch contract violations immediately (not just at compile time)
- Type inference ensures TypeScript types match schemas

### Contract Alignment
1. **Design Time**: OpenAPI spec (`openapi.yaml`) defines the contract
2. **Backend**: Pydantic schemas implement the contract
3. **Frontend**: Zod schemas mirror the contract with runtime validation

### Runtime Contract Verification

```typescript
// Frontend automatically validates API responses
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const response = await axios.get('/api/todos');
    // This will throw if backend returns unexpected data
    return TodoListResponseSchema.parse(response.data);
  },
});
```

**Benefits:**
- Integration issues caught immediately in development
- No silent data corruption from API changes
- Clear error messages when contracts are violated
- Both frontend and backend enforce the same contract
