import React, { useState, useEffect } from "react";
import { DataGrid }      from "@mui/x-data-grid";
import { Grid, Typography, Box, Card }      from "@mui/material";
import Paper from '@mui/material/Paper';


import { useSelector, useDispatch }   from "react-redux";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate, useParams }  from 'react-router-dom';


import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

//import { PictureAsPdf, FileDownload } from "@mui/icons-material";


import { DateRange } from "../../cotizador/components/DateRange";
import { downloadExcelThunk } from "../../store/cuentasBancariasStore/cuentasBancariasThunks";

import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

import { URL } from "../../constants.js/constantGlogal";
  // Definir las columnas para el DataGrid
const columns = [
    { field: "id",          headerName: "ID",             width: 150, hide: true },
    {
      field: "nombre_cuenta",
      headerName: "Nombre",
      width: 350,
    },
    {
      field: "valor",
      headerName: "Saldo Actual",
      width: 350,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => new Intl.NumberFormat('es-CO').format(params.value),
      renderCell: (params) => (
        <span style={{ color: params.value < 0 ? "red" : "green", fontWeight: "bold", fontSize:"26px" }}>
          {new Intl.NumberFormat('es-CO').format(params.value)}
        </span>
      )
    },
    {
      field: "origen",
      headerName: "Origen",
      width: 350,
      renderCell: (params) => {
        // Obtener el valor de origen
        const origen = params.value;
    
        // Definir colores según el origen
        let backgroundColor = "transparent"; // Color por defecto
        if (origen === "tarjetas") backgroundColor = "#E6F4EA"; // Verde claro
        if (origen === "Clientes") backgroundColor = "#FFF4DE"; // Amarillo claro
        if (origen === "gasto") backgroundColor = "#F8D7DA";
        if (origen === "fichaproveedor") backgroundColor = "#D1ECF1";
        if (origen === "Utilidad Ocasional") backgroundColor = "#F6F0ED"; // Rojo claro
    
        return (
          <span style={{ 
            backgroundColor, 
            padding: "5px 10px", 
            borderRadius: "5px", 
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {origen}
          </span>
        );
      }
    }
  ];

  const rows = [];

export const ShowView = () => {

  let { dashboardData, total_cuenta_bancaria, total_devoluciones, 
        total_gastos_generales, total_utilidad_ocacional, total,
        nombre_cuenta, descripcion_cuenta, 
        numero_cuenta, total_recepcionDePagos, banco }    = useSelector(state => state.cuentasBancariasStore);

  let { balanceGeneral,
        totalSaldoClientes,
        totalGastosGenerales,
        totalComisionesProveedores,
        totalTarjetas,
        sumaTotal }    = useSelector(state => state.balancegeneralStore);
  console.log("balanceGeneral ", balanceGeneral)
  console.log("totalTarjetas ",totalTarjetas)
  const { startDate, endDate } = useSelector(state => state.globalStore);


const data = [
  {
    name: "Saldo Clientes",
    value: totalSaldoClientes,
    color: "#0088FE"
  },
  {
    name: "Gastos Generales",
    value: totalGastosGenerales,
    color: "#00C49F"
  },
  {
    name: "Comisiones Proveedores",
    value: totalComisionesProveedores,
    color: "#FFBB28"
  },
  {
    name: "Total Tarjetas",
    value: totalTarjetas,
    color: "#FF8042"
  }
];

  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  const returnTramites = async() => {
    navigate(`/bancos`);
  };



  function handleDownloadPDF() {
    const url = `${ URL }/downloadpdf/downloadpdf/${id}/?fechaInicio=${startDate}&fechaFin=${endDate}`;
    window.open(url, '_blank'); // Abre el PDF en una nueva pestaña
  }

  const handleDownloadExcel = async () => {
    dispatch(downloadExcelThunk(id,startDate, endDate));
  };

  const enhancedDashboardData = balanceGeneral.map(row => ({
    ...row,
    id: uuidv4() // Usa el ID existente o genera uno nuevo
  }));
  

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
              <DateRange cotizador="balancegeneral"/>  {/* Componente para selección de rango de fechas */}
          </Box>
      </Grid>

        <Grid item xs={4}>
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
                  Saldos total tarjetas
                </Typography>
                <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(totalTarjetas)}</Typography>
              </Box>
            </Card>
        </Grid>

        <Grid item xs={4}>
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
                Total saldo clientes
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(totalSaldoClientes)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={4}>
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
               Total gastos generales
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(totalGastosGenerales)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={4}>
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
                Total comisiones proveedores
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(totalComisionesProveedores)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={4}>
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
                Recepción de pagos
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_recepcionDePagos)}</Typography>
            </Box>
          </Card>
        </Grid>
  
        <Grid item xs={12}>
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
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" align="center" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Balance General
              </Typography>

              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  maxWidth: 600, 
                  mx: 'auto', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: 2, 
                  boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                }}
              >
                <Typography variant="subtitle1" align="center" color="textSecondary">
                  Total Balance
                </Typography>
                <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(sumaTotal)}
                </Typography>
              </Paper>

              <DataGrid
                rows={enhancedDashboardData}
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
                  },
                  borderRadius: 2,
                  boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                }}
              />
            </Paper>
          </Grid>
      </Grid>

    </Box>
  );
};
