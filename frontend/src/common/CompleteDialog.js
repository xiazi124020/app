import * as React from 'react';
import {Alert} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function CompleteDialog({open, handleCloseOpenComplete, title, message}) {
    const handleClose = () => {
      handleCloseOpenComplete()
    };
  
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ zIndex: 9999 }}
        maxWidth={'xs'}
        fullWidth={true}
      >
        {/* <DialogTitle id="alert-dialog-title" sx={{backgroundColor: '#7FFFD4', minHeight: 50, height: 50, }}>
          {title}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description"  >
            <Alert severity="success">{message}</Alert>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
