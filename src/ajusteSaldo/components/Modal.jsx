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

  // const formatCurrency = (value) => {
  //   if (!value) return "";
  //   const number = value.toString().replace(/\./g, ""); // Elimina puntos existentes
  //   return new Intl.NumberFormat("es-CO").format(number); // Aplica formato de moneda
  // };

  // Permitir formato con valores negativos
  const formatCurrency = (value) => {
    if (value === "" || value === null) return "";

    // Mantener el signo negativo si existe
    const isNegative = value.toString().startsWith("-");

    // Eliminar puntos y signos negativos antes de formatear
    const number = value.toString().replace(/\./g, "").replace(/-/g, "");

    // Si no hay número válido, retornar vacío
    if (number === "") return isNegative ? "-" : "";

    const formatted = new Intl.NumberFormat("es-CO").format(number);
    return isNegative ? `-${formatted}` : formatted;
  };

  //Función para actualizar valores en la lista con formato de moneda
  // const handlePrecioLeyChange = (e) => {
  //   const formattedValue = formatCurrency(e.target.value);
  //   dispatch(handleFormStoreThunk({ name: 'valor', value:formattedValue }));
  // };

  const handlePrecioLeyChange = (e) => {
    let value = e.target.value;

    // Permitir solo números, puntos y un posible "-" al inicio
    if (!/^[-]?\d*\.?\d*$/.test(value.replace(/\./g, ""))) return;

    const formattedValue = formatCurrency(value);
    dispatch(handleFormStoreThunk({ name: "valor", value: formattedValue }));
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
        {id ? "Editar Ajuste de saldo" : "Crear Ajuste de saldo"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ padding: { xs: '8px 16px', sm: '16px 24px' } }}>
          <DialogContentText sx={{
            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
            marginBottom: { xs: 1, sm: 2 }
          }}>
            Completa la información para poder crear un nuevo Ajuste de saldo.
          </DialogContentText>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ marginTop: { xs: 1, sm: 2 } }}>
              <Grid item xs={12} sm={12} md={6}>
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
                          size={window.innerWidth < 600 ? "small" : "medium"}
                        />
                      )}
                    />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
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
                  InputLabelProps={{ shrink: true }}
                  size={window.innerWidth < 600 ? "small" : "medium"}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
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
                  size={window.innerWidth < 600 ? "small" : "medium"}
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
                  rows={window.innerWidth < 600 ? 3 : 4}
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
            {id ? "Editar Ajuste de saldo" : "Crear Ajuste de saldo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};