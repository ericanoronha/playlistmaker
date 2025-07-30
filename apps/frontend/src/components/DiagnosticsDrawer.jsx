import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';

const DiagnosticsDrawer = ({ open = false, onClose = () => {}, diagnostics = {} }) => {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box p={3} bgcolor="#1e1e1e" color="#fff">
        <Typography variant="h6" gutterBottom>
          Diagnóstico da aplicação
        </Typography>
        <List>
          {Object.entries(diagnostics).map(([key, value]) => (
            <ListItem key={key} divider>
              <ListItemText primary={key} secondary={JSON.stringify(value)} />
            </ListItem>
          ))}
        </List>
        <Box textAlign="right">
          <Button onClick={onClose} variant="contained" color="primary">
            Fechar
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DiagnosticsDrawer;
