import React, { useState } from 'react';
import { Toolbar, useTheme, useMediaQuery }  from '@mui/material';
import { Box }      from '@mui/system'
import { NavBar }   from '../../components/NavBar';
import { SideBar }  from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "Tramites";

export const Layout = ({ children }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [mobileOpen, setMobileOpen] = useState(false);
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
        width: '100%',
        overflow: 'hidden'
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
                width: {
                    xs: '100%',
                    sm: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
                },
                minHeight: '100vh',
                overflow: 'auto',
                p: {
                    xs: 1.5,  // 12px en móviles
                    sm: 2,    // 16px en tablets
                    md: 3     // 24px en desktop
                },
                pt: {
                    xs: 1,    // Menos padding top en móvil
                    sm: 2
                }
            }}
        >
            <Toolbar sx={{
                minHeight: {
                    xs: 56,  // Altura reducida en móvil
                    sm: 64   // Altura estándar en tablet+
                }
            }} />

            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                { children }
            </Box>

        </Box>
    </Box>
  )
}
