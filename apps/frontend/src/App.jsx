import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Typography,
  Box,
} from '@mui/material';
import theme from './theme';
import SongLibrary from './components/SongLibrary';
import Playlist from './components/Playlist';
import './App.css';

const App = () => {
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

      <main>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={4}
          height="calc(100vh - 120px)"
          px={4}
        >
          <Box display="flex" flexDirection="column" height="100%">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Trilhas sonoras
            </Typography>
            <Box flex={1}>
              <SongLibrary />
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" height="100%">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Favoritas
            </Typography>
            <Box flex={1}>
              <Playlist />
            </Box>
          </Box>
        </Box>
      </main>
    </ThemeProvider>
  );
};

export default App;
