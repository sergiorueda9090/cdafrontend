import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, InputLabel, Select, MenuItem, FormControl } from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk }     from '../../store/clientesStore/clientesThunks';
import ExcelUploader from "./ExcelUploader";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon   from "@mui/icons-material/Email";


export const FormDialogUser = () => {
  const dispatch = useDispatch();

  const { openModalStore } = useSelector((state) => state.globalStore);

  const {id, nombre, apellidos, telefono, direccion, color, preciosLey, username, email, medio_contacto } = useSelector((state) => state.clientesStore);

  const [errors, setErrors] = useState({});


  const handleInputChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!username.trim()) {
      newErrors.username = "El username es obligatorio";
    }

    if(medio_contacto == "whatsapp"){

      if(!telefono.trim()){
        newErrors.telefono = "El telefono es obligatorio";
      }
      
    }

    if(medio_contacto == "email"){

      if(!email.trim()){
        newErrors.email = "El email es obligatorio";
      }
      
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Validaciones adicionales para preciosLey
    const isEmpty = val => val === '' || val === null || val === undefined;

    let hasEmptyFields = false;

    preciosLey.forEach((item, index) => {
      if (
        isEmpty(item.descripcion) ||
        isEmpty(item.precio_ley) ||
        isEmpty(item.comision)
      ) {
        alert(`❌ Fila ${index + 1}: Hay campos vacíos o nulos`);
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
      alert(`❌ Descripciones duplicadas encontradas: ${duplicados.join(', ')}`);
    }

    if (hasEmptyFields || duplicados.length > 0) {
      alert('⛔ No se puede continuar. Corrige los errores antes de enviar.');
      return;
    }

    // Datos válidos, proceder con dispatch
    const dataSend = {
      id            : id || undefined,
      nombre        : nombre.trim(),
      direccion     : direccion?.trim() || '',
      telefono      : telefono?.trim() || '',
      color         : color,
      username      : username,
      email         : email,
      medio_contacto: medio_contacto,
      precios_ley : JSON.stringify(preciosLey),
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
  };

  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>{id ? "Editar Cliente" : "Crear Cliente"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del cliente y agrega sus precios de ley si es necesario.
          </DialogContentText>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={7}>
              <TextField
                autoComplete="off"
                fullWidth
                name="nombre"
                label="👤 Nombre Completo"
                value={nombre}
                onChange={handleInputChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                type="text"
              />
            </Grid>

            <Grid item xs={5}>
              <TextField
                autoComplete="off"
                fullWidth
                name="username"
                label="🕵️ Username"
                value={username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
                type="text"
              />
            </Grid>

      
              {/* Select Medio de Contacto */}
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="medio-contacto-label">Medio de contacto</InputLabel>
                  <Select
                    labelId="medio-contacto-label"
                    name="medio_contacto"
                    value={medio_contacto || ""} // ← valor por defecto
                    onChange={handleInputChange} // ← para que se actualice cuando el usuario cambie
                  >
                    <MenuItem value="whatsapp">
                      <WhatsAppIcon sx={{ color: "#25D366", mr: 1 }} />
                      WhatsApp
                    </MenuItem>
                    <MenuItem value="email">
                      <EmailIcon sx={{ color: "#D44638", mr: 1 }} />
                      Email
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="telefono"
                  label="📞 Teléfono"
                  value={telefono}
                  onChange={handleInputChange}
                  type="text"
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="email"
                  label="📧 Email"
                  value={email}
                  onChange={handleInputChange}
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={8}>
                <TextField
                  fullWidth
                  name="direccion"
                  label="🏠 Dirección"
                  value={direccion}
                  onChange={handleInputChange}
                  type="text"
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="color"
                  label="🎨 Seleccionar Color"
                  type="color" // Permite seleccionar un color
                  value={color} // Valor predeterminado
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }} // Mantiene la etiqueta visible
                />
              </Grid>

          </Grid>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <ExcelUploader/>
          </Grid>

          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {id ? "Editar Cliente" : "Crear Cliente"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};