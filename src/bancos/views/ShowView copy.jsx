import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Typography, Box, Card, Button, Paper, useTheme, useMediaQuery } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { PictureAsPdf, FileDownload } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

import { DateRange } from "../../cotizador/components/DateRange";
import { downloadExcelThunk } from "../../store/cuentasBancariasStore/cuentasBancariasThunks";
import { URL } from "../../constants.js/constantGlogal";

// --- CONFIGURACIÓN DE COLUMNAS ---
const columns = [
  { field: "fi", headerName: "Fecha Ingreso", width: 150, valueFormatter: (params) => params ? dayjs(params).format("YYYY-MM-DD") : "" },
  { field: "ft", headerName: "Fecha Trámite", width: 150, valueFormatter: (params) => params ? dayjs(params).format("YYYY-MM-DD") : "" },
  { field: "desc_alias", headerName: "Descripción", minWidth: 200, flex: 1 },
  { 
    field: "total_meno_cuatro_por_mil", 
    headerName: "Valor Neto", 
    width: 160, 
    align: "right", 
    headerAlign: "right",
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 'bold', color: params.value < 0 ? "error.main" : "success.main" }}>
        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(params.value || 0)}
      </Typography>
    )
  },
  { 
    field: "origen", 
    headerName: "Origen", 
    width: 180,
    renderCell: (params) => {
      const colors = {
        "Cuenta Bancaria": "#E3F2FD",
        "Gasto General": "#FFEBEE",
        "Devolución": "#FFF3E0",
        "Recepcion de Pago": "#E8F5E9"
      };
      return (
        <Box sx={{ 
          backgroundColor: colors[params.value] || "#F5F5F5", 
          px: 2, py: 0.5, borderRadius: 1, fontWeight: 'bold', fontSize: '0.75rem', width: '100%', textAlign: 'center' 
        }}>
          {params.value}
        </Box>
      );
    }
  }
];

export const ShowView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { dashboardData, total_cuenta_bancaria, total_devoluciones, total_gastos_generales, 
          total_utilidad_ocacional, total, nombre_cuenta, descripcion_cuenta, 
          numero_cuenta, total_recepcionDePagos, total_cargosNoDeseados, banco, total_cuatro_por_mil 
  } = useSelector(state => state.cuentasBancariasStore);

  const { startDate, endDate } = useSelector(state => state.globalStore);

  const dataCharts = [
    { name: "C. Bancaria", value: total_cuenta_bancaria, color: "#2196F3" },
    { name: "Devoluciones", value: total_devoluciones, color: "#FF9800" },
    { name: "Gastos", value: total_gastos_generales, color: "#E91E63" },
    { name: "Utilidad", value: total_utilidad_ocacional, color: "#4CAF50" },
    { name: "Pagos", value: total_recepcionDePagos, color: "#00BCD4" },
  ];

  const handleDownloadPDF = () => window.open(`${URL}/downloadpdf/downloadpdf/${id}/?fechaInicio=${startDate}&fechaFin=${endDate}`, '_blank');
  const handleDownloadExcel = () => dispatch(downloadExcelThunk(id, startDate, endDate));

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, width: "100%", boxSizing: "border-box" }}>
      
      {/* BOTÓN VOLVER */}
      <Button 
        startIcon={<KeyboardReturnIcon />} 
        onClick={() => navigate('/bancos')}
        sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold' }}
      >
        Volver a Bancos
      </Button>

      <Grid container spacing={3}>
        
        {/* FILTROS */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <DateRange cotizador="dashBoard" id={id} />
          </Paper>
        </Grid>

        {/* CARD PRINCIPAL SALDO */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 4, 
            background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)', 
            color: 'white' 
          }}>
            <Grid container alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="overline" sx={{ opacity: 0.8 }}>Cuenta Seleccionada</Typography>
                <Typography variant="h4" fontWeight="800">{nombre_cuenta}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>{banco} • {numero_cuenta}</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
                <Typography variant="overline" sx={{ opacity: 0.8 }}>Saldo Total Disponible</Typography>
                <Typography variant="h2" fontWeight="900" sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                  ${new Intl.NumberFormat("es-CO").format(total)}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* MÉTRICAS RÁPIDAS (RESPONSIVE GRID) */}
        {[
          { label: "Bancos", val: total_cuenta_bancaria, col: "#e3f2fd" },
          { label: "Devoluciones", val: total_devoluciones, col: "#fff3e0" },
          { label: "Gastos", val: total_gastos_generales, col: "#fce4ec" },
          { label: "4x1000", val: total_cuatro_por_mil, col: "#f1f8e9" }
        ].map((m, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card elevation={0} sx={{ p: 2, bgcolor: m.col, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary">{m.label}</Typography>
              <Typography variant="h5" fontWeight="bold">${new Intl.NumberFormat("es-CO").format(m.val)}</Typography>
            </Card>
          </Grid>
        ))}

        {/* GRÁFICOS */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 350 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Distribución de Fondos</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={dataCharts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {dataCharts.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 350 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Comparativa Visual</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={dataCharts} margin={{ left: 20 }}>
                <XAxis dataKey="name" fontSize={10} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dataCharts.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* TABLA DE HISTORIAL */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1, md: 3 }, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 3, gap: 2 }}>
              <Typography variant="h6" fontWeight="bold">Historial de Movimientos</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="error" startIcon={<PictureAsPdf />} onClick={handleDownloadPDF} size="small">PDF</Button>
                <Button variant="contained" color="success" startIcon={<FileDownload />} onClick={handleDownloadExcel} size="small">Excel</Button>
              </Box>
            </Box>
            
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={dashboardData.map(r => ({ ...r, id: uuidv4() }))}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F4F6F8', borderRadius: 0 },
                  '& .MuiDataGrid-cell:focus': { outline: 'none' }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};