import React, { useState, useEffect } from 'react';
import { Toolbar }  from '@mui/material';
import { Box }      from '@mui/system'
import { NavBar }   from '../../components/NavBar';
import { SideBar }  from '../../components/SideBar';
import { useDispatch }   from "react-redux";
import { getAllThunks } from '../../store/balancegeneralStore/balancegeneralStoreThunks';

const drawerWidth = 280;
const nameModule = "Balance General";

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    const handleDrawerToggle = () => {
        if (window.innerWidth < 600) {
            setMobileOpen(!mobileOpen);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    useEffect(() => {
        dispatch(getAllThunks())
    },[])
  
  return (
    <Box sx={{ display: 'flex' }}>

        <NavBar drawerWidth={ drawerWidth } nameModule={nameModule} handleDrawerToggle={handleDrawerToggle} isSidebarOpen={isSidebarOpen}/>

        <SideBar drawerWidth={ drawerWidth } mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} isSidebarOpen={isSidebarOpen} />

        <Box 
            component='main'
            sx={{ flexGrow: 1, p: 3 }}
        >
            <Toolbar />

            { children }
            
        </Box>
    </Box>
  )
}
