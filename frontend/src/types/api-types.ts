/**
 * API Schemas for Todo App (Zod-First)
 *
 * This file uses Zod schemas as the single source of truth for API types.
 * TypeScript types are inferred from Zod schemas using z.infer<>.
 *
 * Benefits:
 * - Runtime validation of API responses
 * - Single source of truth (no type/schema drift)
 * - Seamless integration with React Hook Form
 * - Parse and validate API data automatically
 */

import { z } from 'zod';

// ============================================================================
// Request Schemas
// ============================================================================

/**
 * Schema for creating a new todo
 * POST /api/todos
 */
export const TodoCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .refine(
      (val) => val.trim().length > 0,
      'Title cannot be only whitespace'
    )
    .transform((val) => val.trim()),
  content: z
    .string()
    .max(10000, 'Content must be 10,000 characters or less')
    .optional()
    .default(''),
});

/**
 * Schema for updating an existing todo
 * PATCH /api/todos/{todo_id}
 */
export const TodoUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .refine(
      (val) => val.trim().length > 0,
      'Title cannot be only whitespace'
    )
    .transform((val) => val.trim())
    .optional(),
  content: z
    .string()
    .max(10000, 'Content must be 10,000 characters or less')
    .optional(),
});

/**
 * Schema for completing/uncompleting a todo
 * PATCH /api/todos/{todo_id}/complete
 */
export const TodoCompleteSchema = z.object({
  is_completed: z.boolean({
    required_error: 'is_completed is required',
  }),
});

// ============================================================================
// Response Schemas
// ============================================================================

/**
 * Schema for todo item (response)
 */
export const TodoResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  content: z.string(),
  created_at: z.string().datetime(), // ISO 8601 datetime string
  completed_at: z.string().datetime().nullable(),
  is_completed: z.boolean(),
});

/**
 * Schema for list of todos response
 * GET /api/todos
 */
export const TodoListResponseSchema = z.object({
  todos: z.array(TodoResponseSchema),
  total: z.number().int().nonnegative(),
});

/**
 * Schema for generic error response
 */
export const ErrorResponseSchema = z.object({
  detail: z.string(),
});

/**
 * Schema for validation error detail
 */
export const ValidationErrorDetailSchema = z.object({
  loc: z.array(z.string()),
  msg: z.string(),
  type: z.string(),
});

/**
 * Schema for validation error response (422)
 */
export const ValidationErrorResponseSchema = z.object({
  detail: z.array(ValidationErrorDetailSchema),
});

// ============================================================================
// Inferred TypeScript Types
// ============================================================================

/**
 * Request payload for creating a new todo
 */
export type TodoCreate = z.infer<typeof TodoCreateSchema>;

/**
 * Request payload for updating an existing todo
 */
export type TodoUpdate = z.infer<typeof TodoUpdateSchema>;

/**
 * Request payload for completing/uncompleting a todo
 */
export type TodoComplete = z.infer<typeof TodoCompleteSchema>;

/**
 * Todo item representation (response)
 */
export type TodoResponse = z.infer<typeof TodoResponseSchema>;

/**
 * List of todos response
 */
export type TodoListResponse = z.infer<typeof TodoListResponseSchema>;

/**
 * Generic error response
 */
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Validation error detail
 */
export type ValidationErrorDetail = z.infer<typeof ValidationErrorDetailSchema>;

/**
 * Validation error response (422)
 */
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;

// ============================================================================
// Query Parameters Schemas
// ============================================================================

/**
 * Schema for query parameters when listing todos
 * GET /api/todos
 */
export const ListTodosParamsSchema = z.object({
  is_completed: z.boolean().optional(),
  limit: z.number().int().min(1).max(1000).optional().default(1000),
  offset: z.number().int().min(0).optional().default(0),
});

/**
 * Query parameters for GET /api/todos
 */
export type ListTodosParams = z.infer<typeof ListTodosParamsSchema>;

// ============================================================================
// Path Parameters Schemas
// ============================================================================

/**
 * Schema for path parameters (todo ID)
 */
export const TodoPathParamsSchema = z.object({
  todo_id: z.number().int().positive(),
});

/**
 * Path parameters for single todo operations
 */
