import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk }     from '../../store/clientesStore/clientesThunks';
import ExcelUploader from "./ExcelUploader";

export const FormDialogUser = () => {
  const dispatch = useDispatch();

  const { openModalStore } = useSelector((state) => state.globalStore);

  const {id, nombre, apellidos, telefono, direccion, color, preciosLey } = useSelector((state) => state.clientesStore);

  const [errors, setErrors] = useState({});


  const handleInputChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validateForm()) return;
  

    if (!id) {

      const dataSend = {
        nombre      : nombre.trim(),
        direccion   : direccion?.trim() || '',
        telefono    : telefono?.trim() || '',
        color       : color,
        precios_ley : JSON.stringify(preciosLey),
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id          : id,
        nombre      : nombre.trim(),
        direccion   : direccion?.trim() || '',
        telefono    : telefono?.trim() || '',
        color       : color,
        precios_ley : JSON.stringify(preciosLey),
      };
    
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
            <Grid item xs={12}>
              <TextField
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

            <Grid item xs={4}>
              <TextField
                fullWidth
                name="telefono"
                label="📞 Teléfono"
                value={telefono}
                onChange={handleInputChange}
                type="text"
              />
            </Grid>
            <Grid item xs={4}>
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