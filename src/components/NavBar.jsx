import React, { useState } from 'react';
import { AppBar, Grid, IconButton, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import { LogoutOutlined, MenuOutlined } from '@mui/icons-material';
import { loginFail } from '../store/authStore/authStore';
import { useSelector, useDispatch }     from 'react-redux';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

export const NavBar = ({ drawerWidth = 240, nameModule = 'JournalApp' }) => {

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null); // Estado para manejar el menú
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Establece el elemento donde se abre el menú
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Cierra el menú
  };

  const handleLogout = () => {
    console.log('Cerrar sesión'); // Aquí puedes colocar la lógica de logout
    handleMenuClose();
    dispatch(loginFail())
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }
      }}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuOutlined />
        </IconButton>

        <Grid container direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6' noWrap component='div'> {nameModule} </Typography>
          <AvatarGroup total={24}>
            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
            <Avatar alt="Travis Howard" src="https://mui.com/static/images/avatar/2.jpg" />
            <Avatar alt="Agnes Walker" src="https://mui.com/static/images/avatar/4.jpg" />
            <Avatar alt="Trevor Henderson" src="https://mui.com/static/images/avatar/5.jpg" />
          </AvatarGroup>

          <IconButton
            color='primary'
            onClick={handleMenuOpen} // Abre el menú al hacer clic
          >
            <Avatar alt="Remy Sharp" src="https://free.minimals.cc/assets/images/avatar/avatar-25.webp" />
          </IconButton>

          <Menu
            anchorEl={anchorEl} // Elemento donde se abre el menú
            open={open} // Controla si el menú está abierto
            onClose={handleMenuClose} // Cierra el menú al hacer clic afuera
          >
            <MenuItem onClick={handleLogout}>
              <LogoutOutlined sx={{ marginRight: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
