import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, updateThunks }   from '../../store/cotizadorStore/cotizadorThunks';

import { toast } from 'react-toastify';

import { useNavigate }              from 'react-router-dom';
import { URL } from '../../constants.js/constantGlogal';

export function DataTable() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { cotizadores } = useSelector(state => state.cotizadorStore);
    
    const handleCopyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert("Link copiado al portapapeles");
      });
    };

    const columns = [
      { field: 'id',              headerName: 'ID',                 width: 80},
      {
        field: "image_usuario",
        headerName: "Usuario",
        width: 100,
        sortable: false,
        renderCell: (params) => {
          const imageUrl = URL + params.row.image_usuario; // URL completa de la imagen
          const fullName = params.row.nombre_usuario || "Usuario";
      
          return (
            <Tooltip title={fullName} arrow>
              <Avatar
                alt={fullName}
                src={imageUrl || ""}
                sx={{ width: 40, height: 40, fontSize: 16, bgcolor: "#2196f3", cursor: "pointer" }}
              >
                {!imageUrl ? fullName[0] : ""}
              </Avatar>
            </Tooltip>
          );
        },
      },
      { field: 'etiquetaDos',     headerName: 'Etiqueta',           width: 150 },
      {
        field: "linkPago",
        headerName: "link",
        width: 80,
        renderCell: (params) => (
          <>
            {params.value && (
              <Tooltip title="Copiar link de pago">
                <IconButton
                  aria-label="Copiar link de pago"
                  onClick={() => handleCopyToClipboard(params.value)}
                  color="success"
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        ),
      },
      { field: 'placa',           headerName: 'Placa',              width: 130 },
      { field: 'cilindraje',      headerName: 'Cilindraje',         width: 130 },
      { field: 'modelo',          headerName: 'Modelo',             width: 100 },
      { field: 'chasis',          headerName: 'Chasis',             width: 130 },
      { field: 'tipoDocumento',   headerName: 'Tipo Documento',     width: 150 },
      { field: 'numeroDocumento', headerName: 'Documento',          width: 150 },
      { field: 'nombreCompleto',  headerName: 'Nombre',             width: 130 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        sortable: false,
        renderCell: (params) => (
          <>
          {/* Botón de Editar */}
          <Tooltip title="Editar" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
    
          {/* Botón de Eliminar 
          <Tooltip title="Eliminar" arrow>
            <IconButton
              aria-label="delete"
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          */}
    
          {/* Botón de Logs (Mostrar detalles) */}
          <Tooltip title="Ver detalles" arrow>
            <IconButton
              aria-label="show"
              onClick={() => handleShow(params.row.id)}
              color="default"
            >
              <ReceiptLongIcon />
            </IconButton>
          </Tooltip>
    
          {/* Botón de Emitido */}
          <Tooltip title="Emitido" arrow>
            <IconButton
              aria-label="emitido"
              onClick={() => handleConfirmEmitido(params.row.id)}
              color="success"
            >
              <AssignmentTurnedInIcon />
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

    const handleConfirmEmitido = async(id) => {

      dispatch(updateThunks({ id, confirmacionPreciosModulo: 1 }));
      
      navigate('/confirmacionprecios')
    
    }
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };


  return (
    <Paper sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={cotizadores}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
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
