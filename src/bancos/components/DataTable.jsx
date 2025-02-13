import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/cuentasBancariasStore/cuentasBancariasThunks';
import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { Box, Tooltip } from '@mui/material';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
export function DataTable() {

    const dispatch = useDispatch();
    
    let { cuentasBancarias }    = useSelector(state => state.cuentasBancariasStore);
    
    console.log("cuentasBancarias ",cuentasBancarias);

    const NoRowsOverlay = () => (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%", 
        marginTop:"10px",
        marginBottom:"10px"
      }}>
        <img 
          src={emptyDataTable} 
          alt="No hay datos disponibles" 
          style={{ width: "150px", opacity: 0.7 }} 
        />
        <p style={{ fontSize: "16px", color: "#666" }}>No hay datos disponibles</p>
      </div>
    );

    const columns = [
      { field: 'id',                    headerName: 'ID',                    width: 100 },
      {
        field: 'fechaIngreso',
        headerName: 'Fecha de Ingreso',
        width: 130,
        valueFormatter: (params) => {
          if (!params) return '';
          const date = new Date(params);
          return date.toLocaleString('es-CO', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
          }).replace(',', ''); // Ajustar formato y quitar la coma
        }
      },
      { field: 'fechaTransaccion',      headerName: 'Fecha de Transacción',  width: 130 },
      { field: 'descripcion',           headerName: 'Descripción',           width: 230 },
      {
        field: 'valor',
        headerName: 'Valor',
        width: 130,
        valueFormatter: (params) => {
          if (params.value == null) return ''; // Manejo de valores nulos
          return new Intl.NumberFormat('es-CO', { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
          }).format(params.value);
        },
        renderCell: (params) => {
          const valor = params.value || 0;
          const color = valor < 0 ? 'red' : 'green';
    
          return (
            <span style={{ color, fontWeight: 'bold' }}>
              {new Intl.NumberFormat('es-CO', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
              }).format(valor)}
            </span>
          );
        }
      },
      { field: 'cilindraje',            headerName: 'Cilindraje',            width: 130 },
      { field: 'placa',                 headerName: 'Placa',            width: 130 },
      { field: 'nombreTitular',         headerName: 'Nombre del Titular',    width: 230 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Ver Registro">
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(params.row)}
                  color="primary"
                >
                  <VisibilityIcon />
                </IconButton>
            </Tooltip>
          </>
        ),
      },
    ];
    
    
    
    // Función para manejar la eliminación
    const handleDelete = (id) => {
      // Mostrar la notificación con opciones de confirmación
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas eliminar la etiqueta?</p>
            <button
              onClick={() => {
                confirmDelete(id, closeToast); // Confirmar eliminación
              }}
              style={{
                marginRight: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Sí, eliminar
            </button>
            <button
              onClick={closeToast} // Cancelar eliminación
              style={{
                backgroundColor: 'gray',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        ),
        { autoClose: false } // Evitar cierre automático
      );
    };

    // Lógica para confirmar la eliminación
    const confirmDelete = async (id, closeToast) => {
      await dispatch(deleteThunk(id));
      closeToast(); // Cerrar la notificación
    };
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };


  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="cuentasbancarias"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="cuentasbancarias"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      <DataGrid
        rows={cuentasBancarias}
        columns={columns}
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
        slots={{
          noRowsOverlay: NoRowsOverlay, // Personaliza el estado sin datos
        }}
      />
    </Paper>
  );
}
