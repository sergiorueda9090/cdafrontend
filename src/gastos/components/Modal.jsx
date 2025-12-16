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
    <Dialog
      open={openModalStore}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      fullScreen={window.innerWidth < 600}
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 0, sm: 2 },
          maxHeight: { xs: '100%', sm: 'calc(100% - 64px)' }
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
        padding: { xs: '12px 16px', sm: '16px 24px' }
      }}>
        {id ? "Editar Gasto" : "Crear Gasto"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ padding: { xs: '8px 16px', sm: '16px 24px' } }}>
          <DialogContentText sx={{
            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
            marginBottom: { xs: 1, sm: 2 }
          }}>
            Completa la información para poder crear un nuevo Gasto.
          </DialogContentText>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ marginTop: { xs: 1, sm: 2 } }}>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="name"
                  label="Nombre"
                  value={name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  size={window.innerWidth < 600 ? "small" : "medium"}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
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
                  size={window.innerWidth < 600 ? "small" : "medium"}
                />
              </Grid>
            </Grid>



        </DialogContent>
        <DialogActions sx={{
          padding: { xs: '12px 16px', sm: '16px 24px' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            fullWidth={window.innerWidth < 600}
            size={window.innerWidth < 600 ? "small" : "medium"}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            fullWidth={window.innerWidth < 600}
            size={window.innerWidth < 600 ? "small" : "medium"}
          >
            {id ? "Editar Gasto" : "Crear Gasto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
