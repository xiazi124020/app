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
  const operators = ['+', '-', '*'];
  // const operators = ['+', '-', '*', '/'];
  const getRandomOperator = () => {
    const randomIndex = Math.floor(Math.random() * operators.length);
    return operators[randomIndex];
  };

  const navigate = useNavigate();
  const [captcha1, setCaptcha1] = useState(Math.floor(Math.random() * 10));
  const [captcha2, setCaptcha2] = useState(Math.floor(Math.random() * 10));
  const [captcha3, setCaptcha3] = useState(getRandomOperator());
  const handleCaptchaClick = () => {
    setCaptcha1(Math.floor(Math.random() * 10));
    setCaptcha2(Math.floor(Math.random() * 10));
    setCaptcha3(getRandomOperator());
  };
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: null
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
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

  const checkcaptcha = () => {
    if(captcha3 === "+" && (captcha1 + captcha2) === parseInt(formData.captcha)) {
      return true
    }
    if(captcha3 === "-" && (captcha1 - captcha2) === parseInt(formData.captcha)) {
      return true
    }
    if(captcha3 === "*" && (captcha1 * captcha2) === parseInt(formData.captcha)) {
      return true
    }
    handleCaptchaClick()
    return false
  }
  const handleLogin = () => {

    if(formData.username === 'admin' && formData.password === 'admin') {
      if(!checkcaptcha()) {
        setMessage("認証コードを正しく入力してください。");
        return
      }
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
      setMessage("ユーザー名またはパスワード不正！");
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
      {message && (
        <Alert severity="error" style={{width: '100%'}}>
          {message}
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            width: '100%',
            position: 'relative',
          }}>
              <Button variant="outlined" onClick={handleCaptchaClick} sx={{width: '100%'}}>
                {captcha1}{captcha3}{captcha2}=?
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
    <Container component="main" maxWidth="false" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url("./images/businessman-2753324_1920.jpg")' }}>
      <Box sx={{ mt: 8, mb: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  );
}
