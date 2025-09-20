import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSelector, useDispatch }     from 'react-redux';
import { sendToThunk, showThunk }  from '../../store/archivocotizacionesantiguasStore/archivocotizacionesantiguasStoreThunks';

import Tooltip from "@mui/material/Tooltip";


import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { Box } from '@mui/material';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import { URL } from '../../constants.js/constantGlogal';
export function DataTable() {

    const dispatch = useDispatch();
    
    let { cotizadores }    = useSelector(state => state.archivocotizacionesantiguasStore);
      
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
    const handleCopy = (text) => {
      navigator.clipboard.writeText(text).then(() => {
      }).catch(err => console.error("Error al copiar: ", err));
    };
    const columns = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "nombre_usuario", headerName: "Usuario", width: 120 },
      { field: "nombre_cliente", headerName: "Cliente", width: 150 },
      { field: "placa", headerName: "Placa", width: 120 },
      { field: "cilindraje", headerName: "Cilindraje", width: 120 },
      { field: "modelo", headerName: "Modelo", width: 100 },
      { field: "chasis", headerName: "Chasis", width: 150 },
      { field: "tipoDocumento", headerName: "Tipo Documento", width: 150 },
      { field: "numeroDocumento", headerName: "N° Documento", width: 150 },
      { field: "telefono", headerName: "Teléfono", width: 150 },
      { field: "correo", headerName: "Correo", width: 200 },
      { field: "direccion", headerName: "Dirección", width: 200 },
      { field: "pagoInmediato", headerName: "Pago Inmediato", width: 120 },
      {
        field: "linkPago",
        headerName: "Link de Pago",
        width: 200,
        renderCell: (params) => (
          params.value ? (
    
              <Tooltip title="Copiar">
                <ContentCopyIcon style={{ cursor: "pointer", color: "green" }} onClick={() => handleCopy(params.value)} />
              </Tooltip>
        
          ) : (
            "No disponible"
          )
        ),
      },
      { field: "precioDeLey", headerName: "Precio de Ley", width: 120 },
      { field: "comisionPrecioLey", headerName: "Comisión", width: 100 },
      { field: "total", headerName: "Total", width: 100 },
      { field: "fechaCreacion", headerName: "Fecha Creación", width: 200,
        valueGetter: (params) => params ? params.slice(0, 16).replace("T", " ") : "" 
      },
      { field: "color_cliente", headerName: "Color Cliente", width: 120, renderCell: (params) => (
          <div style={{ backgroundColor: params.value, width: "100%", height: "100%" }}></div>
        )
      },
      { field: "color_etiqueta", headerName: "Color Etiqueta", width: 120, renderCell: (params) => (
          <div style={{ backgroundColor: params.value, width: "100%", height: "100%" }}></div>
        )
      },
      {
        field: "archivo",
        headerName: "Archivo",
        width: 150,
        renderCell: (params) => {
          return params.value ? (
            <img src={URL +params.value} alt="Archivo" style={{ width: 50, height: 50 }} />
          ) : (
            <ImageIcon style={{ color: "gray", fontSize: 40 }} />
          );
        },
      },
      {
        field: "pdf",
        headerName: "PDF",
        width: 150,
        renderCell: (params) => (
          params.value ? (
            <a href={ params.value} target="_blank" rel="noopener noreferrer">
              <PictureAsPdfIcon style={{ color: "red", fontSize: 40 }} />
            </a>
          ) : (
            "No disponible"
          )
        ),
      },
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
              <VisibilityIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleSentToTramite(params.row.id)}
              color="success"
            >
              <PublishedWithChangesIcon />
            </IconButton>
          </>
        ),
      },
    ];
    
    
    
    // Función para manejar la eliminación
    const handleSentToTramite = (id) => {
      // Mostrar la notificación con opciones de confirmación
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que quieres enviar este registro al proceso de trámites?</p>
            <button
              onClick={() => {
                confirmSent(id, closeToast); // Confirmar eliminación
              }}
              style={{
                marginRight: '10px',
                backgroundColor: 'rgb(46, 125, 50)',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Sí, enviar
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
    const confirmSent = async (id, closeToast) => {
      await dispatch(sendToThunk(id));
      closeToast(); // Cerrar la notificación
    };
    
    const paginationModel = { page: 0, pageSize: 15 };

    // Función para manejar la edición
    const handleEdit = async (row) => {
      await dispatch(showThunk(row.id));
    };


  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="archivocotizacionesantiguasStore"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="archivocotizacionesantiguasStore"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      <DataGrid
        rows={cotizadores}
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
    </Box>
  );
}
