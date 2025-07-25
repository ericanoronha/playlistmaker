import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
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
        <h1>Minha Trilha</h1>
      </header>

      <main>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <div className="container">
            <div>
              <Typography variant="h2" gutterBottom>
                Trilhas sonoras
              </Typography>
              <SongLibrary />
            </div>
            <div>
              <Typography variant="h2" gutterBottom>
                Favoritas
              </Typography>
              <Playlist />
            </div>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
};

export default App;
