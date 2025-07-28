import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Box, IconButton, Slider, Typography, Stack } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff, SkipPrevious, SkipNext } from '@mui/icons-material';

const AudioPlayer = ({ track, playlist }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const currentIndex = playlist.findIndex((s) => s.id === track.id);

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
  }, [track]);

  const handleProgress = (state) => setProgress(state.playedSeconds);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    const next = playlist[currentIndex + 1];
    if (next) window.dispatchEvent(new CustomEvent('playTrack', { detail: next }));
  };
  const handlePrevious = () => {
    const prev = playlist[currentIndex - 1];
    if (prev) window.dispatchEvent(new CustomEvent('playTrack', { detail: prev }));
  };

  return (
    <Box position="fixed" bottom={0} left={0} right={0} bgcolor="#1e1e1e" p={2} borderTop="1px solid #333" zIndex={999}>
      <ReactPlayer
        ref={playerRef}
        url={track.audio}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onEnded={handleNext}
        height="0px"
        width="0px"
        style={{ display: 'none' }}
        onError={(e) => console.error('ReactPlayer error', e)}
      />
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" sx={{ minWidth: 150 }} noWrap>
          {track.title} — {track.artist}
        </Typography>
        <IconButton onClick={handlePrevious}><SkipPrevious /></IconButton>
        <IconButton onClick={togglePlay}>{isPlaying ? <Pause /> : <PlayArrow />}</IconButton>
        <IconButton onClick={() => setVolume((v) => (v === 0 ? 0.5 : 0))}>
          {volume === 0 ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <Slider value={volume} onChange={(e, v) => setVolume(v)} step={0.01} min={0} max={1} sx={{ width: 100 }} />
        <Slider value={progress} min={0} max={playerRef.current?.getDuration() || 0} onChange={(e, v) => {
          playerRef.current.seekTo(v, 'seconds');
          setProgress(v);
        }} sx={{ flex: 1 }} />
      </Stack>
    </Box>
  );
};

export default AudioPlayer;
