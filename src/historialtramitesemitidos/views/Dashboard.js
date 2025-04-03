import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Datos de ingresos y egresos
const ingresosEgresosData = [
  { mes: "Enero", ingresos: 5000000, egresos: -3000000 },
  { mes: "Febrero", ingresos: 4500000, egresos: -2800000 },
  { mes: "Marzo", ingresos: 4800000, egresos: -3100000 },
  { mes: "Abril", ingresos: 5200000, egresos: -2900000 },
];

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "240px" }}>
        
        <Typography variant="h4" sx={{ my: 2 }}>
          📊 Dashboard Financiero
        </Typography>

        <Grid container spacing={3}>
          {/* Gráfico de Ingresos y Egresos */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Estadísticas de Ingresos y Egresos</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ingresosEgresosData}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => new Intl.NumberFormat("es-CO").format(value)} />
                  <Bar dataKey="ingresos" fill="#4caf50" name="Ingresos" />
                  <Bar dataKey="egresos" fill="#f44336" name="Egresos" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Widgets de Estadísticas */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 2, bgcolor: "#4caf50", color: "white" }}>
              <Typography variant="h6">Total Ingresos</Typography>
              <Typography variant="h4">$15.800.000</Typography>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: "#f44336", color: "white" }}>
              <Typography variant="h6">Total Egresos</Typography>
              <Typography variant="h4">$8.200.000</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
