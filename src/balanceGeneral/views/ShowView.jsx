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
      valueFormatter: (params) => {
        const value = Number(params.value);
        if (isNaN(value)) return "$0";
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
        }).format(value);
      },
      renderCell: (params) => {
        const value = Number(params.value);
        const color = value < 0 ? "red" : "green";
        const safeValue = isNaN(value) ? 0 : value;

        return (
          <span style={{ color, fontWeight: "bold", fontSize: "26px" }}>
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(safeValue)}
          </span>
        );
      }
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
        total_cuatro_por_mil,
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

      <Grid container spacing={{ xs: 1, sm: 2, md: 2 }}>

      <Grid item xs={12}>
          <Box display="flex" justifyContent={{ xs: "center", sm: "space-between" }} flexWrap="wrap">
              <DateRange cotizador="balancegeneral"/>
          </Box>
      </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                p: { xs: 1.5, sm: 2 },
                backgroundColor: "#f5b0d0ff",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
              </Box>

              <Box mt={{ xs: 1, sm: 2 }} mb={{ xs: 1, sm: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Saldos total tarjetas
                </Typography>
                <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                  ${new Intl.NumberFormat("es-CO").format(totalTarjetas)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Tarjetas disponibles:
                </Typography>

                <Box sx={{ maxHeight: { xs: 150, sm: 180, md: 200 }, overflowY: "auto" }}>
                  <List dense>
                    {tarjetas.map((tarjeta, index) => (
                      <ListItemButton
                        key={index}
                        sx={{
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <ListItemText
                            primary={tarjeta.nombre}
                            primaryTypographyProps={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="text.primary"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ${new Intl.NumberFormat("es-CO").format(tarjeta.valor)}
                        </Typography>
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Box>
            </Card>
          </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4}>
            <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: { xs: 1.5, sm: 2 },
                                backgroundColor: "#d2b0f5ff",
                              }}>
                <Box display="flex" justifyContent="space-between">
                  <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
                </Box>
                <Box mt={{ xs: 1, sm: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Total saldo clientes
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                    ${new Intl.NumberFormat("es-CO").format(totalSaldoClientes)}
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ maxHeight: { xs: 150, sm: 180, md: 200 }, overflowY: "auto" }}>
                      <List dense>
                        {clientes.map((cliente, index) => (
                          <ListItemButton
                            key={index}
                            sx={{
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: { xs: 0.5, sm: 1 },
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <ListItemText
                                primary={cliente.nombre}
                                primaryTypographyProps={{
                                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                                }}
                              />
                            </Box>

                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="text.primary"
                              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
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

        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: { xs: 1.5, sm: 2 },
                                backgroundColor: "#f3d88fff",
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
            </Box>
            <Box mt={{ xs: 1, sm: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
               Total gastos generales
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                ${new Intl.NumberFormat("es-CO").format(totalGastosGenerales)}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: { xs: 1.5, sm: 2 },
                                backgroundColor: "#a6eff1ff",
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
            </Box>
            <Box mt={{ xs: 1, sm: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Total comisiones proveedores
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                ${new Intl.NumberFormat("es-CO").format(totalComisionesProveedores)}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: { xs: 1.5, sm: 2 },
                                backgroundColor: "#f0f1abff",
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
            </Box>
            <Box mt={{ xs: 1, sm: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Recepción de pagos
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                ${new Intl.NumberFormat("es-CO").format(total_recepcion_pago)}
              </Typography>
            </Box>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: { xs: 1.5, sm: 2 },
                                backgroundColor: "#a9f3efff",
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
            </Box>
            <Box mt={{ xs: 1, sm: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Cargos no registrados
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                ${new Intl.NumberFormat("es-CO").format(total_cargo_no_deseados)}
              </Typography>
            </Box>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card elevation={0} sx={{
                                borderRadius: 2,
                                p: { xs: 1.5, sm: 2 },
                                backgroundColor: "#f5ceb7ff",
                              }}>
            <Box display="flex" justifyContent="space-between">
              <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
            </Box>
            <Box mt={{ xs: 1, sm: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                4 X MIL
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}>
                ${new Intl.NumberFormat("es-CO").format(total_cuatro_por_mil)}
              </Typography>
            </Box>
          </Card>
        </Grid>
  
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" }, mb: { xs: 1, sm: 2 } }}
              >
                📊 Resumen Financiero
              </Typography>
              <ResponsiveContainer width="100%" height={{ xs: 250, sm: 280, md: 300 }}>
                <BarChart data={data} layout="vertical" margin={{ left: { xs: 10, sm: 15, md: 20 }, right: { xs: 10, sm: 15, md: 20 } }}>
                  <XAxis
                    type="number"
                    tickFormatter={(value) => new Intl.NumberFormat("es-CO").format(value)}
                    style={{ fontSize: "0.75rem" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={{ xs: 80, sm: 100, md: 120 }}
                    style={{ fontSize: "0.75rem" }}
                  />
                  <Tooltip formatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" }, mb: { xs: 1, sm: 2 } }}
              >
                📊 Total Balance vs. Utilidades
              </Typography>
              <ResponsiveContainer width="100%" height={{ xs: 250, sm: 280, md: 300 }}>
                <BarChart data={dataBalanceUtilidad} layout="vertical" margin={{ left: { xs: 10, sm: 15, md: 20 }, right: { xs: 10, sm: 15, md: 20 } }}>
                  <XAxis
                    type="number"
                    tickFormatter={(value) => new Intl.NumberFormat("es-CO").format(value)}
                    style={{ fontSize: "0.75rem" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={{ xs: 80, sm: 100, md: 120 }}
                    style={{ fontSize: "0.75rem" }}
                  />
                  <Tooltip formatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
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
          <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            {/* Contenido comentado - DataGrid y Balance General */}
          </Paper>
        </Grid>


      </Grid>

    </Box>
  );
};
