import React, { useEffect, Suspense } from 'react';
import DOMPurify from 'dompurify';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AudioPlayer from './AudioPlayer';
import Snackbar from './Snackbar';
import { usePlaylist } from '../context/PlaylistContext';

const Playlist = () => {
  const {
    playlist,
    loading,
    error,
    currentTrack,
    fetchPlaylist,
    removeTrack,
    reorderPlaylist,
    setCurrentTrack,
    snackbar,
    setSnackbar,
  } = usePlaylist();

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  useEffect(() => {
    const listener = (e) => {
      setCurrentTrack(e.detail);
    };
    window.addEventListener('playTrack', listener);
    return () => window.removeEventListener('playTrack', listener);
  }, [setCurrentTrack]);

  const handleRemove = async (id) => {
    try {
      await removeTrack(id);
    } catch {
      setSnackbar({
        open: true,
        message: 'Erro ao remover faixa',
        severity: 'error',
      });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderPlaylist(result.source.index, result.destination.index);
  };

  const handlePlay = (song) => {
    setCurrentTrack(song);
  };

  const sanitize = (value) => DOMPurify.sanitize(value || '');

  return (
    <Box
      role="region"
      aria-label="Playlist de músicas"
      height="100%"
      overflow="auto"
      position="relative"
      pb="100px"
    >
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {sanitize(error)}
        </Typography>
      ) : playlist.length === 0 ? (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Nenhuma música na playlist.
        </Typography>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlist">
              {(provided) => (
                <Stack
                  spacing={2}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {playlist.map((song, index) => (
                    <Draggable
                      key={song.id}
                      draggableId={song.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          elevation={snapshot.isDragging ? 6 : 1}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            border: '1px solid',
                            borderColor: 'success.main',
                            transition: 'background 0.3s',
                            backgroundColor: snapshot.isDragging
                              ? 'grey.800'
                              : 'background.paper',
                          }}
                          aria-label={`Faixa ${sanitize(song.title)} de ${sanitize(song.artist)}`}
                        >
                          <Box
                            onClick={() => handlePlay(song)}
                            sx={{
                              cursor: 'pointer',
                              maxWidth: 'calc(100% - 40px)',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              noWrap
                              title={`${sanitize(song.title)} — ${sanitize(song.artist)}`}
                            >
                              {sanitize(song.title)} — {sanitize(song.artist)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                              title={sanitize(
                                song.novela || 'Novela não informada',
                              )}
                            >
                              {sanitize(song.novela || 'Novela não informada')}
                            </Typography>
                            <Chip
                              label={sanitize(song.tipo)}
                              size="small"
                              sx={{
                                mt: 1,
                                backgroundColor:
                                  song.tipo === 'Internacional'
                                    ? '#FD7D23'
                                    : 'success.main',
                                color: '#fff',
                              }}
                            />
                          </Box>

                          <Tooltip title="Remover da playlist">
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleRemove(song.id)}
                              aria-label={`Remover ${sanitize(song.title)} da playlist`}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>

          {currentTrack && (
            <Suspense
              fallback={
                <Box textAlign="center" py={2}>
                  Carregando player...
                </Box>
              }
            >
              <AudioPlayer track={currentTrack} playlist={playlist} />
            </Suspense>
          )}
        </>
      )}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default Playlist;
