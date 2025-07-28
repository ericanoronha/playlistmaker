import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';
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
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);

  const currentIndex = playlist.findIndex((s) => s.id === track.id);

  useEffect(() => {
    if (track.audio.endsWith('.mpd')) {
      const player = new shaka.Player(videoRef.current);
      player.load(track.audio);
    }
  }, [track]);

  useEffect(() => {
    const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
    if (element) element.volume = volume;
  }, [volume, track]);

  useEffect(() => {
    const interval = setInterval(() => {
      const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
      if (element && isPlaying) setProgress(element.currentTime);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, track]);

  const togglePlay = () => {
    const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
    if (!element) return;
    if (isPlaying) element.pause();
    else element.play();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => setVolume(newValue);

  const handleProgressChange = (event, newValue) => {
    const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
    if (element) {
      element.currentTime = newValue;
      setProgress(newValue);
    }
  };

  const handleNext = () => {
    const nextTrack = playlist[currentIndex + 1];
    if (nextTrack) {
      setIsPlaying(false);
      const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
      if (element) {
        element.pause();
        element.currentTime = 0;
      }
      window.dispatchEvent(new CustomEvent('playTrack', { detail: nextTrack }));
    }
  };

  const handlePrevious = () => {
    const prevTrack = playlist[currentIndex - 1];
    if (prevTrack) {
      setIsPlaying(false);
      const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
      if (element) {
        element.pause();
        element.currentTime = 0;
      }
      window.dispatchEvent(new CustomEvent('playTrack', { detail: prevTrack }));
    }
  };

  return (
    <Box position="fixed" bottom={0} left={0} right={0} bgcolor="#1e1e1e" p={2} borderTop="1px solid #333" zIndex={999}>
      {track.audio.endsWith('.mpd') ? (
        <video ref={videoRef} onEnded={handleNext} autoPlay style={{ display: 'none' }} />
      ) : (
        <audio ref={audioRef} src={track.audio} onEnded={handleNext} autoPlay onLoadedMetadata={() => setProgress(0)} />
      )}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" sx={{ minWidth: 150 }} noWrap>
          {track.title} — {track.artist}
        </Typography>
        <IconButton onClick={handlePrevious}><SkipPrevious /></IconButton>
        <IconButton onClick={togglePlay}>{isPlaying ? <Pause /> : <PlayArrow />}</IconButton>
        <IconButton onClick={() => setVolume((prev) => (prev === 0 ? 0.5 : 0))}>
          {volume === 0 ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <Slider value={volume} onChange={handleVolumeChange} step={0.01} min={0} max={1} sx={{ width: 100 }} />
        <Slider value={progress} min={0} max={(track.audio.endsWith('.mpd') ? videoRef.current?.duration : audioRef.current?.duration) || 0} onChange={handleProgressChange} sx={{ flex: 1 }} />
      </Stack>
    </Box>
  );
};

export default AudioPlayer;
