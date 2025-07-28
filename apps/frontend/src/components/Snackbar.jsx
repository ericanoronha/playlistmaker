import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';

const Snackbar = ({ open, onClose, severity = 'info', message }) => (
  <MuiSnackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </MuiSnackbar>
);

export default Snackbar;