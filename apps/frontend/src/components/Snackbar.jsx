import DOMPurify from 'dompurify';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';

const sanitize = (value) => DOMPurify.sanitize(value || '');

const Snackbar = ({ open, message, severity, onClose }) => {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity || 'info'}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {sanitize(message)}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
