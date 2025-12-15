import { useEffect } from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { DataTable } from '../components/DataTable';
import { resetFormularioStore } from '../../store/usersStore/usersStore';
import { openModalShared, clearAlert } from '../../store/globalStore/globalStore';
import { FormDialogUser } from '../components/Modal';

import { useSelector, useDispatch } from 'react-redux';

import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { getAllThunks } from '../../store/usersStore/usersThunks';

import { ToastContainer, toast } from 'react-toastify';

export const UsersSelectedView = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const { alert } = useSelector(state => state.globalStore);

    useEffect(() => {
        if (alert) {
            // Muestra la alerta según el tipo
            if (alert.type === 'success') toast.success(alert.message, { position: 'top-center' });
            if (alert.type === 'error') toast.error(alert.message, { position: 'top-center' });

            // Limpia la alerta después de mostrarla
            dispatch(clearAlert());
        }
    }, [alert, dispatch]);

    useEffect(() => {
        dispatch(getAllThunks());
    }, [dispatch])

    const handleOpenModal = async () => {
        await dispatch(resetFormularioStore());
        await dispatch(openModalShared())
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 2, md: 3 }
        }}>
            {/* Header Section - Responsive */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
                px: { xs: 0, sm: 0 },
                pt: { xs: 0, sm: 0 }
            }}>
                {/* Título - Solo visible en pantallas grandes */}
                <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    fontWeight="600"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        color: 'text.primary',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Usuarios
                </Typography>

                {/* Spacer para pantallas medianas */}
                <Box sx={{ flexGrow: { xs: 0, sm: 1, md: 0 } }} />

                {/* Botón Crear Usuario - Responsive */}
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOpenModal}
                    fullWidth={isMobile}
                    startIcon={<PersonAddAltIcon />}
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1.5, sm: 1 },
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out'
                        }
                    }}
                >
                    {isMobile ? 'Nuevo Usuario' : 'Crear Usuario'}
                </Button>
            </Box>

            {/* Tabla - Responsive Container */}
            <Box sx={{
                flexGrow: 1,
                width: '100%',
                minHeight: 0, // Important for flex child
                backgroundColor: 'background.paper',
                borderRadius: { xs: 1, sm: 2 },
                overflow: 'hidden',
                boxShadow: { xs: 1, sm: 2 }
            }}>
                <DataTable />
            </Box>

            {/* START MODAL */}
            <FormDialogUser />
            {/* END MODAL */}

            {/* START LOAD */}
            <SimpleBackdrop />
            {/* END LOAD */}

            {/* START ALERT */}
            <ToastContainer
                position={isMobile ? "top-center" : "top-right"}
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    padding: isMobile ? '8px' : '16px'
                }}
            />
            {/* END ALERT */}
        </Box>
    )
}
