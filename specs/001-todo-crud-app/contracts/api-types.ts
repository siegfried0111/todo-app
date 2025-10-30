/**
 * API Types for Todo App
 *
 * This file contains TypeScript types that mirror the OpenAPI specification.
 * These types should be kept in sync with openapi.yaml.
 *
 * In production, consider using openapi-typescript to generate these automatically:
 * https://github.com/drwpow/openapi-typescript
 */

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request payload for creating a new todo
 * POST /todos
 */
export interface TodoCreate {
  /** Todo title (required, 1-200 characters, cannot be only whitespace) */
  title: string;
  /** Todo content (optional, max 10,000 characters) */
  content?: string;
}

/**
 * Request payload for updating an existing todo
 * PATCH /todos/{todo_id}
 */
export interface TodoUpdate {
  /** Updated title (optional, 1-200 characters) */
  title?: string;
  /** Updated content (optional, max 10,000 characters) */
  content?: string;
}

/**
 * Request payload for completing/uncompleting a todo
 * PATCH /todos/{todo_id}/complete
 */
export interface TodoComplete {
  /** True to mark as completed, false to revert to in-progress */
  is_completed: boolean;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Todo item representation (response)
 */
export interface TodoResponse {
  /** Todo ID */
  id: number;
  /** Todo title */
  title: string;
  /** Todo content */
  content: string;
  /** Creation timestamp (ISO 8601) */
  created_at: string;
  /** Completion timestamp (ISO 8601), null if in-progress */
  completed_at: string | null;
  /** Whether todo is completed */
  is_completed: boolean;
}

/**
 * List of todos response
 * GET /todos
 */
export interface TodoListResponse {
  /** List of todos */
  todos: TodoResponse[];
  /** Total number of todos */
  total: number;
}

/**
 * Generic error response
 */
export interface ErrorResponse {
  /** Error message */
  detail: string;
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  /** Location of the error (field path) */
  loc: string[];
  /** Error message */
  msg: string;
  /** Error type */
  type: string;
}

/**
 * Validation error response (422)
 */
export interface ValidationErrorResponse {
  /** List of validation errors */
  detail: ValidationErrorDetail[];
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * Query parameters for GET /todos
 */
export interface ListTodosParams {
  /** Filter by completion status */
  is_completed?: boolean;
  /** Maximum number of todos to return (1-1000) */
  limit?: number;
  /** Number of todos to skip (pagination) */
  offset?: number;
}

// ============================================================================
// Path Parameters
// ============================================================================

/**
 * Path parameters for single todo operations
 */
export interface TodoPathParams {
  /** Todo ID */
  todo_id: number;
}

// ============================================================================
// API Client Types (for TanStack Query)
// ============================================================================

/**
 * Query key for fetching all todos
 */
export type TodosQueryKey = ['todos', ListTodosParams?];

/**
 * Query key for fetching a single todo
 */
export type TodoQueryKey = ['todos', number];

/**
 * Mutation types for TanStack Query
 */
export interface CreateTodoMutation {
  request: TodoCreate;
  response: TodoResponse;
}

export interface UpdateTodoMutation {
  request: TodoUpdate & { id: number };
  response: TodoResponse;
}

export interface CompleteTodoMutation {
  request: TodoComplete & { id: number };
  response: TodoResponse;
}

export interface DeleteTodoMutation {
  request: { id: number };
  response: void;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Type guard to check if a todo is completed
 */
export function isTodoCompleted(todo: TodoResponse): boolean {
  return todo.is_completed && todo.completed_at !== null;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'detail' in response &&
    typeof (response as ErrorResponse).detail === 'string'
  );
}

/**
 * Type guard to check if response is a validation error
 */
export function isValidationErrorResponse(
  response: unknown
): response is ValidationErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'detail' in response &&
    Array.isArray((response as ValidationErrorResponse).detail)
  );
}
