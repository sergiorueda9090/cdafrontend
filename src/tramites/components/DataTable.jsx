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

import { ToastContainer, toast, Bounce } from 'react-toastify';

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
    
    const handleCopyToClipboard = (text, id="") => {
      console.log("id ",id)
      navigator.clipboard.writeText(text).then(() => {
        if(id != ""){
          mostrarToast(id)
        }
      });
    };
   
    const getPastelColor = () => {
      const hue = Math.floor(Math.random() * 360); // Color aleatorio en el espectro HSL
      return `hsl(${hue}, 70%, 85%)`; // Colores suaves
    };

    /* ====================== */
    const mostrarToast = (id) => {
      let tiempoRestante = 180; // 3 minutos en segundos
      console.log("mostrarToast ",id);
      const idToast = toast(
        <div>
          ⏳ Tienes <span id="contador">3:00</span> minutos para confirmar el link de pago.
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
            <button 
              onClick={() => confirmarPago(idToast,id)} 
              style={{ background: "green", color: "white", border: "none", padding: "5px", cursor: "pointer" }}>
              ✅ Pago Exitoso
            </button>
            <button 
              onClick={() => noPuedePagar(idToast)} 
              style={{ background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" }}>
              ❌ No Puedo Pagar
            </button>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 180000, // 3 minutos
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        }
      );
  
      // Actualizar el mensaje cada segundo
      const interval = setInterval(() => {
        tiempoRestante -= 1;
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        const tiempoFormato = `${minutos}:${segundos.toString().padStart(2, "0")}`;
  
        toast.update(idToast, {
          render: (
            <div>
              ⏳ Tienes <span id="contador">{tiempoFormato}</span> minutos para confirmar el link de pago.
              <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <button 
                  onClick={() => confirmarPago(idToast,id)} 
                  style={{ background: "green", color: "white", border: "none", padding: "5px", cursor: "pointer" }}>
                  ✅ Pago Exitoso
                </button>
                <button 
                  onClick={() => noPuedePagar(idToast)} 
                  style={{ background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" }}>
                  ❌ No Puedo Pagar
                </button>
              </div>
            </div>
          ),
        });
  
        if (tiempoRestante <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    };
  
    const confirmarPago = async (idToast, id="") => {
      toast.dismiss(idToast);
    
      await handleConfirmEmitido(id)
      
      toast.success("✅ Pago confirmado con éxito.", {
        position: "bottom-right",
        autoClose: 5000,
      });
    
    };
  
    const noPuedePagar = (idToast) => {
      toast.dismiss(idToast);
      toast.error("❌ No pudiste realizar el pago.", {
        position: "bottom-right",
        autoClose: 5000,
      });
    };


    const confirmDelete = (rowId) => {
      alert("llama el endpoint de elminar el archivo");
    }
    /* ====================== */

    const columns = [
      { field: 'id',              headerName: 'ID',                 width: 80},
      {
        field: 'fechaCreacion',
        headerName: 'Hace',
        width: 150,
        valueGetter: (params) => {
          const fechaRegistro = params; // Accede a la fecha desde la fila
          if (!fechaRegistro) return ''; // Manejo de valores nulos o indefinidos
      
          const ahora = dayjs();
          const diferenciaEnMinutos = ahora.diff(dayjs(fechaRegistro), 'minute'); // Calcula la diferencia en minutos
      
          return `${diferenciaEnMinutos} minutos`;
        },

      },
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
        { field: 'nombre_cliente',  headerName: 'Cliente', width: 150,        
          renderCell: (params) => {
              const colorFondo = params.row.color_cliente || "#ddd"; // Usa color_cliente o un color por defecto
              return (
                <div
                  style={{
                    backgroundColor: colorFondo,
                    color: "#333", // Color de texto oscuro para mejor contraste
                    padding: "5px",
                    borderRadius: "5px",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {params.value}
                </div>
              );
            },
          },
          { field: 'etiquetaDos',     headerName: 'Etiqueta', width: 150,
            renderCell: (params) => {
              const colorFondoEtiqueta = params.row.color_etiqueta || "#ddd"; // Usa color_cliente o un color por defecto
              return (
                <div
                  style={{
                    backgroundColor: colorFondoEtiqueta,
                    padding: "5px",
                    borderRadius: "5px",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {params.value}
                </div>
              );
            },
          },
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
                      onClick={() => handleCopyToClipboard(params, params.id)}
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
          { field: 'placa',           headerName: 'Placa',              width: 130, editable: true,  
            renderCell: (params) => (
              <>
                <Tooltip title="Copiar Placa">
                  <IconButton
                    aria-label="Copiar Placa"
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
          { field: 'cilindraje',      headerName: 'Cilindraje',         width: 130, editable: true,  
            renderCell: (params) => (
              <>
                <Tooltip title="Copiar Cilindraje">
                  <IconButton
                    aria-label="Copiar Cilindraje"
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
          { field: 'modelo',          headerName: 'Modelo',             width: 100, editable: true,  
            renderCell: (params) => (
              <>
                <Tooltip title="Copiar Modelo">
                  <IconButton
                    aria-label="Copiar Modelo"
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
          { field: 'chasis',          headerName: 'Chasis',             width: 220, editable: true,  
            renderCell: (params) => (
              <>
                <Tooltip title="Copiar Cilindraje">
                  <IconButton
                    aria-label="Copiar Cilindraje"
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
          { field: 'numeroDocumento', headerName: 'Documento',          width: 150, editable: true,  
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
          { field: 'nombreCompleto',  headerName: 'Nombre',             width: 130, editable: true,  
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

      dispatch(updateThunks({ id, confirmacionPreciosModulo: 1, pdfsModulo:1, tramiteModulo:0 }, 'tramite'));
      
      navigate('/confirmacionprecios')
    
    }
    
    const paginationModel = { page: 0, pageSize: 15 };

    // Función para manejar la edición
    const handleEdit = async (row) => {
      await dispatch(showThunk(row.id));
    };


  return (
    <Paper sx={{ padding: 2 }}>
          
          <button onClick={mostrarToast}>Mostrar Toast</button>
          <ToastContainer />

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
