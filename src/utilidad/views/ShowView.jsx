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
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 } }}>

     <Typography
          variant="h4"
          fontWeight="light"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" }
          }}
          onClick={returnTramites}
        >
          <KeyboardReturnIcon color="primary" sx={{ fontSize: { xs: 24, sm: 28, md: 30 }, marginRight: 1 }} />
      </Typography>

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2 }} sx={{ mb: { xs: 1, sm: 2 } }}>
          {fichaProveedoresDashboard?.map((tarjeta) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tarjeta.id}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 3,
                  p: { xs: 2, sm: 2.5, md: 3 },
                  backgroundColor: "#F4F6F8",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3
                  }
                }}
              >
                {/* Información principal */}
                <Box mt={{ xs: 1, sm: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" }
                    }}
                    onClick={() => handleShow(tarjeta.id)}
                  >
                    Proveedor
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {tarjeta.nombre}
                  </Typography>
                </Box>

                {/* Datos de la cuenta */}
                <Box mt={{ xs: 1.5, sm: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    Saldo:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" }
                    }}
                    onClick={() => handleShow(tarjeta.id)}
                  >
                  {formatoMonedaColombiana(tarjeta.comision_total)}
                  </Typography>
                </Box>

                <Box mt={{ xs: 1.5, sm: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    Etiqueta:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" }
                    }}
                    onClick={() => handleShow(tarjeta.id)}
                  >
                  {tarjeta.etiqueta}
                  </Typography>
                </Box>

              </Card>
            </Grid>
          ))}
      </Grid>
      <Divider component="div" role="presentation" sx={{ my: { xs: 2, sm: 3 } }}>
        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Fichas Proveedores</Typography>
      </Divider>
    </Box>
  );
};
