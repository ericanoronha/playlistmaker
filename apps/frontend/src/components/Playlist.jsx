import React, { useEffect, useState, Suspense, useCallback } from 'react';
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
import { getDeviceId } from '../hooks/useDeviceId';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const deviceId = getDeviceId();

  const fetchPlaylist = useCallback(() => {
    setLoading(true);
    fetch(`/api/playlist?deviceId=${deviceId}`)
      .then((res) => res.json())
      .then((data) => {
        setPlaylist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [deviceId]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  useEffect(() => {
    const listener = (e) => {
      setCurrentTrack(e.detail);
    };
    window.addEventListener('playTrack', listener);
    return () => window.removeEventListener('playTrack', listener);
  }, []);

  const handleRemove = (id) => {
    setLoading(true);
    fetch(`/api/playlist/${id}?deviceId=${deviceId}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          fetchPlaylist();
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(playlist);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPlaylist(reordered);
    // TODO: enviar nova ordem ao backend (via PATCH/PUT com deviceId)
  };

  const handlePlay = (song) => {
    setCurrentTrack(song);
  };

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
                            transition: 'background 0.3s',
                            backgroundColor: snapshot.isDragging
                              ? 'grey.800'
                              : 'background.paper',
                          }}
                          aria-label={`Faixa ${song.title} de ${song.artist}`}
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
                              title={`${song.title} — ${song.artist}`}
                            >
                              {song.title} — {song.artist}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                              title={song.novela || 'Novela não informada'}
                            >
                              {song.novela || 'Novela não informada'}
                            </Typography>
                            <Chip
                              label={song.tipo}
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
                              aria-label={`Remover ${song.title} da playlist`}
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
    </Box>
  );
};

export default Playlist;
