import React, { useEffect, useState, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import {
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { usePlaylist } from '../context/PlaylistContext';
import Snackbar from './Snackbar';

const sanitize = (value) => DOMPurify.sanitize(value || '');

const SongLibrary = () => {
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const { playlist, addTrack, fetchPlaylist, snackbar, setSnackbar } = usePlaylist();

  const fetchSongs = useCallback(() => {
    setLoading(true);
    fetch('/api/songs')
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSongs();
    fetchPlaylist();
  }, [fetchSongs, fetchPlaylist]);

  const handleAddToPlaylist = (song) => {
    setAddingId(song.id);
    addTrack(song)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Adicionado à playlist!',
          severity: 'success',
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Erro ao adicionar à playlist',
          severity: 'error',
        });
      })
      .finally(() => setAddingId(null));
  };

  const favorites = useMemo(() => playlist.map((item) => item.id), [playlist]);

  const filteredSongs = songs.filter((song) => {
    const titleMatch = song.title?.toLowerCase().includes(filter.toLowerCase());
    const artistMatch = song.artist?.toLowerCase().includes(filter.toLowerCase());
    const novelaMatch = song.novela?.toLowerCase().includes(filter.toLowerCase());
    return titleMatch || artistMatch || novelaMatch;
  });

  const columns = [
    {
      field: 'title',
      headerName: 'Faixa',
      flex: 1,
      sortable: true,
      renderCell: (params) => sanitize(params.value),
    },
    {
      field: 'artist',
      headerName: 'Artista',
      flex: 1,
      sortable: true,
      renderCell: (params) => sanitize(params.value),
    },
    {
      field: 'novela',
      headerName: 'Novela',
      flex: 1,
      sortable: true,
      renderCell: (params) => sanitize(params.value),
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 0.5,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={sanitize(params.value || 'nacional')}
          sx={{
            backgroundColor:
              params.value === 'internacional' ? '#FD7D23' : 'success.main',
            color: '#fff',
          }}
          size="small"
        />
      ),
    },
    {
      field: 'favoritar',
      headerName: 'Favoritar',
      sortable: false,
      flex: 0.5,
      align: 'center',
      renderCell: ({ row }) => {
        const isFav = favorites.includes(row.id);
        return (
          <IconButton
            aria-label={
              isFav
                ? `Já adicionado: ${sanitize(row.title)}`
                : `Adicionar à playlist: ${sanitize(row.title)}`
            }
            onClick={() => handleAddToPlaylist(row)}
            disabled={addingId === row.id || isFav}
            color={isFav ? 'error' : 'default'}
          >
            {addingId === row.id ? (
              <CircularProgress size={20} />
            ) : isFav ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <TextField
        label="Busque pela música ou novela"
        variant="outlined"
        fullWidth
        size="small"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box flex={1} minHeight={0}>
        <DataGrid
          rows={filteredSongs.map((row, index) => ({ id: row.id || index, ...row }))}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[100]}
          disableRowSelectionOnClick
          disableColumnMenu
          loading={loading}
          localeText={{
            ...ptBR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: 'Nenhuma música encontrada',
          }}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default SongLibrary;
