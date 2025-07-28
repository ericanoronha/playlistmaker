import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Typography, Box, useMediaQuery, CircularProgress } from '@mui/material';
import theme from './theme';
import SongLibrary from './components/SongLibrary';
import Playlist from './components/Playlist';
import Footer from './components/Footer';
import Snackbar from './components/Snackbar';
import './App.css';

const App = () => {
  const isMobile = useMediaQuery('(max-width:1200px)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simula delay inicial
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="background.default"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <header>
        <Typography
          variant="h4"
          component="h1"
          sx={{ px: 4, py: 2, fontWeight: 'bold' }}
        >
          Minha Trilha | Playlist Maker App
        </Typography>
      </header>

      <main style={{ paddingBottom: '96px' }}>
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          gap={4}
          height="calc(100vh - 200px)"
          px={4}
        >
          <Box flex={2} minHeight={0} overflow="auto">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Trilhas sonoras
            </Typography>
            <SongLibrary onPlaylistChange={() => {}} />
          </Box>

          <Box flex={1} minHeight={0} overflow="auto">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Favoritas
            </Typography>
            <Playlist />
          </Box>
        </Box>
      </main>

      <Footer />
      <Snackbar />
    </ThemeProvider>
  );
};

export default App;
