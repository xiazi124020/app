import React, { useState, useEffect  } from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Alert, Divider } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {isEmpty} from '../common/CommonUtils';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

function LoginForm() {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = React.useState(Math.floor(Math.random() * 1000000));
  const handleCaptchaClick = () => {
    setCaptcha(Math.floor(Math.random() * 1000000));
  };
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: ''
  });

  
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (!alphanumericRegex.test(value)) {
      return
    }
    setFormData({ ...formData, [name]: value });
  };


  const handleLogin = () => {

    if((formData.username === 'admin' && formData.password === 'admin')) {
      sessionStorage.setItem('token', "0");
      sessionStorage.setItem('username', formData.username );
      // if (location) {
      //   const search = window.location.search;
      //   const queryParams = parseQueryStringToJSON(search);

      //   history.push(location.pathname, queryParams);
      // } else {
      //   history.push('/top');
      // }
      navigate('/top');
    } else {
      setError(true);
    }
  };
  

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter' && !isEmpty(formData.username) && !isEmpty(formData.password)) {
      handleLogin();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnterKeyPress);

    return () => {
      window.removeEventListener('keydown', handleEnterKeyPress);
    };
  }, [handleEnterKeyPress]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',width: '100%',maxWidth: '400px', height: '100%', backgroundColor: '#F0FFFF', padding: 2 }}>
      <Typography component="h2" variant="h6">
        <b>株式会社ジェーシーエル　OA管理システム</b>
      </Typography>
      {error && (
        <Alert severity="error" style={{width: '100%'}}>
          ユーザー名またはパスワード不正！
        </Alert>
      )}
      <Divider style={{backgroundColor: "red"}} />
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
            onChange={handleInputChange}
            InputProps={{
              inputProps: {
                pattern: /[a-zA-Z0-9]*/,
              },
              startAdornment: (
                  <InputAdornment position="start">
                      <AccountCircle />
                  </InputAdornment>
              ),
            }}
            margin="normal"
            required fullWidth
            id="Username"
            label="ユーザ名"
            name="username"
            autoFocus
            variant="standard"
        />
        <TextField
            type={showPassword ? 'text' : 'password'}
            onChange={handleInputChange}
            InputProps={{
              inputProps: {
                pattern: '[a-zA-Z0-9]*',
              },
              startAdornment: (
                  <InputAdornment position="start">
                      <LockIcon />
                  </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            margin="normal"
            required fullWidth
            id="Password"
            label="パスワード"
            name="password"
            variant="standard"
        />
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              InputProps={{
                inputProps: {
                  pattern: '[a-zA-Z0-9]*',
                },
                startAdornment: (
                    <InputAdornment position="start">
                        <VerifiedUserIcon />
                    </InputAdornment>
                ),
              }}
              margin="normal"
              required fullWidth
              id="Captcha"
              label="認証コード"
              name="captcha"
              autoFocus
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
              <Button variant="outlined" onClick={handleCaptchaClick}>
                {captcha}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin} 
            disabled={!isEmpty(formData.username) && !isEmpty(formData.password) && !isEmpty(formData.captcha) ? false: true}>
          登録
        </Button>
      </Box>
    </Box>
  );
}

export default function Login() {
  return (
    <Container component="main" maxWidth="false" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url("./images/background.df9c4cdb.webp")' }}>
      <Box sx={{ mt: 8, mb: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  );
}
