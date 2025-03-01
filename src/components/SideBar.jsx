import React, { useState } from 'react';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, IconButton, Collapse } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PeopleIcon from '@mui/icons-material/People';
import Face6Icon from '@mui/icons-material/Face6';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import LabelIcon from '@mui/icons-material/Label';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Icono para Gestión de Movimientos
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';  // Recepción de Pago
import ReplayIcon from '@mui/icons-material/Replay';                 // Devolución
import ReceiptIcon from '@mui/icons-material/Receipt';               // Gastos Generales
import TrendingUpIcon from '@mui/icons-material/TrendingUp';         // Utilidad Ocasional
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
});

export const SideBar = ({ drawerWidth = 240, mobileOpen, handleDrawerToggle, isSidebarOpen }) => {
    const location = useLocation(); 
    const [openMovements, setOpenMovements] = useState(false); // Estado para el submenú

    const handleToggleMovements = () => {
        setOpenMovements(!openMovements);
    };

    const items = [
        { text: 'Usuarios', icon: <PeopleIcon />, route: '/users' },
        { text: 'Clientes', icon: <Face6Icon />, route: '/clientes' },
        { text: 'Etiquetas', icon: <LabelIcon />, route: '/etiquetas' },
        { text: 'Cotizador', icon: <RequestQuoteIcon />, route: '/cotizador' },
        { text: 'Trámites', icon: <ReceiptLongIcon />, route: '/tramites' },
        { text: 'Confirmación de Precios', icon: <AttachMoneyIcon />, route: '/confirmacionprecios' },
        { text: 'Cargar PDFs', icon: <PictureAsPdfIcon />, route: '/cargarpdfs' },
        { text: 'Registro Tarjetas Bancarias', icon: <CreditCardIcon />, route: '/registroTarjetas' },
        { text: 'Cuentas Bancarias', icon: <AccountBalanceIcon />, route: '/bancos' },
        { text: 'Ficha del Cliente', icon: <ContactPageIcon />, route: '/fichaCliente' },
        { text: 'Verificación de Código', icon: <SecurityIcon />, route: '/verify' },
    ];

    const gestionMovimientos = [
        { text: 'Recepción de Pago',    icon: <MonetizationOnIcon />,       route: '/recepcionpago' },
        { text: 'Devolución',           icon: <ReplayIcon />,               route: '/devolucion' },
        { text: 'Ajuste de Saldo',      icon: <AccountBalanceWalletIcon />, route: '/ajustesaldo' },
        { text: 'Gastos',               icon: <ShoppingBagIcon />,          route: '/gastos' },
        { text: 'Gastos Generales',     icon: <ReceiptIcon />,              route: '/gastosgenerales' },
        { text: 'Utilidad Ocasional',   icon: <TrendingUpIcon />,           route: '/utilidadocasional' },
        { text: 'Dashboard',            icon: <SpaceDashboardIcon />,       route: '/dashboard' },
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

                    {/* Gestión de Movimientos con submenú */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleToggleMovements}>
                            <ListItemIcon>
                                <AccountBalanceWalletIcon />
                            </ListItemIcon>
                            <ListItemText primary="Gestión de Movimientos" />
                            {openMovements ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={openMovements} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {gestionMovimientos.map(({ text, route }) => (
                                <ListItem key={text} disablePadding>
                                    <StyledLink to={route} onClick={handleDrawerToggle}>
                                        <ListItemButton sx={{ pl: 4 }} selected={location.pathname === route}>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    </StyledLink>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
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

                    {/* Gestión de Movimientos con submenú */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleToggleMovements}>
                            <ListItemIcon>
                                <AccountBalanceWalletIcon />
                            </ListItemIcon>
                            <ListItemText primary="Gestión de Movimientos" />
                            {openMovements ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={openMovements} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {gestionMovimientos.map(({ text,icon, route }) => (
                                <ListItem key={text} disablePadding>
                                    <StyledLink to={route}>
                                        <ListItemButton sx={{ pl: 4 }} selected={location.pathname === route}>
                                        <ListItemIcon>{icon}</ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    </StyledLink>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>
                <Divider />
            </Drawer>
        </Box>
    );
};
