import React, { useState, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

//import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
//import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import DeleteIcon from '@mui/icons-material/Delete';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icono de confirmación
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { showThunk, deleteThunk, updateThunks } from '../../store/cotizadorStore/cotizadorThunks';

import { useNavigate }              from 'react-router-dom';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';


export function DataTable() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { cotizadores, archivo } = useSelector(state => state.cotizadorStore);

    const [selectedRow, setSelectedRow]     = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({}); // Estado para archivos subidos

    const fileInputRef = useRef(null);

    const [fileUpload, setFileUpload] = useState('');
  
    const handleUpload = (event) => {
      
      const file = event.target.files[0];
   
      
      setFileUpload(file);

      if (file && selectedRow) {

        toast.success(`Archivo ${file.name} subido.`)
   
        // Guardar en el estado que el archivo fue subido para este ID
        setUploadedFiles((prev) => ({
          ...prev,
          [selectedRow.id]: file.name, // Almacenar el nombre del archivo
        }));
  
        // Limpiar el input después de seleccionar el archivo
        fileInputRef.current.value = "";
      }

    };

    
  
    const handleOpenFileDialog = (row) => {
      setSelectedRow(row);
      fileInputRef.current?.click();
    };
  
    const handleDeleteFile = (id) => {

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

    const confirmDelete = (rowId) => {
      alert("llama el endpoint de elminar el archivo");
    }

    const handleDeleteLocalFile = (rowId) => {
        setUploadedFiles((prev) => {
          const newFiles = { ...prev };
          delete newFiles[rowId]; // Eliminar archivo del estado
          return newFiles;
        });
        // Resetear el input file para permitir nueva subida
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    }

    const columns = [
      { field: 'id',                    headerName: 'ID',              width: 90},
      { field: 'nombre_cliente',        headerName: 'Cliente',         width: 130 },
      { field: 'etiquetaDos',           headerName: 'Etiqueta',        width: 130 },
      { field: 'placa',                 headerName: 'Placa',           width: 130 },
      { field: 'numeroDocumento',       headerName: 'Documento',       width: 150 },
      { field: 'nombreCompleto',        headerName: 'Nombre',          width: 130 },
      { field: 'precioDeLey',           headerName: 'Precio de ley',   width: 130 },
      { field: 'comisionPrecioLey',     headerName: 'Comision',        width: 130 },
      { field: 'total',                 headerName: 'Total',           width: 130 },
      {
        field: "actions",
        headerName: "Actions",
        width: 250,
        sortable: false,
        renderCell: (params) => {
          console.log("params ",params.row.archivo)
          const isFileUploaded = uploadedFiles[params.row.id];
          const archivoFile = params.row.archivo;

          return (
            <>
              <IconButton aria-label="edit" onClick={() => handleEdit(params.row)} color="primary">
                <EditIcon />
              </IconButton>

              {/* Mostrar icono de subir archivo SOLO si no hay archivo cargado */}
              {!archivoFile && !isFileUploaded && (
                <Tooltip title="Subir archivo">
                  <IconButton
                    aria-label="upload"
                    color="primary"
                    onClick={() => handleOpenFileDialog(params.row)}
                  >
                    <UploadFileIcon />
                  </IconButton>
                </Tooltip>
              )}
  
              {/* Mostrar icono de confirmación y eliminar archivo si hay un archivo subido */}
              {
                archivoFile ? (  <>
                  <Tooltip title="Eliminar archivo">
                    <IconButton
                      aria-label="delete-file"
                      color="error"
                      onClick={() => handleDeleteFile(params.row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>      
                </>):('')
              }

              {!archivoFile && isFileUploaded && (
                <>
                  <Tooltip title={`Archivo subido: ${isFileUploaded}`}>
                  <IconButton
                      aria-label="delete-file"
                      color="success"
                    >
                    <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
  
                  <Tooltip title="Eliminar archivo">
                    <IconButton
                      aria-label="delete-file"
                      color="error"
                      onClick={() => handleDeleteLocalFile(params.row.id)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Confirmar">
                    <IconButton
                      aria-label="delete-file"
                      color="success"
                      onClick={() => handleUploadFile(params.row.id)}
                    >
                      <AutoStoriesIcon />
                    </IconButton>
                  </Tooltip>
                  
                </>
              )}
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
    /*const confirmDelete = async (id, closeToast) => {
      await dispatch(deleteThunk(id));
      closeToast(); // Cerrar la notificación
    };*/

    const handleShow = async(id) => {
      navigate(`/tramites/PageShow/${id}`);
    };

    const handleUploadFile = (id) => {
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas confirmar la subida del documento y continuar?</p>
            <button
              onClick={() => {
                handleUploadFileConfirmar(id, closeToast); // Confirmar eliminación
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
              Sí, Confirmar
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

    }

    const handleUploadFileConfirmar = (id) => {
      dispatch(updateThunks({id, 'archivo':fileUpload}, 'confirmarprecio'))
    }
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };


  return (
    <Paper sx={{ height: 700, width: '100%' }}>

      {/* Contenedor de filtros */}
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="confirmacionprecios"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="confirmacionprecios"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
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
