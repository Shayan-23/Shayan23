import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#00f067', // Bright Green
      light: '#64e372', // Lighter Green
      dark: '#00c853', // Dark Green
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffeb3b', // Bright Yellow
      light: '#fff59d', // Lighter Yellow
      dark: '#fbc02d', // Dark Yellow
      contrastText: '#000',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#00f067', // Green for headers
    },
    h2: {
      fontWeight: 600,
      color: '#00f067',
    },
    h3: {
      fontWeight: 600,
      color: '#00f067',
    },
    h4: {
      fontWeight: 600,
      color: '#00f067',
    },
    h5: {
      fontWeight: 600,
      color: '#00f067',
    },
    h6: {
      fontWeight: 600,
      color: '#00f067',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          backgroundColor: '#00f067', // Green Button Background
          color: '#fff',
          '&:hover': {
            backgroundColor: '#00c853', // Dark Green on Hover
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          backgroundColor: '#ffeb3b', // Yellow Card Background
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            borderColor: '#00f067', // Green border
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'light' 
            ? 'linear-gradient(145deg, #00f067, #ffeb3b)' // Green to Yellow Gradient
            : 'linear-gradient(145deg, #424242, #212121)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
