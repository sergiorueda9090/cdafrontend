import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    IconButton,
    Divider
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from 'react-redux';
import { closeModalShared } from '../../store/globalStore/globalStore';

export const FormDialogUser = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { openModalStore } = useSelector((state) => state.globalStore);
    const { id, fechaIngreso, fechaTransaccion, descripcion, valor, cilindraje, nombreTitular, archivo } = useSelector((state) => state.cuentasBancariasStore);

    const handleClose = () => {
        dispatch(closeModalShared());
    };

    return (
        <Dialog
            open={openModalStore}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                    maxHeight: isMobile ? '100vh' : '90vh'
                }
            }}
        >
            {/* Header del Modal */}
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    py: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ReceiptIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    <Box>
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
                            Soporte de Pago
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                            Imagen y detalles del comprobante
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 2, sm: 3 }
                }}
            >
                <Grid container spacing={3}>
                    {/* Imagen del Soporte */}
                    <Grid item xs={12} md={6}>
                        <Card
                            elevation={2}
                            sx={{
                                borderRadius: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {archivo ? (
                                <>
                                    <CardMedia
                                        component="img"
                                        image={archivo}
                                        alt="Soporte de Pago"
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: { xs: 300, md: 500 },
                                            objectFit: 'contain',
                                            backgroundColor: 'action.hover'
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            Imagen del soporte de pago
                                        </Typography>
                                    </CardContent>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: 300,
                                        backgroundColor: 'action.hover',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="body1" color="text.secondary">
                                        No hay imagen disponible
                                    </Typography>
                                </Box>
                            )}
                        </Card>
                    </Grid>

                    {/* Información del Pago */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h6" gutterBottom fontWeight="600" color="text.primary">
                                Información del Pago
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List sx={{ py: 0 }}>
                                {fechaIngreso && (
                                    <ListItem
                                        sx={{
                                            px: 0,
                                            py: 1.5,
                                            borderRadius: 1,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Fecha de Ingreso"
                                            secondary={fechaIngreso}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                color: 'text.secondary'
                                            }}
                                            secondaryTypographyProps={{
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                color: 'text.primary'
                                            }}
                                        />
                                    </ListItem>
                                )}

                                {descripcion && (
                                    <ListItem
                                        sx={{
                                            px: 0,
                                            py: 1.5,
                                            borderRadius: 1,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Descripción"
                                            secondary={descripcion}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                color: 'text.secondary'
                                            }}
                                            secondaryTypographyProps={{
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                color: 'text.primary'
                                            }}
                                        />
                                    </ListItem>
                                )}

                                {valor !== undefined && valor !== null && (
                                    <ListItem
                                        sx={{
                                            px: 0,
                                            py: 1.5,
                                            borderRadius: 1,
                                            backgroundColor: 'success.lighter',
                                            '&:hover': {
                                                backgroundColor: 'success.light'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Total"
                                            secondary={`$${new Intl.NumberFormat('es-CO', {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(valor)} COP`}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                color: 'text.secondary'
                                            }}
                                            secondaryTypographyProps={{
                                                fontWeight: 700,
                                                fontSize: '1.25rem',
                                                color: 'success.dark'
                                            }}
                                        />
                                    </ListItem>
                                )}

                                {cilindraje && (
                                    <ListItem
                                        sx={{
                                            px: 0,
                                            py: 1.5,
                                            borderRadius: 1,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Cilindraje"
                                            secondary={cilindraje}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                color: 'text.secondary'
                                            }}
                                            secondaryTypographyProps={{
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                color: 'text.primary'
                                            }}
                                        />
                                    </ListItem>
                                )}

                                {nombreTitular && (
                                    <ListItem
                                        sx={{
                                            px: 0,
                                            py: 1.5,
                                            borderRadius: 1,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Titular"
                                            secondary={nombreTitular}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                color: 'text.secondary'
                                            }}
                                            secondaryTypographyProps={{
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                color: 'text.primary'
                                            }}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Footer */}
            <Divider />
            <DialogActions
                sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 2, sm: 2 }
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="primary"
                    fullWidth={isMobile}
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease'
                        }
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
