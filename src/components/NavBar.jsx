import React, { useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { LogoutOutlined, MenuOutlined, ChevronLeft } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';

import { useDispatch } from 'react-redux';
import { loginFail } from '../store/authStore/authStore';
import { UsersConnected } from './UsersConnected';

export const NavBar = ({ drawerWidth = 240, nameModule = 'JournalApp', handleDrawerToggle, isSidebarOpen }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        dispatch(loginFail());
    };

    return (
        <AppBar
            position='fixed'
            sx={{
                width: {
                    xs: '100%',
                    sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)`
                },
                ml: {
                    xs: 0,
                    sm: `${isSidebarOpen ? drawerWidth : 0}px`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{
                minHeight: { xs: 56, sm: 64 },
                px: { xs: 1, sm: 2, md: 3 }
            }}>
                {/* Botón de menú */}
                <IconButton
                    color='inherit'
                    edge="start"
                    sx={{
                        mr: { xs: 1, sm: 2 },
                        transition: 'transform 0.3s ease'
                    }}
                    onClick={handleDrawerToggle}
                >
                    {isSidebarOpen && !isMobile ? <ChevronLeft /> : <MenuOutlined />}
                </IconButton>

                {/* Título del módulo - Oculto en móviles muy pequeños */}
                <Typography
                    variant={isMobile ? 'subtitle1' : 'h6'}
                    noWrap
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'none', sm: 'block' },
                        fontWeight: 500
                    }}
                >
                    {nameModule}
                </Typography>

                {/* Logo/Título corto para móvil */}
                <Typography
                    variant='subtitle1'
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'block', sm: 'none' },
                        fontWeight: 600
                    }}
                >
                    CDA
                </Typography>

                {/* Contenedor de usuarios conectados y avatar */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 0.5, sm: 1, md: 2 }
                }}>
                    {/* Usuarios conectados - Oculto en móviles pequeños */}
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' }
                    }}>
                        <UsersConnected />
                    </Box>

                    {/* Avatar del usuario actual */}
                    <IconButton
                        color='primary'
                        onClick={handleMenuOpen}
                        sx={{
                            p: { xs: 0.5, sm: 1 },
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        <Avatar
                            alt="User"
                            src="https://free.minimals.cc/assets/images/avatar/avatar-25.webp"
                            sx={{
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 }
                            }}
                        />
                    </IconButton>

                    {/* Menú de usuario */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 180
                            }
                        }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutOutlined sx={{ marginRight: 1.5, fontSize: 20 }} />
                            Cerrar sesión
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
