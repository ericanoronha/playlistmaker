import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPlayer from 'react-player';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    fetch('/api/playlist')
      .then((res) => res.json())
      .then(setPlaylist)
      .catch(console.error);
  }, []);

  const handleRemove = (id) => {
    fetch(`/api/playlist/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setPlaylist((prev) => prev.filter((item) => item.id !== id));
        }
      })
      .catch(console.error);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updated = Array.from(playlist);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setPlaylist(updated);
  };

  return (
    <Box>
      {playlist.length === 0 ? (
        <Typography variant="body2">Nenhuma música na playlist.</Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <Stack
                spacing={2}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {playlist.map((song, index) => (
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {song.title} — {song.artist}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {song.novela || 'Novela não informada'}
                          </Typography>
                          <Chip
                            label={song.tipo}
                            color={song.tipo === 'Internacional' ? 'default' : 'success'}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Box display="flex" alignItems="center">
                          {song.audio && (
                            <ReactPlayer
                              url={song.audio}
                              playing={false}
                              controls
                              width="200px"
                              height="30px"
                              config={{
                                file: {
                                  attributes: {
                                    controlsList: 'nodownload',
                                  },
                                },
                              }}
                            />
                          )}
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleRemove(song.id)}
                            aria-label="Remover da Playlist"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Box>
  );
};

export default Playlist;
