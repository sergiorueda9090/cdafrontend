import React, { useState } from 'react';
import {
    Box, Divider, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Typography, IconButton, Collapse
} from '@mui/material';
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
    console.log("idrol ",idrol)
    const location = useLocation();
    const [openMovements, setOpenMovements] = useState(false);
    const [openMovementsTarjeta, setOpenMovementsTarjeta] = useState(false);

    const handleToggleMovements = () => setOpenMovements(!openMovements);
    const handleToggleMovementsTarjeta = () => setOpenMovementsTarjeta(!openMovementsTarjeta);
    {/*{ text: 'Customer', icon: <PeopleIcon />,  route: '/customer' },
       { text: 'Profile',  icon: <PeopleIcon />,  route: '/customer/profile' },*/}

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

    return (
        <Box component='nav' sx={{ width: isSidebarOpen ? drawerWidth : 0, flexShrink: { sm: 0 } }}>
            {/* Drawer Móvil */}
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
                    {filteredItems.map(({ text, icon, route }) => (
                        <ListItem key={text} disablePadding>
                            <StyledLink to={route} onClick={handleDrawerToggle}>
                                <ListItemButton selected={location.pathname === route}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </StyledLink>
                        </ListItem>
                    ))}

                    {(idrol == 1 || idrol == 2) && (
                        <>
                            {/* Submenú tarjetas */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleToggleMovementsTarjeta}>
                                    <ListItemIcon><CreditCardIcon /></ListItemIcon>
                                    <ListItemText primary="Información de tarjetas bancarias" />
                                    {openMovementsTarjeta ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={openMovementsTarjeta} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {tarjetasSideBar.map(({ text, icon, route }) => (
                                        <ListItem key={text} disablePadding>
                                            <StyledLink to={route} onClick={handleDrawerToggle}>
                                                <ListItemButton sx={{ pl: 4 }} selected={location.pathname === route}>
                                                    <ListItemIcon>{icon}</ListItemIcon>
                                                    <ListItemText primary={text} />
                                                </ListItemButton>
                                            </StyledLink>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>

                            {/* Submenú movimientos */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleToggleMovements}>
                                    <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
                                    <ListItemText primary="Gestión de Movimientos" />
                                    {openMovements ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={openMovements} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {gestionMovimientos.map(({ text, icon, route }) => (
                                        <ListItem key={text} disablePadding>
                                            <StyledLink to={route} onClick={handleDrawerToggle}>
                                                <ListItemButton sx={{ pl: 4 }} selected={location.pathname === route}>
                                                    <ListItemIcon>{icon}</ListItemIcon>
                                                    <ListItemText primary={text} />
                                                </ListItemButton>
                                            </StyledLink>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}
                </List>
            </Drawer>

            {/* Drawer Escritorio */}
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
                    {filteredItems.map(({ text, icon, route }) => (
                        <ListItem key={text} disablePadding>
                            <StyledLink to={route}>
                                <ListItemButton selected={location.pathname === route}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </StyledLink>
                        </ListItem>
                    ))}

                    {(idrol == 1 || idrol == 2) && (
                        <>
                            {/* Submenú tarjetas */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleToggleMovementsTarjeta}>
                                    <ListItemIcon><CreditCardIcon /></ListItemIcon>
                                    <ListItemText primary="Información de tarjetas bancarias" />
                                    {openMovementsTarjeta ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={openMovementsTarjeta} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {tarjetasSideBar.map(({ text, icon, route }) => (
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

                            {/* Submenú movimientos */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleToggleMovements}>
                                    <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
                                    <ListItemText primary="Gestión de Movimientos" />
                                    {openMovements ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={openMovements} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {gestionMovimientos.map(({ text, icon, route }) => (
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
                        </>
                    )}
                </List>
                <Divider />
            </Drawer>
        </Box>
    );
};
