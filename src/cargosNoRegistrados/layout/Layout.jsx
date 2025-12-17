import React, { useState } from 'react';
import { Toolbar, useTheme, useMediaQuery, Box } from '@mui/material';
import { NavBar } from '../../components/NavBar';
import { SideBar } from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "Cargos no registrados";

export const Layout = ({ children }) => {
    const theme = useTheme();
    // Reemplazamos window.innerWidth por el hook nativo de MUI
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileOpen, setMobileOpen] = useState(false);
    // En pantallas pequeñas iniciamos con el sidebar cerrado para ganar espacio
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile && !isTablet);

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            width: '100vw', 
            overflow: 'hidden',
            backgroundColor: '#f5f7fa' // Fondo profesional para resaltar tablas
        }}>

            <NavBar 
                drawerWidth={drawerWidth} 
                nameModule={nameModule} 
                handleDrawerToggle={handleDrawerToggle} 
                isSidebarOpen={isSidebarOpen}
            />

            <SideBar 
                drawerWidth={drawerWidth} 
                mobileOpen={mobileOpen} 
                handleDrawerToggle={handleDrawerToggle} 
                isSidebarOpen={isSidebarOpen} 
            />

            <Box 
                component='main'
                sx={{ 
                    flexGrow: 1, 
                    display: 'flex',
                    flexDirection: 'column',
                    // Cálculo matemático exacto para evitar desbordamientos y "líneas raras"
                    width: {
                        xs: '100%',
                        sm: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
                    },
                    // Transición suave al abrir/cerrar menú
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    p: { xs: 1.5, sm: 2, md: 3 }, // Espaciado dinámico
                    minHeight: '100vh',
                    overflowX: 'hidden' 
                }}
            >
                {/* Toolbar adaptable para no dejar espacios vacíos arriba */}
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

                {/* Contenedor del contenido que controla el scroll de la tabla */}
                <Box sx={{
                    flexGrow: 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto' // Si la tabla es ancha, el scroll se queda aquí
                }}>
                    { children }
                </Box>
            </Box>
        </Box>
    )
}