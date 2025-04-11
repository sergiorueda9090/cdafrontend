import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/etiquetasStore/etiquetasThunks';
import { toast } from 'react-toastify';
import { Chip } from "@mui/material";
export function DataTable() {
  
    const dispatch = useDispatch();
    
    let { firchaproveedores }    = useSelector(state => state.fichaProveedoresStore);

    const columns = [
      { field: 'id',                  headerName: 'ID',                     width: 100 },
      { field: 'nombre',              headerName: 'Nombre Proveedor',       width: 230 },
      { field: 'comisionproveedor',   headerName: 'Comision Proveedor',     width: 230 },
      { field: 'etiquetaDos',         headerName: 'Nombre Etiqueta',        width: 230 },
      { field: 'placa',               headerName: 'Placa',                  width: 230 },
      { field: 'cilindraje',          headerName: 'Cilindraje',             width: 230 },
      { field: 'modelo',              headerName: 'Modelo',                 width: 230 },
      { field: 'chasis',              headerName: 'Chasis',                 width: 230 },
      { field: 'precioDeLey',         headerName: 'Precio De Ley',          width: 230 },
      { field: 'comisionPrecioLey',   headerName: 'Comision Precio Ley',    width: 230 },
      { field: 'total',               headerName: 'Total',                  width: 230 },
      { field: 'archivo',             headerName: 'Archivo',                width: 230 },
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
      <DataGrid
        rows={firchaproveedores}
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
