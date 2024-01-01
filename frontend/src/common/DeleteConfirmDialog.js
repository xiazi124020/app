import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';

export default function DeleteConfirmDialog({title,message,handleDelete, handleClose, open}) {
    const handleCloseUserDialog = () => {
        handleClose();
    };
    const handleDeleteSelected = () => {
        handleDelete();
    };
    return (
        <React.Fragment>
        <Dialog
            maxWidth={'xs'}
            fullWidth={true}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle sx={{ m: 0, p: 1, backgroundColor:'#F0FFFF',minHeight: 50, height: 50, }} id="alert-dialog-title">
            {title}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {message}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button
                variant='contained'
                edge='end'
                endIcon={<DeleteForeverIcon />}
                color="success"
                sx={{ width: 140, heigth: 30 }}
                onClick={handleDeleteSelected}
                >
                確定
            </Button>
            <Button
                variant='contained'
                edge='end'
                endIcon={<CancelIcon />}
                color="error"
                sx={{ width: 140, heigth: 30 }}
                onClick={handleCloseUserDialog}
                >
                キャンセル
            </Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
    );
}
