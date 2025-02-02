import React, { useState } from 'react';
import { AppBar, Grid, IconButton, Toolbar, Typography, Menu, MenuItem, Badge } from '@mui/material';
import { LogoutOutlined, MenuOutlined, ChevronRight } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useDispatch } from 'react-redux';
import { loginFail } from '../store/authStore/authStore';
import { styled } from '@mui/material/styles';

// Lista de colores únicos para los puntos de estado
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#00FFFF', '#FF4500', '#8A2BE2'];

// Estilos del punto de estado (Badge)
const StyledBadge = styled(Badge)(({ theme, statusColor }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: statusColor,
        color: statusColor,
        width: 10,
        height: 10,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.background.paper}`,
    },
}));

export const NavBar = ({ drawerWidth = 240, nameModule = 'JournalApp', handleDrawerToggle, isSidebarOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleMenuClose();
        dispatch(loginFail());
    };

    // Lista de usuarios con imágenes (ejemplo)
    const users = [
        { name: "Remy Sharp", img: "https://mui.com/static/images/avatar/1.jpg" },
        { name: "Travis Howard", img: "https://mui.com/static/images/avatar/2.jpg" },
        { name: "Cindy Baker", img: "https://mui.com/static/images/avatar/3.jpg" },
        { name: "Agnes Walker", img: "https://mui.com/static/images/avatar/4.jpg" },
        { name: "Trevor Henderson", img: "https://mui.com/static/images/avatar/5.jpg" },
    ];

    return (
        <AppBar
            position='fixed'
            sx={{
                width: { sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
                ml: { sm: `${isSidebarOpen ? drawerWidth : 0}px` },
                transition: 'margin 0.3s ease-in-out, width 0.3s ease-in-out',
            }}
        >
            <Toolbar>
                <IconButton color='inherit' edge="start" sx={{ mr: 2 }} onClick={handleDrawerToggle}>
                    {isSidebarOpen ? <ChevronRight /> : <MenuOutlined />}
                </IconButton>

                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6' noWrap>{nameModule}</Typography>

                    {/* Grupo de Avatares con colores únicos */}
                    <AvatarGroup total={users.length}>
                        {users.map((user, index) => (
                            <StyledBadge
                                key={index}
                                overlap="circular"
                                statusColor={colors[index % colors.length]} // Asigna color único
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt={user.name} src={user.img} />
                            </StyledBadge>
                        ))}
                    </AvatarGroup>

                    {/* Avatar del usuario actual */}
                    <IconButton color='primary' onClick={handleMenuOpen}>
                        <Avatar alt="User" src="https://free.minimals.cc/assets/images/avatar/avatar-25.webp" />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
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
