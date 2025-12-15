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
    Autocomplete,
    FormControl
} from '@mui/material';
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import LabelIcon from "@mui/icons-material/Label";

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/proveedoresStore/proveedoresThunks';


export const FormDialogUser = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { openModalStore } = useSelector((state) => state.globalStore);
    const { id, nombre, etiqueta } = useSelector((state) => state.proveedoresStore);
    const { etiquetas } = useSelector((state) => state.etiquetasStore);

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

        if (!etiqueta) {
            newErrors.etiqueta = "La etiqueta es obligatoria";
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
            etiqueta: etiqueta,
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

    const handleEtiquetaChange = (value) => {
        dispatch(handleFormStoreThunk({ name: 'etiqueta', value: value?.id || null }));
        // Limpiar error de etiqueta al seleccionar
        if (errors.etiqueta) {
            setErrors({ ...errors, etiqueta: null });
        }
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
                        <PersonAddAltIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    )}
                    <Box>
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
                            {isEditMode ? "Editar Proveedor" : "Crear Proveedor"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                            {isEditMode ? "Modifica la información del proveedor" : "Completa el formulario para registrar un nuevo proveedor"}
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

                    {/* Información del Proveedor */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Información del Proveedor
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    name="nombre"
                                    label="Nombre del Proveedor"
                                    value={nombre}
                                    onChange={handleChange}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    type="text"
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        disablePortal
                                        options={etiquetas}
                                        value={etiquetas.find(e => e.id === etiqueta) || null}
                                        onChange={(event, value) => handleEtiquetaChange(value)}
                                        getOptionLabel={(option) => option.nombre}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            backgroundColor: option.color || '#ddd',
                                                            borderRadius: 0.5,
                                                            border: '1px solid',
                                                            borderColor: 'divider'
                                                        }}
                                                    />
                                                    <Typography variant="body2">{option.nombre}</Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Etiqueta"
                                                error={!!errors.etiqueta}
                                                helperText={errors.etiqueta}
                                                size={isMobile ? "small" : "medium"}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            {etiqueta && etiquetas.find(e => e.id === etiqueta) && (
                                                                <Box
                                                                    sx={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        backgroundColor: etiquetas.find(e => e.id === etiqueta)?.color || '#ddd',
                                                                        borderRadius: 0.5,
                                                                        mr: 1,
                                                                        border: '1px solid',
                                                                        borderColor: 'divider'
                                                                    }}
                                                                />
                                                            )}
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Preview de la etiqueta seleccionada */}
                    {etiqueta && etiquetas.find(e => e.id === etiqueta) && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    Vista Previa de la Etiqueta
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                    <LabelIcon sx={{ color: 'text.secondary' }} />
                                    <Box
                                        sx={{
                                            px: 3,
                                            py: 1.5,
                                            backgroundColor: etiquetas.find(e => e.id === etiqueta)?.color || '#ddd',
                                            color: theme.palette.getContrastText(etiquetas.find(e => e.id === etiqueta)?.color || '#ddd'),
                                            borderRadius: 1,
                                            fontWeight: 600
                                        }}
                                    >
                                        {etiquetas.find(e => e.id === etiqueta)?.nombre}
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    )}
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
                        startIcon={isEditMode ? <EditIcon /> : <PersonAddAltIcon />}
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
                        {isEditMode ? "Actualizar Proveedor" : "Crear Proveedor"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
