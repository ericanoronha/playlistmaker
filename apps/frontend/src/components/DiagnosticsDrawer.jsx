import React, { useState } from 'react';
import {
  Drawer, Button, Box, Typography, List, ListItem,
} from '@mui/material';

const DiagnosticsDrawer = ({ diagnostics }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="text">Observação de performance e diagnóstico técnico</Button>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>Diagnóstico</Typography>
          <List>
            {Object.entries(diagnostics).map(([label, value]) => (
              <ListItem key={label}>
                <Typography variant="body2"><strong>{label}:</strong> {String(value)}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default DiagnosticsDrawer;
