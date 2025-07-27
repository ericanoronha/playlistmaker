import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import { clearPlaylistCache } from '../utils/playlistStorage';
import DiagnosticsDrawer from '../components/DiagnosticsDrawer';

const Footer = () => (
  <Box textAlign="center" py={2}>
    <Text>
        Feito com ♡ por @ericanoronha
    </Text>
    <Link component="button" variant="body2" onClick={clearPlaylistCache}>
      Limpar cache local
    </Link>
    <DiagnosticsDrawer diagnostics={{
    deviceId: localStorage.getItem('playlist_device_id'),
    cache: JSON.stringify(getCachedPlaylist()),
    }} />
  </Box>
);

export default Footer;
