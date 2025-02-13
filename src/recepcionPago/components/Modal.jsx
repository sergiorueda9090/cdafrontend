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
import { createThunks, updateThunks, handleFormStoreThunk } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';

import bancobogota    from "../../assets/images/payments/mp-banco-bogota.webp";
import  bancolombia   from "../../assets/images/payments/mp-bancolombia.webp";
import  davienda      from "../../assets/images/payments/mp-davivienda.webp";
import  dinnersclub   from "../../assets/images/payments/mp-dinners-club.webp";
import  mastercard    from "../../assets/images/payments/mp-mastercard.webp";
import  nequi         from "../../assets/images/payments/mp-nequi.webp";

import  bacopopular       from "../../assets/images/payments/bacopopular.png";
import  bancoaccidente    from "../../assets/images/payments/bancoaccidente.jpg";
import  bancoavevillas    from "../../assets/images/payments/bancoavevillas.png";
import  bancobbva         from "../../assets/images/payments/bancobbva.png";
import  bancocolpatria    from "../../assets/images/payments/bancocolpatria.png";
import  bancofalabella    from "../../assets/images/payments/bancofalabella.png";
import  bancoitu          from "../../assets/images/payments/bancoitu.png";
import  bancolulo         from "../../assets/images/payments/bancolulo.png";
import  bancopichincha    from "../../assets/images/payments/bancopichincha.png";
import  bancosantander    from "../../assets/images/payments/bancosantander.png";


const paymentMethods = [
  { name: "Banco de Bogotá",  image: bancobogota },
  { name: "Bancolombia",      image: bancolombia },
  { name: "Davivienda",       image: davienda },
  { name: "Diners Club",      image: dinnersclub },
  { name: "Mastercard",       image: mastercard },
  { name: "Nequi",            image: nequi },
  { name: "Banco Popular",    image: bacopopular },
  { name: "Banco Accidente",  image: bancoaccidente },
  { name: "Banco AV Villas",  image: bancoavevillas },
  { name: "Banco BBVA",       image: bancobbva },
  { name: "Banco Colpatria",  image: bancocolpatria },
  { name: "Banco Falabella",  image: bancofalabella },
  { name: "Banco Itaú",       image: bancoitu },
  { name: "Banco Lulo",       image: bancolulo },
  { name: "Banco Pichincha",  image: bancopichincha },
  { name: "Banco Santander",  image: bancosantander },
];


export const FormDialogUser = () => {

  const dispatch = useDispatch();

  const { openModalStore }    = useSelector((state) => state.globalStore);
  const { id, numero_cuenta, nombre_cuenta, descripcion, saldo, imagen, banco } = useSelector((state) => state.registroTarjetasStore);
  const [errors, setErrors]   = useState({});

  const handleChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };

    const handleTypeBank = (value) => {
      console.log("value ",value)
      dispatch(handleFormStoreThunk({ name: 'banco',          value:value.name }));
      //dispatch(handleFormStoreThunk({ name: 'imagen',  value:value.image }));
    };

  const validateForm = () => {
    const newErrors = {};

    if (!numero_cuenta.trim()) {
      newErrors.numero_cuenta = "El numero de cuenta es obligatorio";
    }
    if (!nombre_cuenta) {
      newErrors.nombre_cuenta = "El nombre de la cuenta es obligatorio";
    }

    if (!descripcion) {
      newErrors.descripcion = "La descripcion de la cuenta es obligatorio";
    }

    if (!banco) {
      newErrors.banco = "El tipo del banco es obligatorio";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
   
    if (!validateForm()) return;

    if (!id) {
     
      const dataSend = {
        numero_cuenta : numero_cuenta,
        nombre_cuenta : nombre_cuenta,
        descripcion   : descripcion,
        imagen        : imagen,
        banco         : banco
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id: id,
        numero_cuenta : numero_cuenta,
        nombre_cuenta : nombre_cuenta,
        descripcion   : descripcion,
        imagen        : imagen,
        banco         : banco
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
      <DialogTitle>{id ? "Editar Recepción de pago" : "Crear Recepción de pago"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información para poder crear una nueva Recepción de pago.
          </DialogContentText>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="numero_cuenta"
                  label="🔑 Número de cuenta bancaria"
                  value={numero_cuenta}
                  onChange={handleChange}
                  error={!!errors.numero_cuenta}
                  helperText={errors.numero_cuenta}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="nombre_cuenta"
                  label="👤 Nombre de la cuenta"
                  type="text"
                  value={nombre_cuenta}
                  onChange={handleChange}
                  error={!!errors.nombre_cuenta}
                  helperText={errors.nombre_cuenta}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="descripcion"
                  label="📄 Descripción"
                  type="text"
                  value={descripcion}
                  onChange={handleChange}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>

              {/*<Grid item xs={6}>
                <TextField
                  fullWidth
                  name="saldo"
                  label="💸 Saldo de la cuenta bancaria"
                  type="text"
                  value={saldo}
                  onChange={handleChange}
                  error={!!errors.saldo}
                  helperText={errors.saldo}
                />
              </Grid>*/}

              <Grid item xs={6}>
                <FormControl fullWidth>
                    <Autocomplete
                        options={paymentMethods}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => handleTypeBank(newValue)}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar src={option.image} alt={option.name} sx={{ width: 30, height: 30 }} />
                            <Typography>{option.name}</Typography>
                          </Box>
                        )}
                        renderInput={(params) => <TextField {...params} label="Selecciona un método de pago" />}
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
            {id ? "Editar Recepción de pago" : "Crear Recepción de pago"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};