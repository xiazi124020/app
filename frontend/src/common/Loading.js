import React from 'react';
import { Backdrop, CircularProgress, Fade, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/system';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 9999,
    color: '#fff',
  },
}));

const Loading = ({ loadingText = 'Loading...' }) => {
  const classes = useStyles();

  return (
      <Backdrop className={classes.backdrop} open={true}>
        <Fade in={true}>
          <div>
            <CircularProgress color="inherit" />
            <Typography color="inherit">{loadingText}</Typography>
          </div>
        </Fade>
      </Backdrop>
  );
};

export default Loading;
