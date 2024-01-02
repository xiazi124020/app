import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import ListIcon from '@mui/icons-material/List';
import PaidIcon from '@mui/icons-material/Paid';
import GroupsIcon from '@mui/icons-material/Groups';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Navbar({ children, pageTitle }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOutsideClick = (event) => {
    if (open && event.target.closest('#navbar-drawer') === null) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleDrawerOutsideClick);

    return () => {
      document.removeEventListener('click', handleDrawerOutsideClick);
    };
  }, [open]);

  const [subMenuOpen, setSubMenuOpen] = React.useState(false);

  const handleSubMenuClick = () => {
    setSubMenuOpen(!subMenuOpen);
  };


  return (
    <Box sx={{ display: 'flex' }} id="navbar-drawer">
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {pageTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
      
        <Typography variant="h6" noWrap component="div" 
          sx={{
            backgroundColor: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            minHeight: 64,
          }}
        >
        株式会社ジェーシーエル
        </Typography>
        <Divider />
        <List>
          <ListItemButton
            component={Link}
            to="/top"
            sx={{ backgroundColor: "#F5FFFA", textAlign: "left" }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"トップ"} />
          </ListItemButton>
          
          <ListItemButton onClick={handleSubMenuClick} sx={{ backgroundColor: "#F5FFFA", textAlign: "left" }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={"社員"} />
            {subMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={subMenuOpen} timeout="auto" unmountOnExit sx={{ backgroundColor: "#F5FFFA", textAlign: "left" }}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/user">
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary={"社員管理"} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/user/worktime">
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary={"勤務時間記入"} />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            component={Link}
            to="/dept"
            style={{ backgroundColor: "#F5FFFA", textAlign: "left" }}
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary={"部門"} />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/"
            style={{ backgroundColor: "#F5FFFA", textAlign: "left" }}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary={"案件"} />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/"
            style={{ backgroundColor: "#F5FFFA", textAlign: "left" }}
          >
            <ListItemIcon>
              <PaidIcon />
            </ListItemIcon>
            <ListItemText primary={"お客様"} />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/master"
            style={{ backgroundColor: "#F5FFFA", textAlign: "left" }}
          >
            <ListItemIcon>
              <PaidIcon />
            </ListItemIcon>
            <ListItemText primary={"マスター"} />
          </ListItemButton>
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Typography paragraph component="div">
          {children}
        </Typography>
      </Main>
    </Box>
  );
}
