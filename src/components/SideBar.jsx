import React, { useState } from 'react';
import {
    Box, Divider, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Typography, Collapse, useMediaQuery, useTheme
} from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import PeopleIcon from '@mui/icons-material/People';
import Face6Icon from '@mui/icons-material/Face6';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import LabelIcon from '@mui/icons-material/Label';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FolderIcon from '@mui/icons-material/Folder';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import GroupsIcon from '@mui/icons-material/Groups';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useSelector } from 'react-redux';

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
});

export const SideBar = ({ drawerWidth = 240, mobileOpen, handleDrawerToggle, isSidebarOpen }) => {
    const { idrol } = useSelector(state => state.authStore);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const [openMovements, setOpenMovements] = useState(false);
    const [openMovementsTarjeta, setOpenMovementsTarjeta] = useState(false);

    const handleToggleMovements = () => setOpenMovements(!openMovements);
    const handleToggleMovementsTarjeta = () => setOpenMovementsTarjeta(!openMovementsTarjeta);

    const items = [
        { text: 'Usuarios',                             icon: <PeopleIcon />,           route: '/users' },
        { text: 'Clientes',                             icon: <Face6Icon />,            route: '/clientes' },
        { text: 'Etiquetas',                            icon: <LabelIcon />,            route: '/etiquetas' },
        { text: 'Proveedores',                          icon: <GroupsIcon />,           route: '/proveedores' },
        { text: 'Ficha Proveedores',                    icon: <GroupsIcon />,           route: '/fichaproveedores' },
        { text: 'Cotizador',                            icon: <RequestQuoteIcon />,     route: '/cotizador' },
        { text: 'Trámites',                             icon: <ReceiptLongIcon />,      route: '/tramites' },
        { text: 'Confirmación de Precios',              icon: <AttachMoneyIcon />,      route: '/confirmacionprecios' },
        { text: 'Cargar PDFs',                          icon: <PictureAsPdfIcon />,     route: '/cargarpdfs' },
        { text: 'Cuentas Bancarias',                    icon: <AccountBalanceIcon />,   route: '/bancos' },
        { text: 'Balance General',                      icon: <AssuredWorkloadIcon />,  route: '/balancegeneral' },
        { text: 'Utilidades',                           icon: <MonetizationOnIcon />,   route: '/utilidad' },
        { text: 'Ficha del Cliente',                    icon: <ContactPageIcon />,      route: '/fichaCliente' },
        { text: 'Ficha del Cliente Grupo',              icon: <AccountCircleIcon />,    route: '/fichaClienteGrupo' },
        { text: 'Archivo de cotizaciones antiguas',     icon: <FolderIcon />,           route: '/archivocotizacionesantiguas' },
        { text: 'Historial Tramites emitidos',          icon: <HistoryEduIcon />,       route: '/historialtramitesemitidos' },
    ];

    const filteredItems = items.filter(item => {
        if (idrol == 1) return true;
        if (idrol == 2) return ['Ficha Proveedores', 'Cotizador', 'Trámites',
                               'Confirmación de Precios', 'Cargar PDFs',
                               'Cuentas Bancarias', 'Ficha del Cliente', 'Archivo de cotizaciones antiguas',
                               'Historial Tramites emitidos'].includes(item.text);
        if (idrol == 3) return ['Cotizador','Trámites','Cargar PDFs'].includes(item.text);
        return false;
    });

    const tarjetasSideBar = [
        { text: 'Registro Tarjetas Bancarias', icon: <CreditCardIcon />, route: '/registroTarjetas' },
        { text: 'Total de cada tarjeta', icon: <CreditCardIcon />, route: '/registroTarjetas/totaldecadatarjeta' },
    ];

    const gestionMovimientos = [
        { text: 'Recepción de Pago', icon: <MonetizationOnIcon />, route: '/recepcionpago' },
        { text: 'Devolución', icon: <ReplayIcon />, route: '/devolucion' },
        { text: 'Cargos no registrados', icon: <MoneyOffIcon />, route: '/cargosnoregistrados' },
        { text: 'Ajuste de Saldo', icon: <AccountBalanceWalletIcon />, route: '/ajustesaldo' },
        { text: 'Lista de Gastos', icon: <ShoppingBagIcon />, route: '/gastos' },
        { text: 'Relacionar Gasto', icon: <ReceiptIcon />, route: '/gastosgenerales' },
        { text: 'Utilidad Ocasional', icon: <TrendingUpIcon />, route: '/utilidadocasional' },
    ];

    // Contenido compartido del drawer
    const drawerContent = (isMobileDrawer = false) => (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header del sidebar */}
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    minHeight: { xs: 56, sm: 64 }
                }}
            >
                <Typography
                    variant='h6'
                    noWrap
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: 1,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                >
                    CDA
                </Typography>
            </Toolbar>
            <Divider />

            {/* Lista de navegación con scroll */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                }
            }}>
                <List sx={{ py: 1 }}>
                    {filteredItems.map(({ text, icon, route }) => (
                        <ListItem key={text} disablePadding sx={{ px: 1 }}>
                            <StyledLink
                                to={route}
                                onClick={isMobileDrawer ? handleDrawerToggle : undefined}
                            >
                                <ListItemButton
                                    selected={location.pathname === route}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                            }
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        primaryTypographyProps={{
                                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                            fontWeight: location.pathname === route ? 600 : 400
                                        }}
                                    />
                                </ListItemButton>
                            </StyledLink>
                        </ListItem>
                    ))}

                    {(idrol == 1 || idrol == 2) && (
                        <>
                            {/* Submenú tarjetas */}
                            <ListItem disablePadding sx={{ px: 1 }}>
                                <ListItemButton
                                    onClick={handleToggleMovementsTarjeta}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <CreditCardIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Información de tarjetas bancarias"
                                        primaryTypographyProps={{
                                            fontSize: { xs: '0.875rem', sm: '0.9rem' }
                                        }}
                                    />
                                    {openMovementsTarjeta ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={openMovementsTarjeta} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {tarjetasSideBar.map(({ text, icon, route }) => (
                                        <ListItem key={text} disablePadding sx={{ px: 1 }}>
                                            <StyledLink
                                                to={route}
                                                onClick={isMobileDrawer ? handleDrawerToggle : undefined}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        pl: 5,
                                                        borderRadius: 1,
                                                        mb: 0.5,
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                                        }
                                                    }}
                                                    selected={location.pathname === route}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                        {icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={text}
                                                        primaryTypographyProps={{
                                                            fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </StyledLink>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>

                            {/* Submenú movimientos */}
                            <ListItem disablePadding sx={{ px: 1 }}>
                                <ListItemButton
                                    onClick={handleToggleMovements}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <AccountBalanceWalletIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Gestión de Movimientos"
                                        primaryTypographyProps={{
                                            fontSize: { xs: '0.875rem', sm: '0.9rem' }
                                        }}
                                    />
                                    {openMovements ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={openMovements} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {gestionMovimientos.map(({ text, icon, route }) => (
                                        <ListItem key={text} disablePadding sx={{ px: 1 }}>
                                            <StyledLink
                                                to={route}
                                                onClick={isMobileDrawer ? handleDrawerToggle : undefined}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        pl: 5,
                                                        borderRadius: 1,
                                                        mb: 0.5,
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                                        }
                                                    }}
                                                    selected={location.pathname === route}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                        {icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={text}
                                                        primaryTypographyProps={{
                                                            fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </StyledLink>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box component='nav' sx={{
            width: { xs: 0, sm: isSidebarOpen ? drawerWidth : 0 },
            flexShrink: { sm: 0 }
        }}>
            {/* Drawer Móvil - Temporal */}
            <Drawer
                variant='temporary'
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Mejor rendimiento en móvil
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backgroundImage: 'none',
                    },
                }}
            >
                {drawerContent(true)}
            </Drawer>

            {/* Drawer Escritorio - Permanente */}
            <Drawer
                variant='permanent'
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: isSidebarOpen ? drawerWidth : 0,
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflowX: 'hidden',
                        backgroundImage: 'none',
                        borderRight: isSidebarOpen ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                    },
                }}
                open={isSidebarOpen}
            >
                {drawerContent(false)}
            </Drawer>
        </Box>
    );
};
