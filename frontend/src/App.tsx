/**
 * Main application component.
 *
 * Sets up:
 * - TanStack Query provider for data fetching
 * - MUI theme provider
 * - React Router for navigation
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache time: Unused data is garbage collected after 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus in development (can be enabled in production)
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* Router will be configured here with routes */}
          <div>
            <h1>Todo App</h1>
            <p>Application is ready. Routes will be configured in Phase 3.</p>
          </div>
        </BrowserRouter>
      </ThemeProvider>

      {/* React Query DevTools - only visible in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
