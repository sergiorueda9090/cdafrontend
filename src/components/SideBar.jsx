import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { TurnedInNot } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import Face6Icon from '@mui/icons-material/Face6';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import SecurityIcon from '@mui/icons-material/Security';

// Estiliza el componente Link
const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
  }));

export const SideBar = ({ drawerWidth = 240 }) => {

    const items = [
        {
            text: 'Usuarios',
            icon: <PeopleIcon />,
            secondary: 'Administración de usuarios del sistema.',
            route: '/users',
        },
        {
            text: 'Clientes',
            icon: <Face6Icon />,
            secondary: 'Administración de clientes del sistema.',
            route: '/clientes',
        },
        {
            text: 'Tramites',
            icon: <ReceiptLongIcon />,
            secondary: 'Administración de tramites del sistema.',
            route: '/tramites',
        },
        {
            text: 'CodeVerification',
            icon: <SecurityIcon />,
            secondary: 'Verificación de código para acceso seguro.',
            route: '/verify',
        },
    ];

  return (
    <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
        <Drawer
            variant='permanent' // temporary
            open
            sx={{ 
                display: { xs: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
            }}
        >
            <Toolbar>
                <Typography variant='h6' noWrap component='div'>
                    CDA
                </Typography>
            </Toolbar>
            <Divider />

            <List>
                {items.map(({ text, icon, secondary, route }) => (
                    <ListItem key={text} disablePadding>
                        <StyledLink to={route}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                <Grid container>
                                    <ListItemText primary={text} />
                                    <ListItemText secondary={secondary} />
                                </Grid>
                            </ListItemButton>
                        </StyledLink>
                    </ListItem>
                ))}
            </List>

        </Drawer>

    </Box>
  )
}
