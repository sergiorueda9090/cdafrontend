import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/proveedoresStore/proveedoresThunks';
import { toast } from 'react-toastify';
import { Chip, Box } from "@mui/material";

export function DataTable() {

    const dispatch = useDispatch();
    
    let { proveedores }    = useSelector(state => state.proveedoresStore);
    console.log(proveedores);
    const columns = [
      { field: 'id',              headerName: 'ID',         width: 100 },
      { field: 'nombre',          headerName: 'Nombres',    width: 530 },
      { field: 'etiqueta_nombre', headerName: 'Etiqueta',   width: 530 },
      {
        field: "color",
        headerName: "Color",
        width: 90,
        renderCell: (params) => {
          const colorFondo = params.value || "#ddd"; // Usa color_cliente o un color por defecto
          return (
            <Chip
              style={{
                backgroundColor: colorFondo,
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
                width: "100%",
              }}
              />
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => {
          const etiqueta = (params.row.etiqueta_nombre || "").toLowerCase();
          if (etiqueta === "seguros generales") {
            return (
              <span style={{ textTransform: "lowercase", color: "#888" }}>
                {etiqueta}
              </span>
            );
          }
          return (
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
          );
        },
      },
    ];
    
    
    
    // Función para manejar la eliminación
    const handleDelete = (id) => {
      // Mostrar la notificación con opciones de confirmación
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas eliminar el proveedor?</p>
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
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        rows={proveedores}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 100, page: 0 } },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        sx={{
          border: 0,
          "& .even-row": { backgroundColor: "#f5f5f5" }, // Gris claro
          "& .odd-row": { backgroundColor: "#ffffff" },  // Blanco
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
      />
    </Box>
  );
}
