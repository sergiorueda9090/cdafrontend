import React, { useState } from 'react';
import { Toolbar, useTheme, useMediaQuery, Box } from '@mui/material';
import { NavBar } from '../../components/NavBar';
import { SideBar } from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "PDFs";

export const Layout = ({ children }) => {
  const theme = useTheme();
  // Detecta si es pantalla móvil (menos de 600px)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  // En desktop inicia abierto, en móvil inicia cerrado
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      
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
        component="main"
        sx={{
          flexGrow: 1,
          // Ajuste dinámico del ancho para evitar que la tabla se desborde
          width: {
            xs: '100%',
            sm: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          },
          // Espaciado adaptativo
          p: { xs: 1.5, sm: 2, md: 3 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa', // Fondo suave para resaltar la tabla
          overflow: 'hidden' // Evita scroll doble
        }}
      >
        {/* Altura adaptativa de la barra superior */}
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

        {/* Contenedor del contenido (Tabla de PDFs) */}
        <Box sx={{ 
          flexGrow: 1, 
          width: '100%', 
          overflow: 'auto', // Permite scroll interno si la tabla es ancha
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};