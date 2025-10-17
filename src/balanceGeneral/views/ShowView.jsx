import React, { useState, useEffect } from "react";
import { DataGrid }      from "@mui/x-data-grid";
import { Grid, Typography, Box, Card, List, ListItemButton, ListItemIcon, ListItemText  } from "@mui/material";
import Paper from '@mui/material/Paper';

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useSelector, useDispatch }   from "react-redux";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate, useParams, Link }  from 'react-router-dom';


import { Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

//import { PictureAsPdf, FileDownload } from "@mui/icons-material";


import { DateRange } from "../../cotizador/components/DateRange";
import { downloadExcelThunk } from "../../store/cuentasBancariasStore/cuentasBancariasThunks";


import { v4 as uuidv4 } from 'uuid';

import { URL } from "../../constants.js/constantGlogal";

import { BalanceIntervalo } from "./BalanceIntervalo";

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
        let backgroundColor = "transparent";
        if (origen === "tarjetas") backgroundColor = "#E6F4EA"; 
        if (origen?.startsWith("Cliente")) backgroundColor = "#FFF4DE"; 
        if (origen === "gasto") backgroundColor = "#F8D7DA";
        if (origen === "fichaproveedor") backgroundColor = "#D1ECF1";
        if (origen === "Utilidad Ocasional") backgroundColor = "#F6F0ED"; 

        /**
          "Cuenta destino" → recibe
          "Cuenta origen" → envía 
        */
        if(origen.includes("Tarjeta Cuenta destino")){
          backgroundColor = "#d7f0baff"; // verde suave
        }
        
        if(origen.includes("Tarjeta Cuenta origen")) {
          backgroundColor = "#f8d7da"; // rojo suave
        }
    
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

export const ShowView = () => {

  let { total_recepcionDePagos }    = useSelector(state => state.cuentasBancariasStore);

  let { balanceGeneral,
        totalSaldoClientes,
        totalGastosGenerales,
        totalComisionesProveedores,
        totalTarjetas,
        total_cargo_no_deseados,
        total_recepcion_pago,
        sumaTotal, utilidades, tarjetas, clientes }    = useSelector(state => state.balancegeneralStore);
  console.log(" total_cargo_no_deseados ",total_cargo_no_deseados)
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
  },
  {
    name: "Cargos no registrados",
    value: total_cargo_no_deseados,
    color: "#a9f3efff",
  }
];

const dataBalanceUtilidad = [
  {
    name: "Balance General",
    value: sumaTotal,
    color: "#0088FE"
  },
  {
    name: "Utilidades ",
    value: utilidades,
    color: "#00C49F"
  },
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

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: "#f5b0d0ff",
                height: "100%",
                display: "flex",
                flexDirection: "column",  
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
              </Box>

              <Box mt={2} mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Saldos total tarjetas
                </Typography>
                <Typography variant="h3">
                  ${new Intl.NumberFormat("es-CO").format(totalTarjetas)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tarjetas disponibles:
                </Typography>

                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                  <List dense>
                    {tarjetas.map((tarjeta, index) => (
                      <ListItemButton
                        key={index}
                        sx={{
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <ListItemText primary={tarjeta.nombre} />
                        </Box>

                        <Typography variant="body2" fontWeight="bold" color="text.primary">
                          ${new Intl.NumberFormat("es-CO").format(tarjeta.valor)}
                        </Typography>
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Box>
            </Card>
          </Grid>
        
        <Grid item xs={4}>
            <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#d2b0f5ff", // 🎨 Fondo suave
                              }}>
                <Box display="flex" justifyContent="space-between">
                  <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total saldo clientes
                  </Typography>
                  <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(totalSaldoClientes)}</Typography>
                </Box>

                <Box>
                  <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                      <List dense>
                        {clientes.map((cliente, index) => (
                          <ListItemButton
                            key={index}
                            sx={{
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <ListItemText primary={cliente.nombre} />
                            </Box>

                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="text.primary"
                            >
                              ${new Intl.NumberFormat("es-CO").format(cliente.valor)}
                            </Typography>
                          </ListItemButton>
                        ))}
                      </List>
                  </Box>
                </Box>

          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#f3d88fff", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
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
                                backgroundColor: "#a6eff1ff", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
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
                                backgroundColor: "#f0f1abff", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Recepción de pagos
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_recepcion_pago)}</Typography>
            </Box>
          </Card>
        </Grid>


        <Grid item xs={4}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "#a9f3efff", // 🎨 Fondo suave
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Cargos no registrados
              </Typography>
              <Typography variant="h3">${new Intl.NumberFormat("es-CO").format(total_cargo_no_deseados)}</Typography>
            </Box>
          </Card>
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

        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
              <Typography variant="h6" align="center">
                📊 Total Balance vs. Utilidades
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataBalanceUtilidad} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <Legend />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {dataBalanceUtilidad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <BalanceIntervalo />

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            {/*<Typography variant="h5" align="center" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
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
            </Paper>*/}

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
