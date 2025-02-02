import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, updateThunks }   from '../../store/cotizadorStore/cotizadorThunks';

import { useNavigate }              from 'react-router-dom';
import { URL } from '../../constants.js/constantGlogal';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Habilitar el plugin de tiempo relativo
dayjs.extend(relativeTime);

export function DataTable() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { cotizadores } = useSelector(state => state.cotizadorStore);

    const [rows, setRows] = useState(cotizadores);

    const [editingField, setEditingField] = useState("");
    const [editingValue, setEditingValue] = useState("");
  
    const processRowUpdate = (newRow) => {
    
      const oldRow = cotizadores.find((row) => row.id === newRow.id); // Encuentra la fila original
      
      if (!oldRow) return newRow; // Si no se encuentra, salir
    
      // Encontrar el campo modificado comparando los valores
      const changedField = Object.keys(newRow).find((key) => oldRow[key] !== newRow[key]);
    
      if (changedField) {

        const newValue = newRow[changedField];
    
        console.log(`Campo modificado: ${changedField}, Nuevo Valor: ${newValue}, ID: ${newRow.id}`);
    
        // Actualizar estados
        setEditingField(changedField);
        
        setEditingValue(newValue);
      
        let formValues = {[changedField]:newValue, 'id':newRow.id};

        dispatch(updateThunks(formValues, 'tramite'));
        
      }
      
      
      return oldRow

    };
    
    const handleCopyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert("Link copiado al portapapeles");
      });
    };
   
    const columns = [
      { field: 'id',              headerName: 'ID',                 width: 80},
      {
        field: 'fechaCreacion',
        headerName: 'Hace',
        width: 150,
        valueGetter: (params) => {
          const fechaRegistro = params; // Asegúrate de que "fechaEmision" sea un campo en tus datos
          return dayjs(fechaRegistro).fromNow(); // Convierte la fecha a "hace X minutos"
        },
      },
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
      { field: 'placa',           headerName: 'Placa',              width: 130, editable: true },
      { field: 'cilindraje',      headerName: 'Cilindraje',         width: 130, editable: true },
      { field: 'modelo',          headerName: 'Modelo',             width: 100, editable: true },
      { field: 'chasis',          headerName: 'Chasis',             width: 130, editable: true },
      {
        field: "tipoDocumento",
        headerName: "Tipo Documento",
        width: 150,
        renderCell: (params) => {
          const mapDocumentTypes = {
            "Cedula": "CC",
            "Pasaporte": "PPT",
            "Licencia": "LIC"
          };
    
          // Si existe en el diccionario, se reemplaza, si no, se muestra el valor original
          return mapDocumentTypes[params.value] || params.value;
        }
      },
      { field: 'numeroDocumento', headerName: 'Documento',          width: 150, editable: true },
      { field: 'nombreCompleto',  headerName: 'Nombre',             width: 130, editable: true },
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
    

    const handleShow = async(id) => {
      navigate(`/tramites/PageShow/${id}`);
    };

    const handleConfirmEmitido = async(id) => {

      dispatch(updateThunks({ id, confirmacionPreciosModulo: 1 }, 'tramite'));
      
      navigate('/confirmacionprecios')
    
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
            <FilterData cotizador="tramite"/>  {/* Componente de filtros adicionales */}
            <DateRange  cotizador="tramite"/>  {/* Componente para selección de rango de fechas */}
        </Box>

      <DataGrid
        rows={cotizadores}
        columns={columns}
        processRowUpdate={processRowUpdate}
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
        //onCellEditCommit={handleEditCellCommit}
      />
    </Paper>
  );
}
