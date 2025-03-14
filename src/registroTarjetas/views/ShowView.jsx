import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Card, Button }      from "@mui/material";
import { useSelector, useDispatch }   from "react-redux";
import KeyboardReturnIcon         from '@mui/icons-material/KeyboardReturn';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadExcelThunk }     from "../../store/cuentasBancariasStore/cuentasBancariasThunks";

import { getTotalAllThunks } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';

import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
import Divider from '@mui/material/Divider';
import { URL } from "../../constants.js/constantGlogal";


import { dashboard_obtener_datos_cuenta } from '../../store/cuentasBancariasStore/cuentasBancariasThunks';

  // Definir las columnas para el DataGrid
  const columns = [
    { field: "id",          headerName: "ID",             width: 90, hide: true },
    {
      field: "fi",
      headerName: "Fecha Ingreso",
      width: 150,
      valueFormatter: (params) => {
        if (!params) return "";
        return dayjs(params).format("YYYY-MM-DD HH:mm");
      },
    },
    { field: "ft",          headerName: "Fecha Tramite",  width: 250 },
    { field: "desc_alias",  headerName: "Descripción",    width: 250 },
    { field: "valor_alias", headerName: "Valor",          width: 250, align: "right", headerAlign: "right" },
    { field: "origen",      headerName: "Origin",         width: 250 },
  ];

  const rows = [];

export const ShowView = () => {

  const dispatch = useDispatch();      
  const { getTotalTarjetas }  = useSelector( state => state.registroTarjetasStore );
  
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotalAllThunks());
  },[])
  
  console.log("getTotalTarjetas ",getTotalTarjetas)

  let { dashboardData, total_cuenta_bancaria, total_devoluciones, 
        total_gastos_generales, total_utilidad_ocacional, total,
        nombre_cuenta, descripcion_cuenta, 
        numero_cuenta, total_recepcionDePagos, banco }    = useSelector(state => state.cuentasBancariasStore);

  const { startDate, endDate } = useSelector(state => state.globalStore);


  const data = [
      { name: "Cuenta Bancaria",    value: total_cuenta_bancaria, color: "#2196F3" }, // Azul fuerte
      { name: "Devoluciones",       value: total_devoluciones, color: "#FF9800" }, // Naranja
      { name: "Gastos Generales",   value: total_gastos_generales, color: "#E91E63" }, // Rosa oscuro
      { name: "Utilidad Ocacional", value: total_utilidad_ocacional, color: "#4CAF50" },
      { name: "Recepcion de Pagos", value: total_recepcionDePagos, color: "#4CAF50" } // Verde fuertetotal_recepcionDePagos
  ];

 
  const { id } = useParams();

  const returnTramites = async() => {
    navigate(`/registroTarjetas`);
  };

  function handleDownloadPDF() {
    const url = `${ URL }/downloadpdf/downloadpdf/${id}/?fechaInicio=${startDate}&fechaFin=${endDate}`;
    window.open(url, '_blank'); // Abre el PDF en una nueva pestaña
  }

  const handleDownloadExcel = async () => {
    dispatch(downloadExcelThunk(id,startDate, endDate));
  };

  const enhancedDashboardData = dashboardData.map(row => ({
    ...row,
    id: uuidv4() // Usa el ID existente o genera uno nuevo
  }));
  
  const handleShow = async(id) => {
    await dispatch(dashboard_obtener_datos_cuenta(id));
    navigate(`/bancos/PageShow/${id}`);
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
          {getTotalTarjetas?.map((tarjeta) => (
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
                    {tarjeta.nombre_cuenta}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {tarjeta.descripcion || "Sin descripción"}
                  </Typography>
                </Box>

                {/* Datos de la cuenta */}
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Banco:
                  </Typography>
                  <Typography variant="h6">{tarjeta.banco || "No especificado"}</Typography>
                </Box>

                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Número de cuenta:
                  </Typography>
                  <Typography variant="h6">{tarjeta.numero_cuenta}</Typography>
                </Box>

                {/* Saldo disponible */}
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Saldo disponible:
                  </Typography>
                  <Typography variant="h2" fontWeight="bold">
                    ${new Intl.NumberFormat("es-CO").format(tarjeta.valor || 0)}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
          <br /><br />
      </Grid>
      <Divider component="div" role="presentation">
        <Typography>Total de cada Tarjeta</Typography>
      </Divider>
    </Box>
  );
};
