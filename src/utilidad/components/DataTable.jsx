import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Chip, Typography } from "@mui/material";
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';

export function DataTable() {
  
    const dispatch = useDispatch();
    
    let { firchaproveedor, id:idProveedor }    = useSelector(state => state.fichaProveedoresStore);
    let { utilidades, total }                         = useSelector(state => state.utilidadStore);

    const columns = [
      { field: 'id',                  headerName: 'ID',                     width: 100 },
      { field: 'nombre',              headerName: 'Nombre Proveedor',       width: 230 },
      {
        field: 'comisionproveedor',
        headerName: 'Comisión Proveedor',
        width: 230,
        renderCell: (params) => {
          if (params.value == null) return '';
          return (
            <span style={{ color: 'green', fontSize: '27px', fontWeight: 'bold' }}>
              {new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
              }).format(params.value)}
            </span>
          );
        },
      },
      { field: 'etiquetaDos',              headerName: 'Nombre Proveedor',       width: 230 },
      { field: 'placa',              headerName: 'Nombre Proveedor',       width: 230 },
      { field: 'cilindraje',              headerName: 'Nombre Proveedor',       width: 230 },
      { field: 'modelo',              headerName: 'Nombre Proveedor',       width: 230 },
      { field: 'chasis',              headerName: 'Nombre Proveedor',       width: 230 },

    ];
    
    
  const paginationModel = { page: 0, pageSize: 15 };


  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

      {/* Contenedor de filtros */}
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <FilterData cotizador="utilidad"/>  {/* Componente de filtros adicionales */}
        <DateRange  cotizador="utilidad"/>  {/* Componente para selección de rango de fechas */}
      </Box>
      
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
              Total Utilidad
            </Typography>
            <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
              {total == 0 ? 0 : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(total)}
            </Typography>
        </Paper>

      <DataGrid
        rows={ utilidades }
        columns={ columns }
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        //checkboxSelection
        sx={{
          border: 0,
          "& .even-row": { backgroundColor: "#f5f5f5" }, // Gris claro
          "& .odd-row": { backgroundColor: "#ffffff" }, // Blanco
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
      />
    </Paper>
  );
}
