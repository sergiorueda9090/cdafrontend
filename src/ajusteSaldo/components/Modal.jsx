import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, Avatar, Box, Typography, Autocomplete } from "@mui/material";


import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/ajustesSaldoStore/ajustesSaldoStoreThunks';

export const FormDialogUser = () => {

  const dispatch = useDispatch();

  const { openModalStore }    = useSelector((state) => state.globalStore);
  const { clientes }          = useSelector(state => state.clientesStore);

  const { id,id_cliente, fecha_transaccion, valor, observacion } = useSelector(state => state.ajustesSaldoStore);
  

  const [errors, setErrors]   = useState({});

  const handleChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };

  const handleCliente = (value) => {
    dispatch(handleFormStoreThunk({ name: 'id_cliente', value:value.value }));
  };



  const validateForm = () => {

    const newErrors = {};


    if (fecha_transaccion == "") {
      newErrors.fecha_transaccion = "La fecha de transaccion es obligatorio";
    }

    if (valor == "") {
      newErrors.valor = "El valor es obligatorio";
    }

    if (id_cliente == "") {
      newErrors.id_cliente = "El cliente es obligatorio";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
   
    if (!validateForm()) return;

    if (!id) {
      const dataSend = {
        id_cliente              : id_cliente,
        fecha_transaccion       : fecha_transaccion,
        valor                   : valor,
        observacion             : observacion
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id: id,
        id_cliente              : id_cliente,
        fecha_transaccion       : fecha_transaccion,
        valor                   : valor,
        observacion             : observacion
      };

      dispatch(updateThunks(dataSend));

    }

    dispatch(closeModalShared());
    
  };

  const handleClose = () => {
    dispatch(closeModalShared());
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\./g, ""); // Elimina puntos existentes
    return new Intl.NumberFormat("es-CO").format(number); // Aplica formato de moneda
  };

  //Función para actualizar valores en la lista con formato de moneda
  const handlePrecioLeyChange = (e) => {
    const formattedValue = formatCurrency(e.target.value);
    dispatch(handleFormStoreThunk({ name: 'valor', value:formattedValue }));
  };

  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>{id ? "Editar  Ajuste de saldo" : "Crear  Ajuste de saldo"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información para poder crear una nueva  Ajuste de saldo.
          </DialogContentText>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Autocomplete
                      disablePortal
                      options={ clientes }
                      getOptionLabel={(option) => option.label || ""}
                      onChange={(e, value) => handleCliente(value)}
                      value={
                        clientes.find((cliente) => cliente.value === id_cliente) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Clientes"
                          error={!!errors.id_cliente}
                          helperText={errors.id_cliente}
                        />
                      )}
                    />
                </FormControl>
              </Grid>


              <Grid item xs={6}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  name="fecha_transaccion"
                  label="📅 Fecha de Transacción"
                  type="date"
                  value={fecha_transaccion}
                  onChange={handleChange}
                  error={!!errors.fecha_transaccion}
                  helperText={errors.fecha_transaccion}
                  InputLabelProps={{ shrink: true }} // Esto asegura que el label no se sobreponga
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="valor"
                  label="💸 Valor"
                  type="text"
                  value={valor}
                  onChange={handlePrecioLeyChange}
                  error={!!errors.valor}
                  helperText={errors.valor}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  name="observacion"
                  label="📄 Observacion"
                  type="text"
                  value={observacion}
                  multiline
                  rows={4} // You can adjust this number based on your needs
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
            {id ? "Editar Ajuste de saldo" : "Crear  Ajuste de saldo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};