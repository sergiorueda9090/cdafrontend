import React, { useState, useEffect } from "react";
import { DataGrid }      from "@mui/x-data-grid";
import { Grid, Typography, Box, Card, Button }      from "@mui/material";
import Paper from '@mui/material/Paper';


import { useSelector, useDispatch }   from "react-redux";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate, useParams }              from 'react-router-dom';


import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

import { PictureAsPdf, FileDownload } from "@mui/icons-material";


import { DateRange } from "../../cotizador/components/DateRange";
import { downloadExcelThunk } from "../../store/cuentasBancariasStore/cuentasBancariasThunks";

import dayjs from "dayjs";

  // Definir las columnas para el DataGrid
  const columns = [
    { field: "id",          headerName: "ID",             width: 90 },
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
    { field: "valor_alias", headerName: "Valor", width: 250, align: "right", headerAlign: "right" },
    { field: "origen",      headerName: "Origin",         width: 250 },
  ];

  const rows = [];

export const ShowView = () => {

  let { dashboardData, total_cuenta_bancaria, total_devoluciones, 
        total_gastos_generales, total_utilidad_ocacional, total,
        nombre_cuenta, descripcion_cuenta, 
        numero_cuenta, total_recepcionDePagos, banco }    = useSelector(state => state.cuentasBancariasStore);


  const data = [
    { name: "Cuenta Bancaria",    value: total_cuenta_bancaria, color: "#2196F3" }, // Azul fuerte
    { name: "Devoluciones",       value: total_devoluciones, color: "#FF9800" }, // Naranja
    { name: "Gastos Generales",   value: total_gastos_generales, color: "#E91E63" }, // Rosa oscuro
    { name: "Utilidad Ocacional", value: total_utilidad_ocacional, color: "#4CAF50" },
    { name: "Recepcion de Pagos", value: total_recepcionDePagos, color: "#4CAF50" } // Verde fuertetotal_recepcionDePagos
];

  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  const returnTramites = async() => {
    navigate(`/bancos`);
  };


  const handleDownloadPDF = () => {
    console.log("Descargando PDF...");
    // Implementar lógica para exportar PDF
  };


  const handleDownloadExcel = async () => {
    console.log("id ",id)
    dispatch(downloadExcelThunk(id));
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

      <Grid container spacing={2}>

      <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
              <DateRange cotizador="dashBoard" id={id}/>  {/* Componente para selección de rango de fechas */}
          </Box>
      </Grid>

      <Grid item xs={12}>
      <Card
        elevation={1}
        sx={{
          borderRadius: 3,
          p: 3,
          backgroundColor: "#F4F6F8", // 🎨 Fondo suave
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Información principal */}
        <Box mt={2}>
          <Typography variant="h6" fontWeight="bold">
            {nombre_cuenta}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {descripcion_cuenta}
          </Typography>
        </Box>

        {/* Datos de la cuenta */}
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Banco:
          </Typography>
          <Typography variant="h6">{banco}</Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body2" color="text.secondary">
            Número de cuenta:
          </Typography>
          <Typography variant="h6">{numero_cuenta}</Typography>
        </Box>

        {/* Saldo disponible */}
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Saldo disponible:
          </Typography>
          <Typography variant="h2" fontWeight="bold">
            ${new Intl.NumberFormat("es-CO").format(total)}
          </Typography>
        </Box>
      </Card>
    </Grid>


        <Grid item xs={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: "#F4F6F8", // 🎨 Fondo suave
              }}>
              <Box display="flex" justifyContent="space-between">
                <img src="/assets/icons/glass/ic-glass-bag.svg" alt="icon" width={40} />
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Saldo en Cuenta Bancaria
                </Typography>
                <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_cuenta_bancaria)}</Typography>
              </Box>
            </Card>
        </Grid>

        <Grid item xs={2}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#F4F6F8", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <img src="/assets/icons/glass/ic-glass-bag.svg" alt="icon" width={40} />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Devoluciones
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_devoluciones)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={2}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#F4F6F8", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <img src="/assets/icons/glass/ic-glass-bag.svg" alt="icon" width={40} />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
               Gastos Generales
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_gastos_generales)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={2}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#F4F6F8", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <img src="/assets/icons/glass/ic-glass-bag.svg" alt="icon" width={40} />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Utilidad Ocacional
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_utilidad_ocacional)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#F4F6F8", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <img src="/assets/icons/glass/ic-glass-bag.svg" alt="icon" width={40} />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Recepcion de pago
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_recepcionDePagos)}</Typography>
            </Box>
          </Card>
        </Grid>
    

        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" align="center">
              📊 Distribución de Ingresos y Egresos
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

        </Grid>

        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
              <Typography variant="h6" align="center">
                📊 Resumen Financiero
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <Legend />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </Paper>
        </Grid>


          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" align="center">
                  Historial Bancario
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button
          variant="contained"
          color="error"
          startIcon={<PictureAsPdf />}
          onClick={handleDownloadPDF}
        >
          Descargar PDF
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#2E7D32", color: "white" }}
          startIcon={<FileDownload />}
          onClick={handleDownloadExcel}
        >
          Descargar Excel
        </Button>
      </Box>

              <DataGrid
                rows={dashboardData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                autoHeight
                sx={{
                  "& .MuiDataGrid-cell": {
                    fontSize: "14px",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#eeeeee",
                  }
                }}
              />
            </Paper>
          </Grid>
      </Grid>

    </Box>
  );
};
