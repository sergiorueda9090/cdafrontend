import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks }     from '../../store/usersStore/usersThunks';

export const FormDialogUser = () => {

    //const notify = () => {toast.success('Usuario creado con éxito!', {position: 'top-center',});};

    const dispatch = useDispatch();
    
    const { openModalStore }  = useSelector( state => state.globalStore );
    const usersStore          = useSelector( state => state.usersStore );

    const [formValues, setFormValues] = useState(usersStore);
    
    useEffect(() => {
        setFormValues(usersStore);
    },[usersStore])
    
        // Referencia al input de archivo
        const fileInputRef = useRef(null);

        //START IMAGEN
        const [selectedImage, setSelectedImage] = useState(null);
        const [preview, setPreview] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
    
        // Manejar selección de imagen
        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
            setSelectedImage(file);
            setIsLoading(true); // Mostrar skeleton mientras se carga
            const imageUrl = URL.createObjectURL(file);
    
            // Simular un tiempo de carga
            setTimeout(() => {
                setPreview(imageUrl);
                setIsLoading(false);
            }, 1500);
            }
        };
    
    
        // Eliminar la imagen seleccionada y resetear el input
        const handleRemoveImage = () => {
            setSelectedImage(null);
            setPreview(null);
            if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Resetear el valor del input
            }
        };
        //END IMAGEN

    const [errors, setErrors]         = useState({});

    // Manejar cambios en los inputs
    const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormValues({
                ...formValues,
                [name]: type === "checkbox" ? checked : value,
            });
    };

    // Validar formulario
    const validateForm = () => {

        const newErrors = {};

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

        return Object.keys(newErrors).length === 0;
    };

    // Validar formulario para update
    const validateUpdateForm = () => {
        const newErrors = {};

        // Validar username
        if (formValues.username && !formValues.username.trim()) {
            newErrors.username = "El usuario es obligatorio";
        }

        // Validar email
        if (formValues.email) {
            if (!formValues.email.trim()) {
                newErrors.email = "El correo es obligatorio";
            } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
                newErrors.email = "Debe ser un correo válido";
            }
        }

        // Validar first_name
        if (formValues.first_name && !formValues.first_name.trim()) {
            newErrors.first_name = "El nombre es obligatorio";
        }

        // Validar last_name
        if (formValues.last_name && !formValues.last_name.trim()) {
            newErrors.last_name = "El apellido es obligatorio";
        }

        // Validar password (solo si se desea cambiar)
        if (formValues.password) {
            if (!formValues.password.trim()) {
                newErrors.password = "La contraseña es obligatoria";
            } else if (formValues.password.length < 6) {
                newErrors.password = "La contraseña debe tener al menos 6 caracteres";
            }
        }

        // Validar repetirPassword (solo si se desea cambiar la contraseña)
        if (formValues.repetirPassword) {
            if (!formValues.repetirPassword.trim()) {
                newErrors.repetirPassword = "Debes repetir la contraseña";
            } else if (formValues.repetirPassword !== formValues.password) {
                newErrors.repetirPassword = "Las contraseñas deben coincidir";
            }
        }

        // Guardar errores en el estado
        setErrors(newErrors);

        // Retornar true si no hay errores
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (event) => {

        event.preventDefault();

        if(formValues.idUser == null){

            if (validateForm()) {
               
                let formData = new FormData();

                // Agregar campos de texto al FormData
                formData.append("username",         formValues.username); // Asignando un username por defecto
                formData.append("email",            formValues.email);
                formData.append("first_name",       formValues.first_name);
                formData.append("last_name",        formValues.last_name);
                formData.append("password",         formValues.password);
                formData.append("repetirPassword",  formValues.repetirPassword);
        
                // Agregar imagen solo si existe
                if (selectedImage) {
                    formData.append("image", selectedImage);
                }
        
                console.log("FormData enviado:", formData);
        
                // Enviar al Thunk
                await dispatch(createThunks(formData));
            }

        }else{

            if (validateUpdateForm()) {

                let data = {
                    id          : formValues.idUser,
                    email       : formValues.email,
                    first_name  : formValues.first_name,
                    last_name   : formValues.last_name,
                    password    : formValues.password,
                    repetirPassword:formValues.repetirPassword,
                    image       : selectedImage
                }
                
                await dispatch(updateThunks(data));

            } else {
                console.log("Errores en el formulario:", errors);
            }
        }




    };

    const handleClose = () => {
        dispatch(closeModalShared());
    };
  
  return (
      <Dialog
        open={openModalStore}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle sx={{ padding: '16px 4px 0px 16px' }}>Crear Usuario</DialogTitle>
            <form onSubmit={handleSubmit}>
        <DialogContent>

            <DialogContentText>
                Utiliza este formulario para crear un nuevo usuario. Completa los campos requeridos, como nombre, correo electrónico, y contraseña. Asegúrate de que toda la información sea correcta antes de confirmar. Este proceso permitirá registrar al usuario en el sistema.
            </DialogContentText>

            <Grid container spacing={2} sx={{ marginTop: 3 }}>
                
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
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
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
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
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
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
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
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
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                variant="outlined"
                                value={formValues.password}
                                onChange={handleChange}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="passwordRepit"
                                name="repetirPassword"
                                type="password"
                                label="Repetir Password"
                                variant="outlined"
                                value={formValues.repetirPassword}
                                onChange={handleChange}
                                error={Boolean(errors.repetirPassword)}
                                helperText={errors.repetirPassword}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={2} alignItems="flex-start">
                                <TextField
                                    id="upload-image"
                                    type="file"
                                    variant="outlined"
                                    name="imageUser"
                                    inputRef={fileInputRef}
                                    inputProps={{ accept: "image/*" }}
                                    onChange={handleImageChange}
                                    fullWidth
                                />
                                {isLoading ? (
                                <Skeleton variant="rectangular" width={180} height={180} />
                                ) : (
                                preview && (
                                    <div style={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        borderRadius: "10px",
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleRemoveImage}
                                        style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                        }}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    </div>
                                )
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="estado"
                                name="estado"
                                select
                                label="Estado del Usuario"
                                SelectProps={{
                                native: true,
                                }}
                                value={formValues.estado}
                                onChange={handleChange}
                            >
                                <option value={false}>Inactivo</option>
                                <option value={true}>Activo</option>
                            </TextField>
                        </Grid>


                    </Grid>
               

            </Grid>

            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
          {

            formValues.idUser == null ? 
                                        <Button type="submit" variant="outlined" color="primary">Crear Usuario</Button> 
                                      : 
                                        <Button type="submit" variant="outlined" color="success">Editar Usuario</Button>

          }

       
        </DialogActions>
        </form>

  
      </Dialog>
  );
}