import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/etiquetasStore/etiquetasThunks';
import { toast } from 'react-toastify';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

export function DataTable() {

    const dispatch = useDispatch();
    
    let { fichasCliente }    = useSelector(state => state.fichaClienteStore);
    console.log("fichasCliente ",fichasCliente)
    const columns = [
      { field: 'id',                      headerName: 'ID',                         width: 100 },
      { field: 'fi',                      headerName: 'Fecha de Transaccion',       width: 200 , 
        valueFormatter: (params) => {
          if (!params) return "";
          // Toma los primeros 16 caracteres y reemplaza la "T" por un espacio
          return params.slice(0, 16).replace("T", " ");
        }
      },
      { field: 'desc_alias',              headerName: 'Descripcion',                width: 200 },
      {
        field: 'valor_alias',
        headerName: 'Valor',
        width: 200,
        renderCell: (params) => (
          <span style={{ color: params.value < 0 ? 'red' : 'green' }}>
            {params.value}
          </span>
        ),
      },
      { field: 'desc_alias',              headerName: 'Observacion',                width: 200 },
      { field: 'Soporte',                 headerName: 'Soporte',                    width: 200 },
      { field: 'Fecha de ingreso (Auto)', headerName: 'Fecha de ingreso (Auto)',    width: 200 },
      { field: 'origen',                  headerName: 'Origen',                     width: 200 },
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

  const fichasClienteData = fichasCliente.map(row => ({
    ...row,
    id: uuidv4() // Usa el ID existente o genera uno nuevo
  }));
  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

      
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="fichacliente"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="fichacliente"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      <DataGrid
        rows={fichasClienteData}
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
      />
    </Paper>
  );
}
