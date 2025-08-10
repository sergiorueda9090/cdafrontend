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
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/recepcionPagoStore/recepcionPagoStoreThunks';
import { createCuentaBancariaThunks } from "../../store/fichaProveedoresStore/fichaProveedoresThunks";

export const ModalPagos = () => {

  const dispatch = useDispatch();

  const { openModalStore }    = useSelector((state) => state.globalStore);
  const { proveedores, id:idP, idProveedor  } = useSelector(state => state.proveedoresStore);

  const { tarjetasBancarias } = useSelector(state => state.registroTarjetasStore);

  const { id, cliente_id, id_tarjeta_bancaria, fecha_transaccion, valor, observacion } = useSelector(state => state.recepcionPagoStore);
  

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

    if (cliente_id == "") {
      newErrors.cliente_id = "El cliente es obligatorio";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  
    //if (!validateForm()) return;
  
    // Formatear fecha_transaccion si tiene valor
    let formattedFecha = fecha_transaccion;
    if (fecha_transaccion) {
      const date = new Date(fecha_transaccion);
      formattedFecha = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ` +
                       `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.` +
                       `${String(date.getMilliseconds()).padStart(3, '0')}000`; // simulando microsegundos
    }
    
    const dataSend = {
      descripcion     : observacion,
      fechaTransaccion: fecha_transaccion,
      idBanco         : id_tarjeta_bancaria,
      idCotizador     : '',
      valor           : valor,
      id              : idP
    };

    console.log("dataSend ",dataSend)
    
    dispatch(createCuentaBancariaThunks(dataSend));

    /*if (id) {
      dataSend.id = id;
      dispatch(updateThunks(dataSend));
    } else {
      dispatch(createThunks(dataSend));
    }*/
  
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
      <DialogTitle>{id ? "Editar Llena los campos para hacer un nuevo pago a proveedores" : "Llena los campos para hacer un nuevo pago a proveedores"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información para realizar un pago a proveedores.
          </DialogContentText>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    disabled
                    options={proveedores}
                    getOptionLabel={(option) => option.nombre || ""}
                    value={
                      proveedores.find((proveedor) => proveedor.id === idProveedor) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="idProveedor"
                        error={!!errors.idProveedor}
                        helperText={errors.idProveedor}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
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
                  type="datetime-local"
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
            {id ? "Editar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};