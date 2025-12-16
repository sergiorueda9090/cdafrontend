import React from "react";
import { Box, Grid, Paper, Typography, useMediaQuery, useTheme, Card, CardContent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// Datos de ingresos y egresos
const ingresosEgresosData = [
  { mes: "Enero", ingresos: 5000000, egresos: -3000000 },
  { mes: "Febrero", ingresos: 4500000, egresos: -2800000 },
  { mes: "Marzo", ingresos: 4800000, egresos: -3100000 },
  { mes: "Abril", ingresos: 5200000, egresos: -2900000 },
];

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: "100vh"
    }}>
      <Box component="main" sx={{
        flexGrow: 1,
        p: isMobile ? 2 : 3,
        ml: isMobile ? 0 : isTablet ? 0 : "0px"
      }}>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            my: 2,
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Dashboard Financiero
        </Typography>

        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Widgets de Estadísticas - En móvil aparecen primero */}
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
            <Card
              elevation={4}
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: "white",
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 'bold' }}>
                      Total Ingresos
                    </Typography>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 1, fontWeight: 'bold' }}>
                      $15.800.000
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: isMobile ? 40 : 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>

            <Card
              elevation={4}
              sx={{
                background: 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
                color: "white",
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 'bold' }}>
                      Total Egresos
                    </Typography>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 1, fontWeight: 'bold' }}>
                      $8.200.000
                    </Typography>
                  </Box>
                  <TrendingDownIcon sx={{ fontSize: isMobile ? 40 : 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>

            {/* Balance neto (nuevo widget) */}
            <Card
              elevation={4}
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: "white",
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8
                }
              }}
            >
              <CardContent>
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 'bold' }}>
                  Balance Neto
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 1, fontWeight: 'bold' }}>
                  $7.600.000
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Ingresos y Egresos */}
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            <Paper
              elevation={4}
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
              >
                Estadísticas de Ingresos y Egresos
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : isTablet ? 300 : 400}>
                <BarChart
                  data={ingresosEgresosData}
                  margin={{
                    top: 10,
                    right: isMobile ? 10 : 30,
                    left: isMobile ? 0 : 20,
                    bottom: 10
                  }}
                >
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                  />
                  <YAxis
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickFormatter={(value) => {
                      if (isMobile) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      }
                      return new Intl.NumberFormat("es-CO", {
                        notation: "compact",
                        compactDisplay: "short"
                      }).format(value);
                    }}
                  />
                  <Tooltip
                    formatter={(value) => new Intl.NumberFormat("es-CO").format(value)}
                    contentStyle={{
                      fontSize: isMobile ? '12px' : '14px',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                  />
                  <Bar dataKey="ingresos" fill="#4caf50" name="Ingresos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="egresos" fill="#f44336" name="Egresos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
