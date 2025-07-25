import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';

const SongLibrary = () => {
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/songs')
      .then((res) => res.json())
      .then(setSongs)
      .catch(console.error);
  }, []);

  const filteredSongs = songs.filter((song) => {
    const titleMatch = song.title?.toLowerCase().includes(filter.toLowerCase());
    const novelaMatch = song.novela?.toLowerCase().includes(filter.toLowerCase());
    return titleMatch || novelaMatch;
  });

  const columns = [
    {
      field: 'title',
      headerName: 'Faixa',
      flex: 1,
      sortable: true,
    },
    {
      field: 'artist',
      headerName: 'Artista',
      flex: 1,
      sortable: true,
    },
    {
      field: 'novela',
      headerName: 'Novela',
      flex: 1,
      sortable: true,
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Nacional'}
          color={params.value === 'Internacional' ? 'default' : 'success'}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box sx={{ flex: 1 }}>
      <TextField
        label="Busque pelo nome da música ou nome da novela"
        variant="outlined"
        fullWidth
        size="small"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={filteredSongs.map((row, index) => ({ id: index, ...row }))}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[100]}
          disableRowSelectionOnClick
          disableColumnMenu
          localeText={{
            ...ptBR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: 'Nenhuma música encontrada',
            columnHeaderSortIconLabel: 'Ordenar',
          }}
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiDataGrid-columnHeaderDraggableContainer': {
              justifyContent: 'center',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SongLibrary;
