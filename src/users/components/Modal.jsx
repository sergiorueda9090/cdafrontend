import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Skeleton,
    Stack,
    Grid,
    Box,
    Typography,
    Avatar,
    Divider,
    useTheme,
    useMediaQuery,
    Chip,
    Alert
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks } from '../../store/usersStore/usersThunks';

export const FormDialogUser = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const { openModalStore } = useSelector(state => state.globalStore);
    const usersStore = useSelector(state => state.usersStore);

    const [formValues, setFormValues] = useState(usersStore);

    useEffect(() => {
        setFormValues(usersStore);
    }, [usersStore])

    // Referencia al input de archivo
    const fileInputRef = useRef(null);

    // START IMAGEN
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Manejar selección de imagen
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setIsLoading(true);
            const imageUrl = URL.createObjectURL(file);

            // Simular un tiempo de carga
            setTimeout(() => {
                setPreview(imageUrl);
                setIsLoading(false);
            }, 800);
        }
    };

    // Eliminar la imagen seleccionada y resetear el input
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    // END IMAGEN

    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    // Manejar cambios en los inputs
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormValues({
            ...formValues,
            [name]: type === "checkbox" ? checked : value,
        });
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};
        if (formValues.idrol == "") {
            newErrors.idrol = "El Rol es obligatorio";
        }
        if (!formValues.username.trim()) newErrors.username = "El usuario es obligatorio";
        if (!formValues.email.trim()) newErrors.email = "El correo es obligatorio";
        else if (!/\S+@\S+\.\S+/.test(formValues.email))
            newErrors.email = "Debe ser un correo válido";
        if (!formValues.first_name.trim()) newErrors.first_name = "El nombre es obligatorio";
        if (!formValues.last_name.trim()) newErrors.last_name = "El apellido es obligatorio";
        if (!formValues.password.trim())
            newErrors.password = "La contraseña es obligatoria";
        else if (formValues.password.length < 6)
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        if (!formValues.repetirPassword.trim())
            newErrors.repetirPassword = "Debes repetir la contraseña";
        else if (formValues.repetirPassword !== formValues.password)
            newErrors.repetirPassword = "Las contraseñas deben coincidir";

        setErrors(newErrors);
        setShowErrors(Object.keys(newErrors).length > 0);

        return Object.keys(newErrors).length === 0;
    };

    // Validar formulario para update
    const validateUpdateForm = () => {
        const newErrors = {};

        if (formValues.username && !formValues.username.trim()) {
            newErrors.username = "El usuario es obligatorio";
        }

        if (formValues.idrol == "") {
            newErrors.idrol = "El Rol es obligatorio";
        }

        if (formValues.email) {
            if (!formValues.email.trim()) {
                newErrors.email = "El correo es obligatorio";
            } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
                newErrors.email = "Debe ser un correo válido";
            }
        }

        if (formValues.first_name && !formValues.first_name.trim()) {
            newErrors.first_name = "El nombre es obligatorio";
        }

        if (formValues.last_name && !formValues.last_name.trim()) {
            newErrors.last_name = "El apellido es obligatorio";
        }

        if (formValues.password) {
            if (!formValues.password.trim()) {
                newErrors.password = "La contraseña es obligatoria";
            } else if (formValues.password.length < 6) {
                newErrors.password = "La contraseña debe tener al menos 6 caracteres";
            }
        }

        if (formValues.repetirPassword) {
            if (!formValues.repetirPassword.trim()) {
                newErrors.repetirPassword = "Debes repetir la contraseña";
            } else if (formValues.repetirPassword !== formValues.password) {
                newErrors.repetirPassword = "Las contraseñas deben coincidir";
            }
        }

        setErrors(newErrors);
        setShowErrors(Object.keys(newErrors).length > 0);

        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formValues.idUser == null) {
            if (validateForm()) {
                let formData = new FormData();

                formData.append("username", formValues.username);
                formData.append("email", formValues.email);
                formData.append("first_name", formValues.first_name);
                formData.append("last_name", formValues.last_name);
                formData.append("password", formValues.password);
                formData.append("repetirPassword", formValues.repetirPassword);
                formData.append("idrol", formValues.idrol);
                formData.append("is_active", formValues.is_active);
                formData.append("is_superuser", 1);

                if (selectedImage) {
                    formData.append("image", selectedImage);
                }

                await dispatch(createThunks(formData));
            }
        } else {
            if (validateUpdateForm()) {
                let data = {
                    id: formValues.idUser,
                    username: formValues.username,
                    email: formValues.email,
                    first_name: formValues.first_name,
                    last_name: formValues.last_name,
                    password: formValues.password,
                    repetirPassword: formValues.repetirPassword,
                    idrol: formValues.idrol,
                    image: selectedImage,
                    is_active: formValues.is_active,
                    is_superuser: 1,
                }

                await dispatch(updateThunks(data));
            }
        }
    };

    const handleClose = () => {
        dispatch(closeModalShared());
        setErrors({});
        setShowErrors(false);
    };

    const isEditMode = formValues.idUser != null;

    return (
        <Dialog
            open={openModalStore}
            keepMounted
            onClose={handleClose}
            fullWidth={true}
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
                        <PersonAddIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    )}
                    <Box>
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
                            {isEditMode ? "Editar Usuario" : "Crear Usuario"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                            {isEditMode ? "Modifica la información del usuario" : "Completa el formulario para registrar un nuevo usuario"}
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

                    {/* Sección de Imagen de Perfil */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary">
                            Foto de Perfil
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={3}
                            alignItems={{ xs: 'center', sm: 'flex-start' }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                {isLoading ? (
                                    <Skeleton variant="circular" width={isMobile ? 120 : 140} height={isMobile ? 120 : 140} />
                                ) : preview ? (
                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                        <Avatar
                                            src={preview}
                                            alt="Preview"
                                            sx={{
                                                width: { xs: 120, sm: 140 },
                                                height: { xs: 120, sm: 140 },
                                                border: '4px solid',
                                                borderColor: 'primary.main',
                                                boxShadow: 4
                                            }}
                                        />
                                        <IconButton
                                            onClick={handleRemoveImage}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                backgroundColor: 'error.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'error.dark',
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: { xs: 120, sm: 140 },
                                            height: { xs: 120, sm: 140 },
                                            backgroundColor: 'action.hover',
                                            border: '2px dashed',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <PhotoCameraIcon sx={{ fontSize: 48, color: 'action.active' }} />
                                    </Avatar>
                                )}
                            </Box>

                            <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-image-input"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="upload-image-input">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<PhotoCameraIcon />}
                                        fullWidth={isMobile}
                                        sx={{ mb: 1 }}
                                    >
                                        Seleccionar Imagen
                                    </Button>
                                </label>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Información Personal */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Información Personal
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    label="Nombres"
                                    variant="outlined"
                                    value={formValues.first_name}
                                    onChange={handleChange}
                                    error={Boolean(errors.first_name)}
                                    helperText={errors.first_name}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    label="Apellidos"
                                    variant="outlined"
                                    value={formValues.last_name}
                                    onChange={handleChange}
                                    error={Boolean(errors.last_name)}
                                    helperText={errors.last_name}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="email"
                                    name="email"
                                    type="email"
                                    label="Email"
                                    variant="outlined"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="username"
                                    name="username"
                                    type="text"
                                    label="Usuario"
                                    variant="outlined"
                                    value={formValues.username}
                                    onChange={handleChange}
                                    error={Boolean(errors.username)}
                                    helperText={errors.username}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Seguridad */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Seguridad
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="password"
                                    name="password"
                                    type="password"
                                    label={isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
                                    variant="outlined"
                                    value={formValues.password}
                                    onChange={handleChange}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password || (isEditMode ? "Dejar vacío para mantener la actual" : "")}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="passwordRepit"
                                    name="repetirPassword"
                                    type="password"
                                    label="Repetir Contraseña"
                                    variant="outlined"
                                    value={formValues.repetirPassword}
                                    onChange={handleChange}
                                    error={Boolean(errors.repetirPassword)}
                                    helperText={errors.repetirPassword}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Rol y Estado */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                            Rol y Estado
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="idrol"
                                    name="idrol"
                                    select
                                    label="Rol Usuario"
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={formValues.idrol}
                                    onChange={handleChange}
                                    error={Boolean(errors.idrol)}
                                    helperText={errors.idrol}
                                    size={isMobile ? "small" : "medium"}
                                >
                                    <option value="">Seleccionar Rol</option>
                                    <option value="1">SuperAdmin</option>
                                    <option value="2">Admin</option>
                                    <option value="3">Auxiliar</option>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    id="is_active"
                                    name="is_active"
                                    select
                                    label="Estado del Usuario"
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={formValues.is_active}
                                    onChange={handleChange}
                                    size={isMobile ? "small" : "medium"}
                                >
                                    <option value="0">Inactivo</option>
                                    <option value="1">Activo</option>
                                </TextField>
                            </Grid>
                        </Grid>
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
                        {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
