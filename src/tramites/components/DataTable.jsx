import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { StatusChip } from './Chip';

import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/tramitesStore/tramitesThunks';
import { toast } from 'react-toastify';

import { useNavigate }              from 'react-router-dom';


export function DataTable() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { tramites } = useSelector(state => state.tramitesStore);
    
    const columns = [
      { field: 'id',              headerName: 'ID',                 width: 90},
      { field: 'estado',          headerName: 'Estado',             width: 130, sortable: true, renderCell: (params) => <StatusChip estado={params.value} />},
      { field: 'nombre_usuario',  headerName: 'Usuario',            width: 130 },
      { field: 'nombre_cliente',  headerName: 'Cliente',            width: 130 },
      { field: 'etiquetaUno',     headerName: 'Etiqueta Uno',       width: 170 },
      { field: 'etiquetaDos',     headerName: 'Etiqueta Dos',       width: 170 },
      { field: 'placa',           headerName: 'Placa',              width: 130 },
      { field: 'cilindraje',      headerName: 'Cilindraje',         width: 130 },
      { field: 'modelo',          headerName: 'Modelo',             width: 130 },
      { field: 'chasis',          headerName: 'Chasis',             width: 130 },
      { field: 'numeroDocumento', headerName: 'Documento',          width: 150 },
      { field: 'nombreCompleto',  headerName: 'Nombre',             width: 130 },
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

              <IconButton
                aria-label="Show"
                onClick={() => handleShow(params.row.id)}
                color="danger"
              >
                  <ReceiptLongIcon />
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
            <p>¿Estás seguro de que deseas eliminar el cliente?</p>
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

    const handleShow = async(id) => {
      navigate(`/tramites/PageShow/${id}`);
    };
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };


  return (
    <Paper sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={tramites}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
