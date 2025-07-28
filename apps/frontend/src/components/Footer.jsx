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
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(45deg, black, rgba(0,0,0,0.6))',
        padding: '8px 0',
        fontSize: '0.75rem',
        color: '#aaa',
        textAlign: 'center',
        zIndex: 998,
      }}
    >
      <Box>
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
