import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import DOMPurify from 'dompurify';
import DiagnosticsDrawer from './DiagnosticsDrawer';
import { getCachedPlaylist, clearDeviceCache } from '../utils/cacheUtils';
import { getDeviceId } from '../utils/deviceId';

const sanitize = (value) => DOMPurify.sanitize(value || '');

const Footer = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const deviceId = getDeviceId();
  const cache = getCachedPlaylist(deviceId) || [];
  const diagnostics = { deviceId, cache, renderTime: window.performance?.now().toFixed(2) + 'ms', totalSongs: cache.length, cacheSizeKB: JSON.stringify(cache).length / 1024 };

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
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Typography variant="body2" gutterBottom>
          Feito com ♡ por 
          <a
            href="https://github.com/ericanoronha/playlistmaker"
            target="_blank"
            rel="noopener noreferrer"

          > erica noronha</a>
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
          <Button onClick={handleClearCache} variant="text">Limpar cache local</Button>
          <Button onClick={() => setShowDiagnostics(true)} variant="text">
            Diagnóstico de performance
          </Button>
          <DiagnosticsDrawer
            open={showDiagnostics}
            onClose={() => setShowDiagnostics(false)}
            diagnostics={diagnostics}
          />
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
