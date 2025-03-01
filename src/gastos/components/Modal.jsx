import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, TextField} from "@mui/material";


import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/gastosStore/gastosStoreThunks';



export const FormDialogUser = () => {

  const dispatch = useDispatch()

  const { openModalStore }        = useSelector((state) => state.globalStore);
  const { id, name, observacion } = useSelector((state) => state.gastosStore);
  const [errors, setErrors]       = useState({});

  const handleChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "El numero del gasto.";
    }


    if (!observacion) {
      newErrors.observacion = "La observacion del gasto es obligatorio";
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
   
    if (!validateForm()) return;

    if (!id) {
     
      const dataSend = {
        name          : name,
        observacion   : observacion,
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id: id,
        name          : name,
        observacion   : observacion,
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
      <DialogTitle>{id ? "Editar Gasto" : "Crear Gasto"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información para poder crear un nuevo Gasto.
          </DialogContentText>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="name"
                  label="Nombre"
                  value={name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="observacion"
                  label="📄 Observacion"
                  type="text"
                  value={observacion}
                  onChange={handleChange}
                  error={!!errors.observacion}
                  helperText={errors.observacion}
                />
              </Grid>
            </Grid>


          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {id ? "Editar Gasto" : "Crear Gasto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
