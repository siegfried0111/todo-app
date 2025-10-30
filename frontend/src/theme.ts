/**
 * MUI theme configuration.
 *
 * Defines the Material-UI theme with custom colors, typography,
 * and component styles for the Todo application.
 */

import { createTheme } from '@mui/material/styles';

/**
 * Custom theme for the Todo application.
 *
 * Features:
 * - Primary color: Blue (modern, productive)
 * - Secondary color: Green (success, completion)
 * - Clean typography with Roboto font family
 * - Responsive spacing and breakpoints
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Material Blue 700
      light: '#42a5f5', // Material Blue 400
      dark: '#1565c0', // Material Blue 800
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#388e3c', // Material Green 700
      light: '#66bb6a', // Material Green 400
      dark: '#2e7d32', // Material Green 800
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f', // Material Red 700
    },
    warning: {
      main: '#f57c00', // Material Orange 800
    },
    info: {
      main: '#0288d1', // Material Light Blue 700
    },
    success: {
      main: '#388e3c', // Material Green 700
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  spacing: 8, // Base spacing unit (8px)
  shape: {
    borderRadius: 8, // Rounded corners for cards and buttons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Don't uppercase button text
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default paper gradient
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

/**
 * Dark theme variant (for future dark mode support).
 * Currently not used, but can be enabled via theme toggle.
 */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Lighter blue for dark mode
    },
    secondary: {
      main: '#66bb6a', // Lighter green for dark mode
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  // Inherit other theme settings
  ...theme,
});
