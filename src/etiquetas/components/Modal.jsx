import React, { useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Alert,
    Chip
} from '@mui/material';
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ColorLensIcon from "@mui/icons-material/ColorLens";

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/etiquetasStore/etiquetasThunks';


export const FormDialogUser = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { openModalStore } = useSelector((state) => state.globalStore);
    const { id, nombre, color } = useSelector((state) => state.etiquetasStore);

    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    const handleChange = (e) => {
        dispatch(handleFormStoreThunk(e.target));
        // Limpiar error del campo al escribir
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
        }

        if (!color) {
            newErrors.color = "El color es obligatorio";
        }

        setErrors(newErrors);
        setShowErrors(Object.keys(newErrors).length > 0);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const dataSend = {
            id: id || undefined,
            nombre: nombre.trim(),
            color: color,
        };

        if (!id) {
            dispatch(createThunks(dataSend));
        } else {
            dispatch(updateThunks(dataSend));
        }

        dispatch(closeModalShared());
    };

    const handleClose = () => {
        dispatch(closeModalShared());
        setErrors({});
        setShowErrors(false);
    };

    const isEditMode = id != null;

    return (
        <Dialog
            open={openModalStore}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
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
                    {isEditMode ? (
                        <EditIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    ) : (
                        <LabelIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    )}
                    <Box>
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
                            {isEditMode ? "Editar Etiqueta" : "Crear Etiqueta"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                            {isEditMode ? "Modifica la información de la etiqueta" : "Completa el formulario para registrar una nueva etiqueta"}
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

            <form onSubmit={handleSubmit}>
                <DialogContent
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 3 }
                    }}
                >
                    {/* Alert de Errores */}
                    {showErrors && Object.keys(errors).length > 0 && (
                        <Alert
                            severity="error"
                            onClose={() => setShowErrors(false)}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                Por favor corrige los siguientes errores:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>
                                        <Typography variant="body2">{error}</Typography>
                                    </li>
                                ))}
                            </Box>
                        </Alert>
                    )}

                    {/* Información de la Etiqueta */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Información de la Etiqueta
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    name="nombre"
                                    label="Nombre de la Etiqueta"
                                    value={nombre}
                                    onChange={handleChange}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    type="text"
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ColorLensIcon fontSize="small" />
                                        Color de la Etiqueta
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            autoComplete="off"
                                            name="color"
                                            type="color"
                                            value={color || "#000000"}
                                            onChange={handleChange}
                                            error={!!errors.color}
                                            sx={{
                                                width: { xs: '100%', sm: 100 },
                                                '& input': {
                                                    height: { xs: 40, sm: 56 },
                                                    cursor: 'pointer'
                                                }
                                            }}
                                        />
                                        <Chip
                                            label="Vista previa"
                                            sx={{
                                                backgroundColor: color || '#ddd',
                                                color: theme.palette.getContrastText(color || '#ddd'),
                                                fontWeight: 600,
                                                display: { xs: 'none', sm: 'flex' }
                                            }}
                                        />
                                    </Box>
                                    {errors.color && (
                                        <Typography variant="caption" color="error">
                                            {errors.color}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Preview de la etiqueta */}
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            Vista Previa
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Chip
                                label={nombre || "Nombre de la etiqueta"}
                                sx={{
                                    backgroundColor: color || '#ddd',
                                    color: theme.palette.getContrastText(color || '#ddd'),
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    px: 2,
                                    py: 2.5,
                                    height: 'auto'
                                }}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                {/* Footer con botones */}
                <Divider />
                <DialogActions
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 2 },
                        gap: 1,
                        flexDirection: { xs: 'column-reverse', sm: 'row' }
                    }}
                >
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="inherit"
                        fullWidth={isMobile}
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color={isEditMode ? "success" : "primary"}
                        fullWidth={isMobile}
                        startIcon={isEditMode ? <EditIcon /> : <LabelIcon />}
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: 3,
                            '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease'
                            }
                        }}
                    >
                        {isEditMode ? "Actualizar Etiqueta" : "Crear Etiqueta"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
