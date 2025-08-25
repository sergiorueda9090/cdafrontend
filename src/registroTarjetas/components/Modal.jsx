import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, Avatar, Box, Typography, Autocomplete } from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk, updateTranferirThunks } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';

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
  const { id, numero_cuenta, nombre_cuenta, descripcion, saldo, imagen, banco, transMoneyState, tarjetasBancarias, idTarTranMoney, is_daviplata, soldoTransferencia } = useSelector((state) => state.registroTarjetasStore);
  const [errors, setErrors]   = useState({});
  console.log("tarjetasBancarias ",tarjetasBancarias);
  console.log("is_daviplata ",is_daviplata);
  console.log("saldo ",saldo);
  /*const handleChange = (e) => {
    dispatch(handleFormStoreThunk(e.target));
  };*/

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "soldoTransferencia") {
      // Permitir signo negativo solo al inicio
      let numericValue = value.replace(/(?!^-)[^0-9]/g, ""); 
      
      // Si empieza con "-", mantenerlo
      if (value.startsWith("-")) {
        numericValue = "-" + numericValue;
      }

      // Si está vacío, lo dejamos vacío
      if (numericValue === "" || numericValue === "-") {
        dispatch(handleFormStoreThunk({ name, value: numericValue }));
      } else {
        dispatch(handleFormStoreThunk({ name, value: numericValue }));
      }

      return;
    }

    const finalValue = type === "checkbox" ? checked : value;
    dispatch(handleFormStoreThunk({ name, value: finalValue }));
  };

  const handleTypeBank = (value) => {
    dispatch(handleFormStoreThunk({ name: 'banco',          value:value.name }));
  };

  const handleTypeTranMoney = (value) => {
    dispatch(handleFormStoreThunk({ name: 'idTarTranMoney', value:value.id }));
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

      // ✅ Validar que saldoTransferencia no sea mayor a saldo
    if (Number(soldoTransferencia) > Number(saldo)) {
      newErrors.soldoTransferencia = "El saldo a transferir no puede ser mayor al saldo disponible";
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
        banco         : banco,
        is_daviplata  : is_daviplata,
      };

      dispatch(createThunks(dataSend));

    } else {

      const dataSend = {
        id: id,
        numero_cuenta : numero_cuenta,
        nombre_cuenta : nombre_cuenta,
        descripcion   : descripcion,
        imagen        : imagen,
        banco         : banco,
        is_daviplata  : is_daviplata,
      };

      dispatch(updateThunks(dataSend));

    }

    dispatch(closeModalShared());
    
  };


  const handleSubmitTransMoney = (e) => {
   
    e.preventDefault();
    
    if (!validateForm()) return;

    if (id && idTarTranMoney) {
     
      const dataSend = {
        id : id,
        idTarTranMoney : idTarTranMoney,
        soldoTransferencia : soldoTransferencia,
      };

      dispatch(updateTranferirThunks(dataSend));

    }

    dispatch(closeModalShared());
    
  };

  const handleClose = () => {
    dispatch(closeModalShared());
  };

  

  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>{id ? "Editar Tarjeta Bancaria" : "Crear Tarjeta Bancaria"}</DialogTitle>
      <form onSubmit={transMoneyState ? handleSubmitTransMoney : handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información para poder crear una nueva tarjeta bancaria.
          </DialogContentText>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
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
                  autoComplete="off"
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
                  autoComplete="off"
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

              {transMoneyState ? (
                <>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                          <Autocomplete
                              options={tarjetasBancarias}
                              getOptionLabel={(option) => option.nombre_cuenta+' '+option.numero_cuenta}
                              onChange={(event, newValue) => handleTypeTranMoney(newValue)}
                              renderOption={(props, option) => (
                                <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography>{option.nombre_cuenta+' '+option.numero_cuenta}</Typography>
                                </Box>
                              )}
                              renderInput={(params) => <TextField {...params} label="Seleccione la tarjeta a la que desea transferir dinero" />}
                            />
                      </FormControl>
                    </Grid>

                                      <Grid item xs={6}>
                    <TextField
                      autoComplete="off"
                      fullWidth
                      name="saldo"
                      label="📄 Saldo Actual"
                      type="text"
                      value={ new Intl.NumberFormat("es-CO").format(saldo) } 
                      onChange={handleChange}
                      disabled={true}
                    />
                  </Grid>

                
                  <Grid item xs={6}>
                    <TextField
                      autoComplete="off"
                      fullWidth
                      name="soldoTransferencia"
                      label="📄 Saldo Tranferencia"
                      type="text"
                      value={ new Intl.NumberFormat("es-CO").format(soldoTransferencia) } 
                      onChange={handleChange}
                      error={!!errors.soldoTransferencia}
                      helperText={errors.soldoTransferencia}
                    />
                  </Grid>
                </>
                ):(
                <>
                
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Autocomplete
                        options={paymentMethods}
                        getOptionLabel={(option) => option.name}
                        value={paymentMethods.find((option) => option.name === banco) || null}
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
                </>)
              }



              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={is_daviplata}
                      onChange={handleChange}
                      name="is_daviplata"
                      color="primary"
                    />
                  }
                  label="¿Es cuenta DaviPlata?"
                />
              </Grid>
            </Grid>

          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          {transMoneyState ? (
                      <Button type="submit" variant="outlined" color="primary">
                         {id ? "Trasladar dinero" : ""}
                    </Button>
          ):(
            <Button type="submit" variant="outlined" color="primary">
              {id ? "Editar Tarjeta Bancaria" : "Crear Tarjeta Bancaria"}
            </Button>
          )}

        </DialogActions>
      </form>
    </Dialog>
  );
};