import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip, Avatar, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icono de confirmación
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, updatePdfThunks, update_cotizador_devolver, getAllCotizadorPdfsThunks }   from '../../store/cotizadorStore/cotizadorThunks';

import { toast, Bounce } from 'react-toastify';

import { useNavigate }              from 'react-router-dom';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { URL, URLws } from '../../constants.js/constantGlogal';
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

// 🎨 Paleta cálida pastel
const colors = [
  "#FF6B6B", // rojo coral vibrante
  "#FFA931", // naranja brillante
  "#FFD93D", // amarillo vivo
  "#6BCB77", // verde fresco
  "#4D96FF", // azul intenso
  "#A06CD5", // morado vibrante
  "#FF7F50", // coral fuerte
  "#00BFA6", // turquesa brillante
  "#F15BB5", // rosa vibrante
];

const scheme = window.location.protocol === "https:" ? "wss" : "ws";

export function DataTable({loggedUser}) {
    console.log("loggedUser en DataTable:", loggedUser);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { cotizadores } = useSelector(state => state.cotizadorStore);
    
    const [rows, setRows] = useState(cotizadores);


    useEffect(() => {
      setRows(cotizadores);
    }, [cotizadores]);

    const [selectedRow, setSelectedRow] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({}); // Estado para archivos subidos
    const fileInputRef = useRef(null);

    const [fileUpload, setFileUpload] = useState('');

    const handleUpload = (event) => {

      const file = event.target.files[0];
      
      if (!file) return;

        // ✅ Validar extensión PDF
      const isPdf = file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        alert("⚠️ Solo se permiten archivos con extensión .pdf");
        event.target.value = ""; // limpiar el input
        return;
      }

      setFileUpload(file);
      
      if (file && selectedRow) {
      
        toast.success(`Archivo ${file.name} subido.`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,});
  
        // Guardar en el estado que el archivo fue subido para este ID
        setUploadedFiles((prev) => ({
          ...prev,
          [selectedRow.id]: file.name, // Almacenar el nombre del archivo
        }));
  
        // Limpiar el input después de seleccionar el archivo
        fileInputRef.current.value = "";

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "update_archivo_pdf",
            rowId: selectedRow.id,
            action: "upload",       // puede ser "upload" o "confirmar"
            user: loggedUser,
            value: file.name,
          }));
        }

      }
    };

    const handleUploadFile = (id) => {

      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas confirmar la subida del documento y continuar?</p>
            <button
              onClick={() => {
                closeToast();
                handleUploadFileConfirmar(id); // Confirmar eliminación
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

    const handleDevolver = (data="") => {
      if(data == "") return
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas devolver este registro al estado de confirmacion de precio?</p>
            <button
              onClick={() => {
                handleDevolverConfirmar(data); // Confirmar eliminación
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

      dispatch(updatePdfThunks({id, 'pdf':fileUpload, confirmacionPreciosModulo: 0, cotizadorModulo:0, pdfsModulo:1, tramiteModulo:0}, 'pdf'))
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "refresh_request_pdf",
          rowId: id,
          user: loggedUser,
        }));
      }

    }

    const handleDevolverConfirmar = (data) => {
      dispatch(update_cotizador_devolver({'id':data.id, 'devolver':data.devolver}))
    }

    const handleOpenFileDialog = (row) => {
      setSelectedRow(row);
      fileInputRef.current?.click();
    };
  
    const handleDeleteLocalFile = (rowId) => {

      if (window.confirm("¿Seguro que quieres eliminar el archivo?")) {
       
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

    };


    /************************************
        ******** START WEBSOCKET ********
        * ******************************** */
        const { token } = useSelector((state) => state.authStore);
    
        const [ws, setWs] = useState(null);
        const [cellSelections, setCellSelections] = useState({});
        const [rowSelections, setRowSelections]   = useState({});
        const userColorsRef = useRef({}); // usar ref para que no se reinicie en cada render
    
        // asignar color único determinista a cada usuario
        const getUserColor = (user) => {
          if (!userColorsRef.current[user]) {
            // usar hash del nombre del usuario para elegir un color estable
            let hash = 0;
            for (let i = 0; i < user.length; i++) {
              hash = user.charCodeAt(i) + ((hash << 5) - hash);
            }
            const index = Math.abs(hash) % colors.length;
            userColorsRef.current[user] = colors[index];
          }
          return userColorsRef.current[user];
        };
    
    
        useEffect(() => {
          console.log("loggedUser changed:", loggedUser);
          if (!loggedUser) return;
          console.log("Iniciando WebSocket para usuario:", loggedUser);
    
          const socket = new WebSocket(`${scheme}://${URLws}/ws/table/?token=${token}`);
          setWs(socket);
    
          socket.onopen = () => console.log("✅ Conectado al WebSocket");
    
          const handleCellClick = (message) => {
            setCellSelections((prev) => {
              const newSelections = { ...prev };
    
              for (const key in newSelections) {
                newSelections[key] = newSelections[key].filter(
                  (entry) => entry.user !== message.user
                );
                if (newSelections[key].length === 0) {
                  delete newSelections[key];
                }
              }
    
              const key = `${message.rowId}-${message.column}`;
              const color = getUserColor(message.user);
              if (!newSelections[key]) newSelections[key] = [];
              newSelections[key].push({ user: message.user, color });
    
              return newSelections;
            });
          };
    
          const handleCellUnselect = (message) => {
            setCellSelections((prev) => {
              const newSelections = { ...prev };
              if (newSelections[message.key]) {
                newSelections[message.key] = newSelections[message.key].filter(
                  (entry) => entry.user !== message.user
                );
                if (newSelections[message.key].length === 0) {
                  delete newSelections[message.key];
                }
              }
              return newSelections;
            });
          };
          
          const handleUpdateArchivo = (message) => {
            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === message.rowId
                  ? { ...row, archivo: message.value } // asigna nombre del archivo
                  : row
              )
            );

            // Si quieres también reflejar en `uploadedFiles`
            setUploadedFiles((prev) => ({
              ...prev,
              [message.rowId]: message.value,
            }));
          };

          const handleRefreshPdfRequest = (message) => {
             dispatch( getAllCotizadorPdfsThunks() );
          };

          const handleRowSelect = (message) => {
            setRowSelections((prev) => {
              const newSelections = { ...prev };

              // quitar selecciones anteriores del usuario
              for (const key in newSelections) {
                newSelections[key] = newSelections[key].filter(
                  (entry) => entry.user !== message.user
                );
                if (newSelections[key].length === 0) delete newSelections[key];
              }

              // agregar selección nueva
              const color = getUserColor(message.user);
              if (!newSelections[message.rowId]) newSelections[message.rowId] = [];
              newSelections[message.rowId].push({ user: message.user, color });

              return newSelections;
            });
          };

          const handleRowUnselect = (message) => {
            setRowSelections((prev) => {
              const newSelections = { ...prev };
              if (newSelections[message.rowId]) {
                newSelections[message.rowId] = newSelections[message.rowId].filter(
                  (entry) => entry.user !== message.user
                );
                if (newSelections[message.rowId].length === 0) delete newSelections[message.rowId];
              }
              return newSelections;
            });
          };


          socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log("📩 WS recibido:", message);
    
            switch (message.type) {
              case "initial_state":
                setRowSelections(message.rowSelections || {});
                setCellSelections(message.cellSelections || {});
                break;
              case "cell_click":
                handleCellClick(message);
                break;
              case "cell_unselect":
                handleCellUnselect(message);
                break;
              case "update_archivo_pdf":
                handleUpdateArchivo(message);
                break;
              case "refresh_request_pdf": // 👈 Nuevo caso
                handleRefreshPdfRequest(message);
                break;

              case "row_select":
                handleRowSelect(message);
                break;
              case "row_unselect":
                handleRowUnselect(message);
                break;

              default:
                console.warn("⚠️ Evento WS no manejado:", message);
            }
          };
    
          socket.onclose = () => console.log("❌ WebSocket cerrado");
          socket.onerror = (err) => console.error("⚠️ WebSocket error:", err);
    
          return () => socket.close();
        }, [loggedUser]);
    
    
        const handleCellClickWs = (rowId, column) => {
            console.log("ws:",ws);
            //console.log("we.readyState:",ws.readyState);
            console.log("WebSocket.OPEN:",WebSocket.OPEN);
            if (ws && ws.readyState === WebSocket.OPEN) {
              console.log("Cell clicked:", rowId, column);
              const currentKey = `${rowId}-${column}`;
              const alreadySelected = cellSelections[currentKey]?.some((u) => u.user === loggedUser);
    
              if (alreadySelected) {
                ws.send(
                  JSON.stringify({
                    type: "cell_unselect",
                    user: loggedUser,
                    key: currentKey,
                  })
                );
              } else {
                // eliminar selecciones previas del usuario
                for (const key in cellSelections) {
                  if (cellSelections[key].some((u) => u.user === loggedUser)) {
                    ws.send(
                      JSON.stringify({
                        type: "cell_unselect",
                        user: loggedUser,
                        key,
                      })
                    );
                  }
                }
                console.log("oooooo")
                // enviar nueva selección
                ws.send(
                  JSON.stringify({
                    type: "cell_click",
                    user: loggedUser,
                    rowId,
                    column,
                  })
                );
              }
            }
        };
    
        const renderCellWithSelections = (params, content) => {
          const key = `${params.id}-${params.field}`;
          const selections = cellSelections[key] || [];

          return (
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              {content}

              {selections.length > 0 && (
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {selections.map((s) => (
                        <Box
                          key={s.user}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: "#f5f5f5",
                            px: 1,
                            py: 0.5,
                            borderRadius: "8px",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: "0.75rem",
                              bgcolor: s.color,
                              color: "white",
                            }}
                          >
                            {s.user[0].toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem", color: "#333" }}
                          >
                            {s.user}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  }
                >
                  <Chip
                    label={`👥 ${selections.length}`}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      bgcolor: "#1976d2",
                      color: "white",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          );
        };

        const handleRowClickWs = (rowId) => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            // eliminar selecciones previas del usuario
            for (const key in rowSelections) {
              if (rowSelections[key].some((u) => u.user === loggedUser)) {
                ws.send(
                  JSON.stringify({
                    type: "row_unselect",
                    user: loggedUser,
                    rowId: key,
                  })
                );
              }
            }

            // enviar nueva selección
            ws.send(
              JSON.stringify({
                type: "row_select",
                user: loggedUser,
                rowId,
              })
            );
          }
        };
        /************************************
         ********** END WEBSOCKET ***********
        * ******************************** */
    
    const getRowSelectionData = (rowId) => {
      return rowSelections[rowId];
    };


    const columns = [
        { 
          field: 'id', 
          headerName: 'ID', 
          width: 90,
          renderCell: (params) => {
            const content = params.value; // mostramos el valor directamente
            return renderCellWithSelections(params, content);
          }
        },
        {
          field: 'fechaCreacion',
          headerName: 'Fecha',
          width: 150,
          valueFormatter: (params) => {
            if (!params) return "";
            return params.slice(0, 16).replace("T", " ");
          },
          renderCell: (params) => {
            // usamos el mismo formateo que en valueFormatter
            let value = params.value;
            if (value) {
              value = value.slice(0, 16).replace("T", " ");
            }
            const content = value || "";
            return renderCellWithSelections(params, content);
          }
        },
      { field: 'etiquetaDos',     headerName: 'Etiqueta', width: 170,       
          renderCell: (params) => {
          const colorFondoEtiqueta = params.row.color_etiqueta || "#ddd"; // Usa color_cliente o un color por defecto
          const colorTexto = getContrastColor(colorFondoEtiqueta); // Color de texto calculado
          const content = (
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
          return renderCellWithSelections(params, content);
        }, 
      },
      { 
        field: 'placa', 
        headerName: 'Placa', 
        width: 130,
        renderCell: (params) => {
          const content = params.value || "";
          return renderCellWithSelections(params, content);
        }
      },
      { 
        field: 'cilindraje', 
        headerName: 'Cilindraje', 
        width: 130,
        renderCell: (params) => {
          const content = params.value || "";
          return renderCellWithSelections(params, content);
        }
      },
      { 
        field: 'modelo', 
        headerName: 'Modelo', 
        width: 130,
        renderCell: (params) => {
          const content = params.value || "";
          return renderCellWithSelections(params, content);
        }
      },
      { 
        field: 'chasis', 
        headerName: 'Chasis', 
        width: 130,
        renderCell: (params) => {
          const content = params.value || "";
          return renderCellWithSelections(params, content);
        }
      },
      { 
        field: 'numeroDocumento', 
        headerName: 'Documento', 
        width: 150,
        renderCell: (params) => {
          const content = params.value || "";
          return renderCellWithSelections(params, content);
        }
      },
      {
        field: "nombre_cliente",
        headerName: "Cliente",
        width: 150,
        renderCell: (params) => {
          const colorFondo = params.row.color_cliente || "#ddd"; 
          const colorTexto = getContrastColor(colorFondo); 

          const content = (
            <Chip
              style={{
                backgroundColor: colorFondo,
                color: colorTexto,
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
                width: "100%",
              }}
              label={params.value}
            />
          );

          return renderCellWithSelections(params, content);
        },
      },
      {
        field: "pdf",
        headerName: "PDF",
        width: 250,
        renderCell: (params) => {
          const nombreCompleto = params.row.nombreCompleto || "Sin nombre";

          let content = null;

          if (params.value) {
            content = (
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Ver PDF">
                  <IconButton
                    color="error"
                    onClick={() => window.open(URL + params.value, "_blank")}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="body2"
                  color="text.primary"
                  noWrap
                  sx={{ fontSize: "0.9rem", maxWidth: 180 }}
                >
                  {nombreCompleto}
                </Typography>
              </Box>
            );
          }else{
            content = (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  color="text.primary"
                  noWrap
                  sx={{ fontSize: "0.9rem", maxWidth: 180 }}
                >
                  {nombreCompleto}
                </Typography>
              </Box>
            );
          }

          return renderCellWithSelections(params, content);
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 250,
        sortable: false,
        renderCell: (params) => {
          const isFileUploaded = uploadedFiles[params.row.id];
          const archivoFile = params.row.pdf;

          const content = (
            <>
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

              <Tooltip title="Volver al valor anterior" arrow>
                <IconButton
                  aria-label="Volver al valor anterior"
                  onClick={() => handleDevolver({ id: params.row.id, devolver: "pdf" })}
                  color="info"
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              {archivoFile ? (
                <>
                  {/* Aquí puedes reactivar el botón de eliminar PDF si lo necesitas */}
                </>
              ) : null}

              {/* Mostrar icono de confirmación y eliminar archivo si hay un archivo subido */}
              {!archivoFile && isFileUploaded && (
                <>
                  <Tooltip title={`Archivo subido: ${isFileUploaded}`}>
                    <IconButton aria-label="delete-file" color="success">
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

          return renderCellWithSelections(params, content);
        },
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

    const handleDeleteFile = (id) => {
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas eliminar el cliente?</p>
            <button
              onClick={() => {
                closeToast();
                confirmDelete(id); // Confirmar eliminación
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
      //await dispatch(deleteThunk(id));
      alert("remoive")
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
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="pdfs"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="pdfs"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      
     <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
        pagination: { paginationModel: { pageSize: 100, page: 0 } },
        }}
        onRowClick={(params) => handleRowClickWs(params.id)}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        sx={{
        border: 0,
        "& .even-row": { backgroundColor: "#f5f5f5" },
        "& .odd-row": { backgroundColor: "#ffffff" },
        
        // REGLAS DINÁMICAS BASADAS EN rowSelections
        ...Object.keys(rowSelections).reduce((acc, rowId) => {
        const selections = getRowSelectionData(rowId);
        // Solo necesitamos el primer usuario que seleccionó la fila para el color
        if (selections && selections.length > 0) {
          const color = selections[0].color; 
          const rowClass = `& .row-selected-${rowId}`;
          
          // Define los estilos para la clase dinámica
          acc[rowClass] = {
          // Color de fondo suave (usando 20% de opacidad: '33' en HEX)
          backgroundColor: `${color}33 !important`, 
          
          // Borde izquierdo del color del usuario
          borderLeft: `5px solid ${color}`, 
          
          // Asegura que el hover mantenga el color y no el predeterminado de MUI
          '&:hover': {
          backgroundColor: `${color}4D !important`, // Ligeramente más opaco al pasar el ratón ('4D' es 30%)
          },
          };
        }
        return acc;
        }, {}),
        
        // Puedes eliminar el estilo original de selected-row si ya no quieres el borde verde
        "& .MuiDataGrid-row.selected-row": {
        // Estilo original comentado:
        // outline: "2px solid green",
        // outlineOffset: "-2px",
        // borderRadius: "4px",
        },
        }}
        getRowClassName={(params) => {
        const baseClass =
        params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row";

        // Aplicar la clase de color dinámico si la fila está seleccionada por cualquier usuario
        if (rowSelections[params.id]?.length > 0) {
        return `${baseClass} row-selected-${params.id}`;
        }
        return baseClass;
        }}
        onCellClick={(params, event) => {
        //handleCellClick(params, event);
        handleCellClickWs(params.id, params.field);
        }}
        slots={{
        noRowsOverlay: NoRowsOverlay, // Personaliza el estado sin datos
        }}
      />

    </Box>
  );
}
