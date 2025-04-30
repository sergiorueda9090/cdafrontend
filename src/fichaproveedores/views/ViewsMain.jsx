import React, { useState, useEffect }               from "react";
import { Grid, Typography, Box, Card, Button }      from "@mui/material";
import { useSelector, useDispatch }                 from "react-redux";
import { useNavigate, useParams }                   from 'react-router-dom';
import { DataTable } from '../components/DataTable';


export const ViewsMain = () => {

  const { id } = useParams();

  const dispatch = useDispatch();      
  const navigate = useNavigate();


  const returnTramites = async() => {
    navigate(`/registroTarjetas`);
  };

 
  const formatoMonedaColombiana = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    .format(valor)
    .replace('$', '') // quitar el símbolo $
    .trim();          // eliminar espacio al inicio si queda
  };

  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid item>
            <Typography fontSize={39} fontWeight="light"> Mostrando datos del proveedor con ID: {id}</Typography>
        </Grid>


        <Grid container sx={{ mt:2, width:"99.99%" }}>
            < DataTable/>
        </Grid>

    </Grid>
  )
};
