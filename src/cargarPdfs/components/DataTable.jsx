import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip } from "@mui/material";
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

          socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log("📩 WS recibido:", message);
    
            switch (message.type) {
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
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      display: "flex",
                      gap: "2px",
                      flexWrap: "wrap",
                    }}
                  >
                    {selections.map((s) => (
                      <Chip
                        key={s.user}
                        label={s.user}
                        size="small"
                        sx={{
                          bgcolor: s.color || "#1976d2", // color de fondo
                          color: "white",                // texto blanco
                          fontSize: "0.9rem",            // más grande
                          fontWeight: "bold",            // más grueso
                          height: 28,                    // más alto
                          px: 1.5,                       // padding horizontal extra
                          borderRadius: "8px",           // esquinas más redondeadas
                          boxShadow: "0px 2px 6px rgba(0,0,0,0.15)", // sombra ligera
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            );
        };
        /************************************
         ********** END WEBSOCKET ***********
        * ******************************** */

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
        width: 150,
        renderCell: (params) => {
          let content = null;

          if (params.value) {
            content = (
              <Tooltip title="Ver PDF">
                <IconButton
                  color="error" // Rojo para indicar PDF
                  onClick={() => window.open(URL + params.value, "_blank")} // Abre en nueva pestaña
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
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
        //rows={cotizadores}
        rows={rows}
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
