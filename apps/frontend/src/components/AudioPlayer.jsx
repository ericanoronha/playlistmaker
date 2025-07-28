import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
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
import shaka from 'shaka-player';

// Função para extrair o ID do vídeo do YouTube
const extractYouTubeId = (url) => {
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

const AudioPlayer = ({ track, playlist }) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const ytPlayerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentIndex = playlist.findIndex((s) => s.id === track.id);
  const isYouTube = track.audio.includes('youtube.com') || track.audio.includes('youtu.be');
  const youTubeId = extractYouTubeId(track.audio);

  useEffect(() => {
    if (track.audio.endsWith('.mpd')) {
      const player = new shaka.Player(videoRef.current);
      player.load(track.audio);
    }
  }, [track]);

  useEffect(() => {
    if (!isYouTube) {
      const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
      if (element) element.volume = volume;
    } else {
      ytPlayerRef.current?.internalPlayer.setVolume(volume * 100);
    }
  }, [volume, track]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isYouTube && ytPlayerRef.current) {
        ytPlayerRef.current.getCurrentTime().then(setProgress);
      } else {
        const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
        if (element && isPlaying) setProgress(element.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, track]);

  const togglePlay = () => {
    if (isYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.internalPlayer.getPlayerState().then((state) => {
        if (state === 1) {
          ytPlayerRef.current.internalPlayer.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.internalPlayer.playVideo();
          setIsPlaying(true);
        }
      });
    } else {
      const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
      if (!element) return;
      if (isPlaying) element.pause();
      else element.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e, newValue) => setVolume(newValue);

  const handleProgressChange = (e, newValue) => {
    if (isYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(newValue);
      setProgress(newValue);
    } else {
      const element = track.audio.endsWith('.mpd') ? videoRef.current : audioRef.current;
      if (element) {
        element.currentTime = newValue;
        setProgress(newValue);
      }
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

  const handleReady = (event) => {
    ytPlayerRef.current = event.target;
    ytPlayerRef.current.setVolume(volume * 100);
    ytPlayerRef.current.playVideo();
    ytPlayerRef.current.getDuration().then(setDuration);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    handleNext();
  };

  return (
    <Box position="fixed" bottom={0} left={0} right={0} bgcolor="#1e1e1e" p={2} borderTop="1px solid #333" zIndex={999}>
      {!isYouTube && track.audio.endsWith('.mpd') && (
        <video ref={videoRef} onEnded={handleNext} autoPlay style={{ display: 'none' }} />
      )}

      {!isYouTube && !track.audio.endsWith('.mpd') && (
        <audio
          ref={audioRef}
          src={track.audio}
          onEnded={handleNext}
          autoPlay
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        />
      )}

      {isYouTube && youTubeId && (
        <YouTube
          videoId={youTubeId}
          onReady={handleReady}
          onEnd={handleEnd}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
            },
          }}
        />
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" sx={{ minWidth: 150 }} noWrap>
          {track.title} — {track.artist}
        </Typography>
        <IconButton onClick={handlePrevious}><SkipPrevious /></IconButton>
        <IconButton onClick={togglePlay}>{isPlaying ? <Pause /> : <PlayArrow />}</IconButton>
        <IconButton onClick={() => setVolume((v) => (v === 0 ? 0.5 : 0))}>
          {volume === 0 ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <Slider value={volume} onChange={handleVolumeChange} step={0.01} min={0} max={1} sx={{ width: 100 }} />
        <Slider
          value={progress}
          min={0}
          max={duration || 0}
          onChange={handleProgressChange}
          sx={{ flex: 1 }}
        />
      </Stack>
    </Box>
  );
};

export default AudioPlayer;
