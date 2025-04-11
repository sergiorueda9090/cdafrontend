import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

import { Autocomplete, FormControl } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk }     from '../../store/proveedoresStore/proveedoresThunks';


export const FormDialogUser = () => {

  const dispatch = useDispatch();

  const { openModalStore }  = useSelector((state) => state.globalStore);
  const { id, nombre, etiqueta }      = useSelector((state) => state.proveedoresStore);
  const { etiquetas }       = useSelector((state) => state.etiquetasStore);
  console.log("etiqueta ",etiqueta);
  console.log("nombre ",nombre);
  const [errors, setErrors]   = useState({});

  const handleChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if(!etiqueta){
      newErrors.etiqueta = "La etiqueta es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
   
    if (!validateForm()) return;

    if (!id) {
     
      const dataSend = {
        nombre: nombre,
        etiqueta : etiqueta,
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id    : id,
        nombre: nombre,
        etiqueta: etiqueta
      };

      dispatch(updateThunks(dataSend));

    }

    dispatch(closeModalShared());
    
  };

  const handleClose = () => {
    dispatch(closeModalShared());
  };

    const handleEtiquetaDosChange = (value) => {
      //dispatch(handleFormStoreThunk({ name: 'etiquetaDos',  value: value.nombre}));
      dispatch(handleFormStoreThunk({ name: 'etiqueta',   value: value.id}));
    };
    
    console.log("etiquetas ",etiquetas)
  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg" >
      <DialogTitle>{id ? "Editar Proveedor" : "Crear Proveedor"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del proveedor.
          </DialogContentText>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <TextField
                autoComplete="off"
                fullWidth
                name="nombre"
                label="👤 Nombre"
                value={nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>

            <Grid item xs={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    options={etiquetas}
                    value={etiquetas.find(e => e.id === etiqueta) || null} // Asegura que el valor seleccionado sea un objeto
                    onChange={(event, value) => handleEtiquetaDosChange(value)} // Solo enviamos el nombre
                    getOptionLabel={(option) => option.nombre} // Muestra solo el nombre en la lista
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ETIQUETA"
                        error={!!errors.etiqueta}
                        helperText={errors.etiqueta}
                      />
                    )}
                  />
                </FormControl>
            </Grid>
          </Grid>

          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {id ? "Editar Proveedor" : "Crear Proveedor"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};