import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Stack,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  SkipPrevious,
  SkipNext,
} from '@mui/icons-material';

const AudioPlayer = ({ track, playlist }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);

  const currentIndex = playlist.findIndex((s) => s.id === track.id);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setProgress(audioRef.current.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleProgressChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setProgress(newValue);
    }
  };

  const handleNext = () => {
    const nextTrack = playlist[currentIndex + 1];
    if (nextTrack) {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      window.dispatchEvent(new CustomEvent('playTrack', { detail: nextTrack }));
    }
  };

  const handlePrevious = () => {
    const prevTrack = playlist[currentIndex - 1];
    if (prevTrack) {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      window.dispatchEvent(new CustomEvent('playTrack', { detail: prevTrack }));
    }
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bgcolor="#1e1e1e"
      p={2}
      borderTop="1px solid #333"
      zIndex={999}
    >
      <audio
        ref={audioRef}
        src={track.audio}
        onEnded={handleNext}
        onLoadedMetadata={(e) => setProgress(0)}
        autoPlay
      />

      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" sx={{ minWidth: 150 }} noWrap>
          {track.title} — {track.artist}
        </Typography>

        <IconButton onClick={handlePrevious} aria-label="Anterior">
          <SkipPrevious />
        </IconButton>

        <IconButton onClick={togglePlay} aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        <IconButton
          onClick={() => setVolume((prev) => (prev === 0 ? 0.5 : 0))}
          aria-label="Alternar volume"
        >
          {volume === 0 ? <VolumeOff /> : <VolumeUp />}
        </IconButton>

        <Slider
          value={volume}
          onChange={handleVolumeChange}
          step={0.01}
          min={0}
          max={1}
          aria-label="Volume"
          sx={{ width: 100 }}
        />

        <Slider
          value={progress}
          min={0}
          max={audioRef.current?.duration || 0}
          onChange={handleProgressChange}
          sx={{ flex: 1 }}
          aria-label="Barra de progresso"
        />
      </Stack>
    </Box>
  );
};

export default AudioPlayer;