export type TodoPathParams = z.infer<typeof TodoPathParamsSchema>;

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
// Parsing Utilities (Runtime Validation)
// ============================================================================

/**
 * Safely parse and validate API response data
 * Throws ZodError if validation fails
 */
export const parseApiResponse = {
  todo: (data: unknown) => TodoResponseSchema.parse(data),
  todoList: (data: unknown) => TodoListResponseSchema.parse(data),
  error: (data: unknown) => ErrorResponseSchema.parse(data),
  validationError: (data: unknown) => ValidationErrorResponseSchema.parse(data),
};

/**
 * Safely parse with fallback (returns null if validation fails)
 */
export const safeParseApiResponse = {
  todo: (data: unknown) => TodoResponseSchema.safeParse(data),
  todoList: (data: unknown) => TodoListResponseSchema.safeParse(data),
  error: (data: unknown) => ErrorResponseSchema.safeParse(data),
  validationError: (data: unknown) => ValidationErrorResponseSchema.safeParse(data),
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a todo is completed
 */
export function isTodoCompleted(todo: TodoResponse): boolean {
  return todo.is_completed && todo.completed_at !== null;
}

/**
 * Type guard to check if response is an error
 * Uses Zod schema for validation
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return ErrorResponseSchema.safeParse(response).success;
}

/**
 * Type guard to check if response is a validation error
 * Uses Zod schema for validation
 */
export function isValidationErrorResponse(
  response: unknown
): response is ValidationErrorResponse {
  return ValidationErrorResponseSchema.safeParse(response).success;
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example 1: Form validation with React Hook Form
 *
 * ```typescript
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { TodoCreateSchema, type TodoCreate } from './api-types';
 *
 * function TodoForm() {
 *   const { register, handleSubmit, formState: { errors } } = useForm<TodoCreate>({
 *     resolver: zodResolver(TodoCreateSchema),
 *   });
 *
 *   const onSubmit = (data: TodoCreate) => {
 *     // data is already validated and transformed (title is trimmed)
 *     createTodo(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input {...register('title')} />
 *       {errors.title && <span>{errors.title.message}</span>}
 *       <textarea {...register('content')} />
 *       {errors.content && <span>{errors.content.message}</span>}
 *       <button type="submit">Create</button>
 *     </form>
 *   );
 * }
 * ```
 */

/**
 * Example 2: API response validation with TanStack Query
 *
 * ```typescript
 * import { useQuery } from '@tanstack/react-query';
 * import { TodoListResponseSchema } from './api-types';
 *
 * function useTodos() {
 *   return useQuery({
 *     queryKey: ['todos'],
 *     queryFn: async () => {
 *       const response = await axios.get('/api/todos');
 *       // Validate and parse the response at runtime
 *       return TodoListResponseSchema.parse(response.data);
 *     },
 *   });
 * }
 * ```
 */

/**
 * Example 3: Safe parsing with error handling
 *
 * ```typescript
 * import { safeParseApiResponse } from './api-types';
 *
 * async function fetchTodo(id: number) {
 *   const response = await axios.get(`/api/todos/${id}`);
 *   const result = safeParseApiResponse.todo(response.data);
 *
 *   if (!result.success) {
 *     console.error('Invalid response:', result.error);
 *     throw new Error('Failed to parse todo response');
 *   }
 *
 *   return result.data; // Type-safe TodoResponse
 * }
 * ```
 */

/**
 * Example 4: Error response handling
 *
 * ```typescript
 * import { isErrorResponse, isValidationErrorResponse } from './api-types';
 *
 * async function createTodo(data: TodoCreate) {
 *   try {
 *     const response = await axios.post('/api/todos', data);
 *     return response.data;
 *   } catch (error) {
 *     if (axios.isAxiosError(error) && error.response) {
 *       const data = error.response.data;
 *
 *       if (isValidationErrorResponse(data)) {
 *         // Handle validation errors
 *         data.detail.forEach(err => {
 *           console.error(`${err.loc.join('.')}: ${err.msg}`);
 *         });
 *       } else if (isErrorResponse(data)) {
 *         // Handle generic errors
 *         console.error(data.detail);
 *       }
 *     }
 *     throw error;
 *   }
 * }
 * ```
 */
