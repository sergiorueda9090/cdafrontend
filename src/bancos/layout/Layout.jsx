import React, { useState } from 'react';
import { Toolbar, useTheme, useMediaQuery, Box } from '@mui/material';
import { NavBar } from '../../components/NavBar';
import { SideBar } from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "Cuentas Bancarias";

export const Layout = ({ children }) => {
    const theme = useTheme();
    // Hook de MUI para detectar si la pantalla es móvil (menos de 600px)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);
    // Iniciamos el sidebar cerrado en móvil y abierto en desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

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
            overflow: 'hidden' // Evita que el layout principal tenga scroll horizontal
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
                    // ESTO SOLUCIONA LAS LÍNEAS RARAS:
                    // En desktop, el ancho es 100% menos el Sidebar. En móvil es 100%.
                    width: {
                        xs: '100%',
                        sm: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
                    },
                    // Transición suave para que la tabla no dé saltos al abrir el menú
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    minHeight: '100vh',
                    p: { xs: 1.5, sm: 2, md: 3 }, // Padding adaptativo
                    overflow: 'hidden' // Obliga a que el scroll sea interno
                }}
            >
                {/* Espacio para que el contenido no quede debajo del NavBar */}
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

                {/* Contenedor del Dashboard/Tabla */}
                <Box sx={{
                    flexGrow: 1,
                    width: '100%',
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto' // Aquí es donde aparecerá el scroll si la tabla es muy grande
                }}>
                    { children }
                </Box>
            </Box>
        </Box>
    );
};