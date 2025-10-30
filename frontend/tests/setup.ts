/**
 * Test setup and configuration.
 *
 * This module configures:
 * - Mock Service Worker (MSW) for API mocking
 * - Testing Library setup
 * - Global test utilities
 */

import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import '@testing-library/jest-dom';

/**
 * Mock API handlers for testing.
 * These handlers intercept HTTP requests and return mock responses.
 */
export const handlers = [
  // Health check endpoint
  http.get('http://localhost:8000/', () => {
    return HttpResponse.json({
      status: 'ok',
      message: 'Todo API is running',
    });
  }),

  // List todos - returns empty array by default
  http.get('http://localhost:8000/api/todos', () => {
    return HttpResponse.json({
      todos: [],
      total: 0,
    });
  }),

  // Get single todo - returns 404 by default
  http.get('http://localhost:8000/api/todos/:id', ({ params }) => {
    return HttpResponse.json(
      { detail: `Todo with ID ${params.id} not found` },
      { status: 404 }
    );
  }),

  // Create todo
  http.post('http://localhost:8000/api/todos', async ({ request }) => {
    const body = await request.json() as { title: string; content?: string };

    return HttpResponse.json(
      {
        id: 1,
        title: body.title,
        content: body.content || '',
        created_at: new Date().toISOString(),
        completed_at: null,
        is_completed: false,
      },
      { status: 201 }
    );
  }),

  // Update todo
  http.patch('http://localhost:8000/api/todos/:id', async ({ request, params }) => {
    const body = await request.json() as { title?: string; content?: string };

    return HttpResponse.json({
      id: Number(params.id),
      title: body.title || 'Test Todo',
      content: body.content || '',
      created_at: new Date().toISOString(),
      completed_at: null,
      is_completed: false,
    });
  }),

  // Complete/uncomplete todo
  http.patch('http://localhost:8000/api/todos/:id/complete', async ({ request, params }) => {
    const body = await request.json() as { is_completed: boolean };

    return HttpResponse.json({
      id: Number(params.id),
      title: 'Test Todo',
      content: 'Test content',
      created_at: new Date().toISOString(),
      completed_at: body.is_completed ? new Date().toISOString() : null,
      is_completed: body.is_completed,
    });
  }),

  // Delete todo
  http.delete('http://localhost:8000/api/todos/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];

/**
 * MSW server instance for intercepting HTTP requests in tests.
 */
export const server = setupServer(...handlers);

/**
 * Setup MSW server before all tests.
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

/**
 * Reset handlers after each test to ensure test isolation.
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Clean up and close server after all tests.
 */
afterAll(() => {
  server.close();
});

/**
 * Test utility: Create a mock todo object.
 *
 * @param overrides - Partial todo object to override defaults
 * @returns Mock todo object
 */
export function createMockTodo(overrides?: Partial<{
  id: number;
  title: string;
  content: string;
  created_at: string;
  completed_at: string | null;
  is_completed: boolean;
}>) {
  return {
    id: 1,
    title: 'Test Todo',
    content: 'Test content',
    created_at: new Date().toISOString(),
    completed_at: null,
    is_completed: false,
    ...overrides,
  };
}

/**
 * Test utility: Create multiple mock todos.
 *
 * @param count - Number of todos to create
 * @returns Array of mock todo objects
 */
export function createMockTodos(count: number) {
  return Array.from({ length: count }, (_, i) => createMockTodo({
    id: i + 1,
    title: `Test Todo ${i + 1}`,
    content: `Test content ${i + 1}`,
  }));
}

/**
 * Test utility: Wait for a specific amount of time.
 * Useful for testing loading states and debounced operations.
 *
 * @param ms - Milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
