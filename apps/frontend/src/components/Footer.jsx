import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import DiagnosticsDrawer from '../components/DiagnosticsDrawer';
import { getCachedPlaylist, clearDeviceCache } from '../utils/cacheUtils';
import { getDeviceId } from '../hooks/useDeviceId';

const Footer = () => {
  const deviceId = getDeviceId();
  const cached = getCachedPlaylist(deviceId);

  const handleClearCache = () => {
    clearDeviceCache();
    window.location.reload();
  };

  return (
    <Box textAlign="center" py={2}>
      <Typography variant="body2" gutterBottom>
        Feito com ♡ por @ericanoronha
      </Typography>
      <Link
        component="button"
        variant="body2"
        onClick={handleClearCache}
        underline="hover"
      >
        Limpar cache local
      </Link>

      <DiagnosticsDrawer
        diagnostics={{
          deviceId,
          cache: JSON.stringify(cached, null, 2),
        }}
      />
    </Box>
  );
};

export default Footer;
