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

  const { openModalStore } = useSelector((state) => state.globalStore);

  const { 
    id, 
    id_tarjeta_bancaria, 
    fecha_transaccion, 
    valor, 
    observacion,
    etiquetaDos,
    idEtiqueta,
    placa,
    cilindraje,
    modelo,
    chasis,
    tipoDocumento,
    numeroDocumento,
    nombreCompleto,
    telefono,
    correo,
    direccion,
    pagoInmediato,
    linkPago,
    precioDeLey,
    comisionPrecioLey,
    total,
    pdf,
    archivo,
    fechaCreacion,
    cotizadorModulo,
    tramiteModulo,
    confirmacionPreciosModulo,
    pdfsModulo,
    idBanco,
    nombre_usuario,
    image_usuario,
    nombre_cliente,
    color_cliente,
    color_etiqueta
  } = useSelector(state => state.historialtramitesemitidosStore);
  
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
      <DialogTitle>Historial Tramites Emitidos</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Ver la información Historial Tramites Emitidos.
          </DialogContentText>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="etiquetaDos"
                    label="Etiqueta Dos"
                    value={etiquetaDos}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="placa"
                    label="Placa"
                    value={placa}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="cilindraje"
                    label="Cilindraje"
                    value={cilindraje}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="modelo"
                    label="Modelo"
                    value={modelo}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="chasis"
                    label="Chasis"
                    value={chasis}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="tipoDocumento"
                    label="Tipo Documento"
                    value={tipoDocumento}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="numeroDocumento"
                    label="Número Documento"
                    value={numeroDocumento}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="nombreCompleto"
                    label="Nombre Completo"
                    value={nombreCompleto}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="telefono"
                    label="Teléfono"
                    value={telefono}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="correo"
                    label="Correo"
                    value={correo}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="direccion"
                    label="Dirección"
                    value={direccion}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="pagoInmediato"
                    label="Pago Inmediato"
                    value={pagoInmediato}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="linkPago"
                    label="Link de Pago"
                    value={linkPago}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="precioDeLey"
                    label="Precio de Ley"
                    value={precioDeLey}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="comisionPrecioLey"
                    label="Comisión Precio Ley"
                    value={comisionPrecioLey}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="total"
                    label="Total"
                    value={total}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="pdf"
                    label="PDF"
                    value={pdf}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="archivo"
                    label="Archivo"
                    value={archivo}
                     // Hace que el campo sea solo de lectura
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    name="fechaCreacion"
                    label="📅 Fecha de Creación"
                    type="date"
                    value={fechaCreacion.split("T")[0]}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Repite para el resto de campos según sea necesario */}
          </Grid>


          
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </form>
    </Dialog>
  );
};