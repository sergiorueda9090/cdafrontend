import React, {useState } from "react";
import Button             from '@mui/material/Button';
import Dialog             from '@mui/material/Dialog';
import DialogActions      from '@mui/material/DialogActions';
import DialogContent      from '@mui/material/DialogContent';
import DialogTitle        from '@mui/material/DialogTitle';
import DialogContentText  from '@mui/material/DialogContentText';
import { Grid, TextField, FormControl, Autocomplete } from "@mui/material";


import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/utilidadOcacionalStore/utilidadOcacionalStoreThunks';

export const FormDialogUser = () => {

  const dispatch = useDispatch();

  const { openModalStore }    = useSelector((state) => state.globalStore);
  const { tarjetasBancarias } = useSelector(state => state.registroTarjetasStore);
  
  const { id, id_tarjeta_bancaria, fecha_transaccion, valor, observacion } = useSelector(state => state.utilidadOcacionalStore);
  
  const [errors, setErrors]   = useState({});

  const handleChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };

  const handleTarjeta = (value) => {
    dispatch(handleFormStoreThunk({ name: 'id_tarjeta_bancaria', value:value.id }));
  };

  const validateForm = () => {

    const newErrors = {};

    if (id_tarjeta_bancaria == "") {
      newErrors.id_tarjeta_bancaria = "La tarjeta es obligatorio";
    }

    if (fecha_transaccion == "") {
      newErrors.fecha_transaccion = "La fecha de transaccion es obligatorio";
    }

    if (valor == "") {
      newErrors.valor = "El valor es obligatorio";
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
   
    if (!validateForm()) return;

    if (!id) {
      const dataSend = {
        id_tarjeta_bancaria     : id_tarjeta_bancaria,
        fecha_transaccion       : fecha_transaccion,
        valor                   : valor,
        observacion             : observacion
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id: id,
        id_tarjeta_bancaria     : id_tarjeta_bancaria,
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

  const formatCurrency = (value) => {
    if (!value) return "";
    
    // Permitir que el primer carácter sea un signo negativo
    const isNegative = value.toString().startsWith("-");

    // Eliminar todo lo que no sea número
    const number = value.toString().replace(/[^0-9]/g, "");

    // Si no hay número, devolver solo el signo si es negativo
    if (!number) return isNegative ? "-" : "";

    // Convertir a número y aplicar formato con puntos
    const formatted = new Intl.NumberFormat("es-CO").format(number);

    // Si es negativo, anteponer el signo "-"
    return isNegative ? `-${formatted}` : formatted;
  };

  //Función para actualizar valores en la lista con formato de moneda
  const handlePrecioLeyChange = (e) => {
    const formattedValue = formatCurrency(e.target.value);
    dispatch(handleFormStoreThunk({ name: 'valor', value:formattedValue }));
  };

  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>{id ? "Editar Utilidad ocasional" : "Crear Utilidad ocasional"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información para poder crear una nueva Utilidad ocasional.
          </DialogContentText>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                      disablePortal
                      options={ tarjetasBancarias }
                      getOptionLabel={(option) => option.nombre_cuenta || ""}
                      onChange={(e, value) => handleTarjeta(value)}
                      value={
                        tarjetasBancarias.find((tarjeta) => tarjeta.id === id_tarjeta_bancaria) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tarjetas"
                          error={!!errors.id_tarjeta_bancaria}
                          helperText={errors.id_tarjeta_bancaria}
                        />
                      )}
                    />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
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
            {id ? "Editar Utilidad ocasional" : "Crear Utilidad ocasional 1"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};