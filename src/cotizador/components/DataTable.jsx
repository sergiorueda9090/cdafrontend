import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { useSelector, useDispatch } from 'react-redux';
import { resetFormularioStore }     from '../../store/cotizadorStore/cotizadorStore'
import { showThunk, deleteThunk }   from '../../store/cotizadorStore/cotizadorThunks';

import { toast } from 'react-toastify';

import { useNavigate }              from 'react-router-dom';
import { DateRange } from './DateRange';
import { FilterData } from './FilterData';
import { Avatar, Tooltip } from '@mui/material';
import { URL } from '../../constants.js/constantGlogal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import emptyDataTable from "../../assets/images/emptyDataTable.png"

import { Chip } from "@mui/material";

const getContrastColor = (hexColor) => {
  // Convertir HEX a RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Calcular luminancia relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Si la luminancia es baja, usar texto blanco, de lo contrario, negro
  return luminance > 0.6 ? "#333" : "#FFF";
};

export function DataTable() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { cotizadores, dateFilter } = useSelector(state => state.cotizadorStore);

    const handleCopyToClipboard = (value) => {
      navigator.clipboard.writeText(value);
    };

    const getPastelColor = () => {
      const hue = Math.floor(Math.random() * 360); // Selecciona un tono aleatorio
      return `hsl(${hue}, 70%, 85%)`; // 70% de saturación y 85% de luminosidad para colores suaves
    };

    const columns = [
      { field: 'id',              headerName: 'ID',                 width: 90},
  {
     field: "image_usuario",
     headerName: "Usuario",
     width: 100,
     sortable: false,
     renderCell: (params) => {
       const imageUrl = URL + params.row.image_usuario; // URL de la imagen
       const fullName = params.row.nombre_usuario || "Usuario";
       const colorPunto = getPastelColor(); // Color único para cada usuario
 
       return (
         <Tooltip title={fullName} arrow>
           <Box sx={{ position: "relative", display: "inline-block" }}>
             <Avatar
               alt={fullName}
               src={imageUrl || ""}
               sx={{ width: 40, height: 40, fontSize: 16, bgcolor: "#2196f3", cursor: "pointer" }}
             >
               {!imageUrl ? fullName[0] : ""}
             </Avatar>
             {/* Punto de color en la esquina inferior derecha */}
             <Box
               sx={{
                 position: "absolute",
                 bottom: 0,
                 right: 0,
                 width: 10,
                 height: 10,
                 borderRadius: "50%",
                 backgroundColor: colorPunto,
                 border: "2px solid white",
               }}
             />
           </Box>
         </Tooltip>
       );
     },
   },
      {
        field: "nombre_cliente",
        headerName: "Cliente",
        width: 150,
        renderCell: (params) => {
          const colorFondo = params.row.color_cliente || "#ddd"; // Usa color_cliente o un color por defecto
          const colorTexto = getContrastColor(colorFondo); // Color de texto calculado
          return (
            <Chip
              style={{
                backgroundColor: colorFondo,
                color: colorTexto, // Color de texto oscuro para mejor contraste
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
                width: "100%",
              }}
              label={params.value}
              />
          );
        },
      },
      { field: 'etiquetaDos',     headerName: 'Etiqueta', width: 170,       
          renderCell: (params) => {
          const colorFondoEtiqueta = params.row.color_etiqueta || "#ddd"; // Usa color_cliente o un color por defecto
          const colorTexto = getContrastColor(colorFondoEtiqueta); // Color de texto calculado
          return (
            <Chip
              style={{
                backgroundColor: colorFondoEtiqueta,
                color: colorTexto, // Color de texto oscuro para mejor contraste
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
                width: "100%",
              }}
              label={params.value}
              />
          );
        }, 
      },
      {
        field: 'placa',
        headerName: 'Placa',
        width: 150,
        renderCell: (params) => (
          <>
            <Tooltip title="Copiar placa">
              <IconButton
                aria-label="Copiar placa"
                onClick={() => handleCopyToClipboard(params.value)}
                color="primary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            {params.value}
          </>
        ),
      },
      {
        field: 'cilindraje',
        headerName: 'Cilindraje',
        width: 150,
        renderCell: (params) => (
          <>
            <Tooltip title="Copiar cilindraje">
              <IconButton
                aria-label="Copiar cilindraje"
                onClick={() => handleCopyToClipboard(params.value)}
                color="primary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            {params.value}
          </>
        ),
      },
      {
        field: 'modelo',
        headerName: 'Modelo',
        width: 150,
        renderCell: (params) => (
          <>
            <Tooltip title="Copiar modelo">
              <IconButton
                aria-label="Copiar modelo"
                onClick={() => handleCopyToClipboard(params.value)}
                color="primary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            {params.value}
          </>
        ),
      },
      {
        field: 'chasis',
        headerName: 'Chasis',
        width: 180,
        renderCell: (params) => (
          <>
            <Tooltip title="Copiar chasis">
              <IconButton
                aria-label="Copiar chasis"
                onClick={() => handleCopyToClipboard(params.value)}
                color="primary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            {params.value}
          </>
        ),
      },
      { field: 'numeroDocumento', headerName: 'Documento',  width: 150,        
        renderCell: (params) => (
          <>
            <Tooltip title="Copiar Documento">
              <IconButton
                aria-label="Copiar Documento"
                onClick={() => handleCopyToClipboard(params.value)}
                color="primary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            {params.value}
          </>
        ), 
    },
      { field: 'nombreCompleto',  headerName: 'Nombre',   width: 130,  
        renderCell: (params) => (
          <>
            <Tooltip title="Copiar Nombre">
              <IconButton
                aria-label="Copiar Nombre"
                onClick={() => handleCopyToClipboard(params.value)}
                color="primary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            {params.value}
          </>
        ),  
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Editar" arrow>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(params.row)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
            </Tooltip>
            {!dateFilter ? <>
               <Tooltip title="Historia de registros" arrow>
                  <IconButton
                    aria-label="Show"
                    onClick={() => handleShow(params.row.id)}
                    color="success"
                  >
                      <ReceiptLongIcon />
                  </IconButton>
               </Tooltip>
            </>:''}
             
          </>
        ),
      },
    ];
    
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
      navigate(`/cotizador/PageShow/${id}`);
    };
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    if(!dateFilter){

      await dispatch(resetFormularioStore());
      await dispatch(showThunk(row.id, dateFilter));

    }else{

      await dispatch(showThunk(row.id));

    }

  };


  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>
      
        {/* Contenedor de filtros */}
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <FilterData  cotizador="cotizador"/>  {/* Componente de filtros adicionales */}
            <DateRange   cotizador="cotizador"/>  {/* Componente para selección de rango de fechas */}
        </Box>

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
        slots={{
          noRowsOverlay: NoRowsOverlay, // Personaliza el estado sin datos
        }}

      />

    </Paper>
  );
}
