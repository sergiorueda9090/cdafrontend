import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, Avatar, Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

import {  List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Ícono de check verde

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks, handleFormStoreThunk }     from '../../store/etiquetasStore/etiquetasThunks';
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
  { name: "Banco de Bogotá", image: bancobogota },
  { name: "Bancolombia", image: bancolombia },
  { name: "Davivienda", image: davienda },
  { name: "Diners Club", image: dinnersclub },
  { name: "Mastercard", image: mastercard },
  { name: "Nequi", image: nequi },
  { name: "Banco Popular", image: bacopopular },
  { name: "Banco Accidente", image: bancoaccidente },
  { name: "Banco AV Villas", image: bancoavevillas },
  { name: "Banco BBVA", image: bancobbva },
  { name: "Banco Colpatria", image: bancocolpatria },
  { name: "Banco Falabella", image: bancofalabella },
  { name: "Banco Itaú", image: bancoitu },
  { name: "Banco Lulo", image: bancolulo },
  { name: "Banco Pichincha", image: bancopichincha },
  { name: "Banco Santander", image: bancosantander },
];


export const FormDialogUser = () => {

  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState("");
  const { openModalStore }    = useSelector((state) => state.globalStore);
  const { id, fechaIngreso, fechaTransaccion, descripcion, valor, cilindraje, nombreTitular, archivo } = useSelector((state) => state.cuentasBancariasStore);
  const [errors, setErrors]   = useState({});


  const handleClose = () => {
    dispatch(closeModalShared());
  };



  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Imagen del soporte de pago</DialogTitle>
      <form>
        <DialogContent>
          <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                    <CardMedia
                      component="img"
                      image={archivo} // URL de la imagen
                      alt="Soporte de Pago"
                      sx={{
                        maxWidth: "100%", // Asegura que la imagen no se desborde
                        height: "auto", // Mantiene la proporción original de la imagen
                        objectFit: "contain", // Muestra toda la imagen sin recortar
                      }}
                    />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Imagen del soporte de pago
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información del Pago
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={`Fecha de Ingreso: ${fechaIngreso}`} />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={`Descripción: ${descripcion}`} />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={`Total: ${ new Intl.NumberFormat('es-CO', { 
                                                      minimumFractionDigits: 0, 
                                                      maximumFractionDigits: 0 
                                                    }).format(valor)} COP`} />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={`Cilindraje: ${cilindraje}`} />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={`Titular: ${nombreTitular}`} />
                </ListItem>
              </List>
            </Grid>

            

            </Grid>

          
        </DialogContent>

      </form>
    </Dialog>
  );
};