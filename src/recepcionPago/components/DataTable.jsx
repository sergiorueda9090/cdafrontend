import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/recepcionPagoStore/recepcionPagoStoreThunks';
import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { Box } from '@mui/material';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';

import { getAllThunksTramites }         from '../../store/clientesStore/clientesThunks';
import { getAllThunks as listTarjetas } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';

export function DataTable() {

    const dispatch = useDispatch();
    
    let { recepcionPagos }    = useSelector(state => state.recepcionPagoStore);

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
      { field: 'id',                      headerName: 'ID',                     width: 100 },
      { field: 'nombre_tarjeta',          headerName: 'Tarjeta',                width: 200 },
      { field: 'fecha_ingreso',           headerName: 'Fecha de Ingreso',       width: 200 },
      { field: 'fecha_transaccion',       headerName: 'Fecha de Transacción',   width: 200 },
      {
        field: 'valor',
        headerName: 'Valor',
        width: 130,
      },
      { field: 'observacion',             headerName: 'observacion',            width: 160 },
      { field: 'nombre_cliente',          headerName: 'Cliente',                width: 160 },
       {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
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
            <p>¿Estás seguro de que deseas eliminar este registro?</p>
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
    await dispatch(getAllThunksTramites());
    await dispatch(listTarjetas());
  };


  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="registroTarjetas"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="registroTarjetas"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      <DataGrid
        rows={recepcionPagos}
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
