// theme.js
import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  typography: {
    fontSize: 12,
  },
  spacing: factor => `${0.25 * factor}rem`,
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default Theme;
