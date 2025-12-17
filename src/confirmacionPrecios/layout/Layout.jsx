import React, { useState } from 'react';
import { Toolbar, useTheme, useMediaQuery }  from '@mui/material';
import { Box }      from '@mui/system'
import { NavBar }   from '../../components/NavBar';
import { SideBar }  from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "Confirmación de precios";

export const Layout = ({ children }) => {

    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    const handleDrawerToggle = () => {
        if (window.innerWidth < 600) {
            setMobileOpen(!mobileOpen);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };
  
  return (
    <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            width: '100vw', // Asegura que no haya scroll horizontal del cuerpo
            overflow: 'hidden',
            backgroundColor: '#f4f6f8' // Un fondo gris muy claro para que la tabla blanca resalte
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
                    // ESTO ES CLAVE: Ajusta el ancho restando el sidebar solo si está abierto
                    width: {
                        xs: '100%',
                        sm: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
                    },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    minHeight: '100vh',
                    p: { xs: 1.5, sm: 2, md: 3 },
                    pt: { xs: 1, sm: 2 },
                    overflowX: 'hidden' // Evita que el layout principal cree scrolls raros
                }}
            >
                {/* Espaciador del NavBar */}
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

                {/* Contenedor Interno para la Tabla y Filtros */}
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '100%',
                    // Este overflow asegura que si la tabla es muy ancha, 
                    // el scroll se quede DENTRO de este contenedor y no rompa el diseño
                    overflow: 'auto' 
                }}>
                    { children }
                </Box>
            </Box>
        </Box>
  )
}
