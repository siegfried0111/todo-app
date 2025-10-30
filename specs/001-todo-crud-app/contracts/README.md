# API Contracts

This directory contains the API contract specifications for the Todo App.

## Files

- **openapi.yaml**: OpenAPI 3.1.0 specification for the REST API
- **api-types.ts**: TypeScript types derived from the OpenAPI spec

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

## TypeScript Types

The `api-types.ts` file provides TypeScript interfaces for:
- Request payloads (TodoCreate, TodoUpdate, TodoComplete)
- Response objects (TodoResponse, TodoListResponse)
- Error responses (ErrorResponse, ValidationErrorResponse)
- Query parameters (ListTodosParams)
- TanStack Query types (mutation/query types)

### Usage in Frontend

```typescript
import { TodoResponse, TodoCreate } from './contracts/api-types';

// Creating a todo
const newTodo: TodoCreate = {
  title: "Buy groceries",
  content: "Milk, eggs, bread"
};

// Handling response
const todo: TodoResponse = await createTodo(newTodo);
```

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

### Generating Types (Future)

For production, consider auto-generating TypeScript types from the OpenAPI spec:

```bash
# Using openapi-typescript
npx openapi-typescript openapi.yaml -o api-types.ts
```

This ensures types stay in sync with the specification.

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

The OpenAPI specification serves as a contract between frontend and backend:

1. **Backend**: FastAPI auto-generates OpenAPI spec from Pydantic models
2. **Frontend**: Uses types derived from the spec for type safety
3. **Testing**: Use contract testing tools (e.g., Pact, Dredd) to verify compliance

This ensures both sides agree on the API structure and prevents integration issues.
