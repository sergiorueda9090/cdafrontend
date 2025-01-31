import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/usersStore/usersThunks';
import { toast } from 'react-toastify';
import { URL } from '../../constants.js/constantGlogal';

export function DataTable() {

    const dispatch = useDispatch();
    
    let { users } = useSelector(state => state.usersStore);

    const columns = [
      { field: 'id',        headerName: 'ID', width: 60 },
      {
        field: "image",
        headerName: "Image",
        width: 80,
        sortable: false,
        renderCell: (params) => {
          const imageUrl = URL+params.row.image; // Asegúrate de que tu API devuelve `image`
          console.log("imageUrl ",imageUrl)
          const fullName = `${params.row.first_name || ""} ${params.row.last_name || ""}`.trim();
          return (
            <Avatar
              alt={fullName || "User Avatar"}
              src={imageUrl || ""}
              sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "#2196f3" }}
            >
              {!imageUrl && fullName ? fullName[0] : ""}
            </Avatar>
          );
        },
      },
      { field: 'email',     headerName: 'Email', width: 200 },
      { field: 'username',  headerName: 'UserName', width: 180 },
      { field: 'first_name', headerName: 'First name', width: 180 },
      { field: 'last_name',  headerName: 'Last name', width: 180 },
      { field: 'last_name',  headerName: 'Last name', width: 180 },
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
            <p>¿Estás seguro de que deseas eliminar el usuario?</p>
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
    <Paper sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={users}
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
