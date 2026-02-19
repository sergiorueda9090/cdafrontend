import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Chip, Typography } from "@mui/material";
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import { getAllThunks } from '../../store/utilidadStore/utilidadStoreThunks';

export function DataTable() {

    const dispatch = useDispatch();

    let { firchaproveedor, id:idProveedor }                             = useSelector(state => state.fichaProveedoresStore);
    let { utilidades, total, count, page, pageSize, search, fechaInicio, fechaFin } = useSelector(state => state.utilidadStore);

    const handlePaginationChange = (newModel) => {
        // MUI DataGrid usa página base-0; el backend usa base-1
        dispatch(getAllThunks('', fechaInicio, fechaFin, search, newModel.page + 1, newModel.pageSize));
    };

    const columns = [
      { field: 'id',              headerName: 'ID',                    width: 100 },
      { field: 'fecha',           headerName: 'Fecha',        width: 230,         renderCell: (params) => {
        if (!params.value) return '';
          const fecha = new Date(params.value);
          const año = fecha.getFullYear();
          const mes = String(fecha.getMonth() + 1).padStart(2, '0');
          const dia = String(fecha.getDate()).padStart(2, '0');
          const horas = String(fecha.getHours()).padStart(2, '0');
          const minutos = String(fecha.getMinutes()).padStart(2, '0');
          const segundos = String(fecha.getSeconds()).padStart(2, '0');
          return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        } 
      },
      { field: 'nombre',          headerName: 'Nombre Proveedor',      width: 230 },
      {
        field: 'comisionproveedor',
        headerName: 'Comisión Proveedor',
        width: 230,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => {
          if (params.value == null) return '';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%', justifyContent: 'flex-end' }}>
              <span style={{ color: 'green', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {new Intl.NumberFormat('es-CO', {
                  minimumFractionDigits: 0,
                }).format(params.value)}
              </span>
            </Box>
          );
        },
      },
      { field: 'etiquetaDos', headerName: 'Etiqueta',            width: 230 },
      { field: 'placa',       headerName: 'Placa',               width: 230 },
      { field: 'cilindraje',  headerName: 'Cilindraje',          width: 230 },
      { field: 'modelo',      headerName: 'Modelo',              width: 230 },
      { field: 'chasis',      headerName: 'N° de Chasis',        width: 230 },
    ];
    
    
  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Contenedor de filtros */}
      <Box
        display="flex"
        justifyContent={{ xs: "center", sm: "space-between" }}
        marginBottom={{ xs: 1.5, sm: 2 }}
        flexWrap="wrap"
        gap={1}
      >
        <FilterData cotizador="utilidad"/>
        <DateRange  cotizador="utilidad"/>
      </Box>

        <Paper
            elevation={3}
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              maxWidth: 600,
              mx: 'auto',
              backgroundColor: '#e3f2fd',
              borderRadius: 2,
              boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Total Utilidad
            </Typography>
            <Typography
              variant="h4"
              align="center"
              color="primary"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" }
              }}
            >
              {total == 0 ? 0 : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(total)}
            </Typography>
        </Paper>

      <DataGrid
        rows={ utilidades ?? [] }
        columns={ columns }
        paginationMode="server"
        rowCount={ count }
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={ handlePaginationChange }
        pageSizeOptions={[50, 100, 200]}
        rowHeight={60}
        //checkboxSelection
        sx={{
          border: 0,
          "& .even-row": { backgroundColor: "#f5f5f5" },
          "& .odd-row": { backgroundColor: "#ffffff" },
          "& .MuiDataGrid-cell": {
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
            padding: { xs: "4px", sm: "8px", md: "16px" },
            display: 'flex',
            alignItems: 'center'
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" }
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold"
          },
          "& .MuiDataGrid-row": {
            minHeight: "60px !important",
            maxHeight: "60px !important"
          }
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
      />
    </Box>
  );
}
