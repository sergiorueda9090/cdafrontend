import React from 'react';
import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, IconButton } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Icono para cerrar
import PeopleIcon from '@mui/icons-material/People';
import Face6Icon from '@mui/icons-material/Face6';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SecurityIcon from '@mui/icons-material/Security';

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
});

export const SideBar = ({ drawerWidth = 240, mobileOpen, handleDrawerToggle, isSidebarOpen }) => {
    const location = useLocation(); 

    const items = [
        { text: 'Usuarios', icon: <PeopleIcon />, route: '/users' },
        { text: 'Clientes', icon: <Face6Icon />, route: '/clientes' },
        { text: 'Cotizador', icon: <RequestQuoteIcon />, route: '/cotizador' },
        { text: 'Trámites', icon: <ReceiptLongIcon />, route: '/tramites' },
        { text: 'Confirmación de Precios', icon: <AttachMoneyIcon />, route: '/confirmacionprecios' },
        { text: 'Cargar PDFs', icon: <PictureAsPdfIcon />, route: '/cargarpdfs' },
        { text: 'Verificación de Código', icon: <SecurityIcon />, route: '/verify' },
    ];

    return (
        <Box component='nav' sx={{ width: isSidebarOpen ? drawerWidth : 0, flexShrink: { sm: 0 } }}>
            {/* Drawer en móviles */}
            <Drawer
                variant='temporary'
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <Toolbar>
                    <Typography variant='h6' noWrap>CDA</Typography>
                </Toolbar>
                <Divider />
                <List>
                    {items.map(({ text, icon, route }) => (
                        <ListItem key={text} disablePadding>
                            <StyledLink to={route} onClick={handleDrawerToggle}>
                                <ListItemButton selected={location.pathname === route}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </StyledLink>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Drawer permanente en escritorio con opción de ocultar */}
            <Drawer
                variant='permanent'
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: isSidebarOpen ? drawerWidth : 0,
                        transition: 'width 0.3s ease-in-out',
                        overflowX: 'hidden',
                    },
                }}
                open={isSidebarOpen}
            >
                <Toolbar>
                    <Typography variant='h6' noWrap>CDA</Typography>
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    {items.map(({ text, icon, route }) => (
                        <ListItem key={text} disablePadding>
                            <StyledLink to={route}>
                                <ListItemButton selected={location.pathname === route}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </StyledLink>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};
