import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {Typography, Button} from  '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { Box, Chip } from "@mui/material";
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import { openModalShared } from '../../store/globalStore/globalStore';
import { getAllThunks as getAllRegistroTarjetasThunks } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';
import { getAllThunks as getAllRegistroProveedoresThunks } from '../../store/proveedoresStore/proveedoresThunks';
import { handleFormStore } from '../../store/proveedoresStore/proveedoresStore';
import { deleteCuentaBancariaThunks } from '../../store/fichaProveedoresStore/fichaProveedoresThunks';
import { useParams } from "react-router-dom";

export function DataTable() {
  
    const dispatch = useDispatch();
    const { id:proveedorId } = useParams();
    let { firchaproveedor, id, idProveedor, totalGeneralConComision }    = useSelector(state => state.fichaProveedoresStore);
    console.log(" proveedorId ",proveedorId);

    const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'nombre', headerName: 'Nombre Proveedor', width: 230 },
      {
        field: 'fechaCreacion',
        headerName: 'Fecha Creación',
        width: 230,
        renderCell: (params) => {
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
      {
        field: 'comisionproveedor',
        headerName: 'Comisión Proveedor',
        width: 230,
        renderCell: (params) => {
          if (params.value == null) return '';
          return (
            <span style={{ color: 'red', fontSize: '27px', fontWeight: 'bold' }}>
              {new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
              }).format(params.value)}
            </span>
          );
        },
      },

      { field: 'etiquetaDos', headerName: 'Etiqueta Dos', width: 230 },
      { field: 'placa', headerName: 'Placa', width: 150 },
      { field: 'cilindraje', headerName: 'Cilindraje', width: 150 },
      { field: 'modelo', headerName: 'Modelo', width: 150 },
      { field: 'chasis', headerName: 'Chasis', width: 200 },
      { field: 'precioDeLey', headerName: 'Precio de Ley', width: 180 },
      {
        field: 'total',
        headerName: 'Total',
        width: 180,
        renderCell: (params) => {
          if (params.value == null) return '';
          const valorNegativo = -Math.abs(params.value); // Asegura que siempre sea negativo
          return (
            <span style={{ fontWeight: 'bold', color: 'red', fontSize: '27px' }}>
              {new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
              }).format(valorNegativo)}
            </span>
          );
        },
      },
      {
        field: 'totalConComision',
        headerName: 'Total Con Comision',
        width: 180,
        renderCell: (params) => {
          if (params.value == null) return '';
          const valorNegativo = -Math.abs(params.value); // Asegura que siempre sea negativo
          return (
            <span style={{ fontWeight: 'bold', color: 'red', fontSize: '27px' }}>
              {new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
              }).format(valorNegativo)}
            </span>
          );
        },
      },
      {
        field: 'totalConComisionPagos',
        headerName: 'Total Pagos',
        width: 180,
        renderCell: (params) => {
          if (params.value == null) return '';
          const valorNegativo = Math.abs(params.value); // Asegura que siempre sea negativo
          return (
            <span style={{ fontWeight: 'bold', color: 'green', fontSize: '27px' }}>
              {new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
              }).format(valorNegativo)}
            </span>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 250,
        sortable: false,
        renderCell: (params) => {
          return (
            <>
              <Tooltip title="Eliminar registro">
                <IconButton
                  aria-label="eliminar registro"
                  onClick={() => handleDelete(params.row.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          );
        },
      },
    ];
    
    
  const paginationModel = { page: 0, pageSize: 15 };

  const handleOpenModal = async (idproveedor, id) => {
    console.log(" === idproveedor === ",idproveedor)
    await dispatch(handleFormStore({name: 'idProveedor', value: idproveedor}));
    //await dispatch(handleFormStore({name: 'id'         , value: id}));
    await dispatch(getAllRegistroProveedoresThunks());
    await dispatch(getAllRegistroTarjetasThunks());
    await dispatch(openModalShared())
  }

  const handleDelete = (idCuenta) => {
    toast.info(
      <div>
        <p>🗑️ ¿Estás seguro de eliminar este registro?</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            onClick={() => {
              dispatch(deleteCuentaBancariaThunks(idCuenta));
              toast.dismiss();
            }}
          >
            Sí, eliminar
          </button>
          <button
            style={{
              backgroundColor: "gray",
              color: "white",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

      {/* Contenedor de filtros */}
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <FilterData cotizador="fichaproveedor" id={proveedorId}/>  {/* Componente de filtros adicionales */}
        <DateRange  cotizador="fichaproveedor" id={proveedorId}/>  {/* Componente para selección de rango de fechas */}
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
            Total General con Comisión
          </Typography>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 'bold',
                color: totalGeneralConComision < 0 ? 'red' : 'primary.main',
              }}
            >
              {new Intl.NumberFormat("es-CO", {
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalGeneralConComision)}
            </Typography>

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => handleOpenModal(proveedorId)}
            >
              Hacer pago a proveedor
            </Button>
        </Paper>

      <DataGrid
        rows={ firchaproveedor }
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
