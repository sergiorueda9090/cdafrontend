import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Alert,
    Chip
} from '@mui/material';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ColorLensIcon from "@mui/icons-material/ColorLens";

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/clientesStore/clientesThunks';
import ExcelUploader from "./ExcelUploader";

export const FormDialogUser = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const { openModalStore } = useSelector((state) => state.globalStore);

    const { id, nombre, apellidos, telefono, direccion, color, preciosLey, username, email, medio_contacto } = useSelector((state) => state.clientesStore);

    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    const handleInputChange = (e) => {
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

        if (!username.trim()) {
            newErrors.username = "El username es obligatorio";
        }

        if (medio_contacto == "whatsapp") {
            if (!telefono.trim()) {
                newErrors.telefono = "El teléfono es obligatorio";
            }
        }

        if (medio_contacto == "email") {
            if (!email.trim()) {
                newErrors.email = "El email es obligatorio";
            }
        }

        setErrors(newErrors);
        setShowErrors(Object.keys(newErrors).length > 0);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Validaciones adicionales para preciosLey
        const isEmpty = val => val === '' || val === null || val === undefined;

        let hasEmptyFields = false;
        let errorMessages = [];

        preciosLey.forEach((item, index) => {
            if (
                isEmpty(item.descripcion) ||
                isEmpty(item.precio_ley) ||
                isEmpty(item.comision)
            ) {
                errorMessages.push(`Fila ${index + 1}: Hay campos vacíos`);
                hasEmptyFields = true;
            }
        });

        // Verificar duplicados en descripcion
        const descripcionCount = {};
        preciosLey.forEach(item => {
            const desc = item.descripcion;
            if (desc && desc.trim() !== '') {
                descripcionCount[desc] = (descripcionCount[desc] || 0) + 1;
            }
        });

        const duplicados = Object.entries(descripcionCount)
            .filter(([desc, count]) => count > 1)
            .map(([desc]) => desc);

        if (duplicados.length > 0) {
            errorMessages.push(`Descripciones duplicadas: ${duplicados.join(', ')}`);
        }

        if (errorMessages.length > 0) {
            setErrors({ preciosLey: errorMessages.join('. ') });
            setShowErrors(true);
            return;
        }

        // Datos válidos, proceder con dispatch
        const dataSend = {
            id: id || undefined,
            nombre: nombre.trim(),
            direccion: direccion?.trim() || '',
            telefono: telefono?.trim() || '',
            color: color,
            username: username,
            email: email,
            medio_contacto: medio_contacto,
            precios_ley: JSON.stringify(preciosLey),
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
                    {isEditMode ? (
                        <EditIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    ) : (
                        <PersonAddIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    )}
                    <Box>
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
                            {isEditMode ? "Editar Cliente" : "Crear Cliente"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                            {isEditMode ? "Modifica la información del cliente" : "Completa el formulario para registrar un nuevo cliente"}
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

                    {/* Información Principal */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Información Principal
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={7}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    name="nombre"
                                    label="Nombre Completo"
                                    value={nombre}
                                    onChange={handleInputChange}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    type="text"
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    name="username"
                                    label="Username"
                                    value={username}
                                    onChange={handleInputChange}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    type="text"
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Información de Contacto */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Información de Contacto
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                                    <InputLabel id="medio-contacto-label">Medio de contacto</InputLabel>
                                    <Select
                                        labelId="medio-contacto-label"
                                        label="Medio de contacto"
                                        name="medio_contacto"
                                        value={medio_contacto || ""}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="whatsapp">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WhatsAppIcon sx={{ color: "#25D366" }} />
                                                WhatsApp
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="email">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailIcon sx={{ color: "#D44638" }} />
                                                Email
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    name="telefono"
                                    label="Teléfono"
                                    value={telefono}
                                    onChange={handleInputChange}
                                    type="text"
                                    error={!!errors.telefono}
                                    helperText={errors.telefono || (medio_contacto === 'whatsapp' ? 'Requerido para WhatsApp' : '')}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    value={email}
                                    onChange={handleInputChange}
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors.email || (medio_contacto === 'email' ? 'Requerido para Email' : '')}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    name="direccion"
                                    label="Dirección"
                                    value={direccion}
                                    onChange={handleInputChange}
                                    type="text"
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ColorLensIcon fontSize="small" />
                                        Color del Cliente
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            autoComplete="off"
                                            name="color"
                                            type="color"
                                            value={color}
                                            onChange={handleInputChange}
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
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Precios de Ley */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Precios de Ley
                        </Typography>
                        <ExcelUploader />
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
                        startIcon={isEditMode ? <EditIcon /> : <PersonAddIcon />}
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
                        {isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
