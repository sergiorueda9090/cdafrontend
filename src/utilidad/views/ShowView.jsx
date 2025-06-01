import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Card, Button }      from "@mui/material";
import { useSelector, useDispatch }   from "react-redux";
import KeyboardReturnIcon         from '@mui/icons-material/KeyboardReturn';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadExcelThunk }     from "../../store/cuentasBancariasStore/cuentasBancariasThunks";

import { getTotalAllThunks }                                  from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';
import { getAllDashboardThunks, getFichaProveedorByIdThunk }  from "../../store/fichaProveedoresStore/fichaProveedoresThunks";

import Divider from '@mui/material/Divider';


export const ShowView = () => {

  const dispatch = useDispatch();      
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotalAllThunks());
    dispatch(getAllDashboardThunks())
  },[])
  
  const { fichaProveedoresDashboard } = useSelector(state => state.fichaProveedoresStore);


  const returnTramites = async() => {
    navigate(`/registroTarjetas`);
  };

 
  const handleShow = async(id) => {
    if (id) {
      dispatch(getFichaProveedorByIdThunk(parseInt(id)));
      navigate(`/fichaproveedores/PageShow/${id}`);
    }
   
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
    <Box sx={{ height: 500, width: "100%", p: 3 }}>
     
     <Typography 
          variant="h4" 
          fontWeight="light" 
          gutterBottom 
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} // Aquí añadimos cursor: pointer
          onClick={returnTramites} // Asegúrate de tener el evento onClick
        >
          <KeyboardReturnIcon color="primary" sx={{ fontSize: 30, marginRight: 1 }} /> 
      </Typography>

      <Grid container spacing={2} sx={{mb:2}}>
          {fichaProveedoresDashboard?.map((tarjeta) => (
            <Grid item xs={6} key={tarjeta.id}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  backgroundColor: "#F4F6F8",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                {/* Información principal */}
                <Box mt={2}>
                  <Typography variant="h6" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => handleShow(tarjeta.id)}>
                    Proveedor
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {tarjeta.nombre}
                  </Typography>
                </Box>

                {/* Datos de la cuenta */}
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Saldo:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => handleShow(tarjeta.id)}>
                  {formatoMonedaColombiana(tarjeta.comision_total)}
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Etiqueta:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => handleShow(tarjeta.id)}>
                  {tarjeta.etiqueta}
                  </Typography>
                </Box>

              </Card>
            </Grid>
          ))}
          <br /><br />
      </Grid>
      <Divider component="div" role="presentation">
        <Typography>Fichas Proveedores</Typography>
      </Divider>
    </Box>
  );
};
