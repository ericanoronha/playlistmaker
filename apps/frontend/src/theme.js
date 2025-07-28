import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#eee',
    },
    secondary: {
      main: '#D4D4D4',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#fff',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#f0f0f0',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#666 #1e1e1e',
          scrollbarWidth: 'thin',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#666',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        },
        columnHeaders: {
          backgroundColor: '#2c2c2c',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#eee',
        },
      },
    },
  },
});

export default theme;
