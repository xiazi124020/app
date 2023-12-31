import React, { useState, useEffect  } from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {isEmpty} from '../common/CommonUtils';
import { Loading } from '../common/Loading';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';

export default function Top() {
  return (
    <Navbar pageTitle={"トップ画面"}>
      <Container component="main" maxWidth="false" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ mt: 8, mb: 8 }}>
          test
        </Box>
      </Container>
    </Navbar>
  );
}
