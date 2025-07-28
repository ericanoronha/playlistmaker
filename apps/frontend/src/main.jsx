import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { PlaylistProvider } from './context/PlaylistContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlaylistProvider>
        <App />
      </PlaylistProvider>
    </ThemeProvider>
  </React.StrictMode>
);
