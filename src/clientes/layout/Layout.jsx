import { Toolbar }  from '@mui/material';
import { Box }      from '@mui/system'
import { NavBar }   from '../../components/NavBar';
import { SideBar }  from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "Clientes";

export const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>

        <NavBar drawerWidth={ drawerWidth } nameModule={nameModule}/>

        <SideBar drawerWidth={ drawerWidth } />

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
