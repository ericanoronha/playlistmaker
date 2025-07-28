import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import DiagnosticsDrawer from './DiagnosticsDrawer';
import { getCachedPlaylist, clearDeviceCache } from '../utils/cacheUtils';
import { getDeviceId } from '../utils/deviceId';

const Footer = () => {
  const deviceId = getDeviceId();
  const cache = getCachedPlaylist(deviceId) || [];
  const handleClearCache = () => {
    clearDeviceCache();
    window.location.reload();
  };

  return (
    <footer>
      <Box textAlign="center" py={2} sx={{ background: 'linear-gradient(45deg, black, rgba(0,0,0,0.6))' }}>
        <Typography variant="body2" gutterBottom>
          Feito com ♡ por @ericanoronha
        </Typography>
        <Link component="button" variant="body2" onClick={handleClearCache} underline="hover">
          Limpar cache local
        </Link>
        <DiagnosticsDrawer diagnostics={{ deviceId, cache }} />
      </Box>
    </footer>
  );
};

export default Footer;
