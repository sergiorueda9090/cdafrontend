import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UndoIcon from '@mui/icons-material/Undo';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useSelector, useDispatch } from 'react-redux';
import { resetFormularioStore }     from '../../store/cotizadorStore/cotizadorStore'
import { showThunk, deleteThunk, updateThunks, getAllCotizadorCotizadorRemoveThunks }   from '../../store/cotizadorStore/cotizadorThunks';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import { useNavigate }              from 'react-router-dom';
import { DateRange } from './DateRange';
import { FilterData } from './FilterData';
import { Avatar, Tooltip } from '@mui/material';
import { URL, URLws } from '../../constants.js/constantGlogal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import emptyDataTable from "../../assets/images/emptyDataTable.png"

import { Chip } from "@mui/material";
import { ExcelUploader } from './SubirExcel';


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
  "#FFD6A5", // durazno pastel
  "#FFB5A7", // rosado pastel
  "#FEC89A", // naranja melón pastel
  "#FCD5CE", // coral pastel
  "#FFF1B6", // amarillo suave
  "#EAC4D5", // rosa cálido pastel
  "#FFDAC1", // durazno claro
  "#FFE0AC", // amarillo cálido
  "#FFD1BA", // salmón pastel
];


const scheme = window.location.protocol === "https:" ? "wss" : "ws";

export function DataTable({loggedUser}) {

    const navigate = useNavigate();

    const dispatch = useDispatch();

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

    console.log("loggedUser ",loggedUser)

    useEffect(() => {
      if (!loggedUser) return;

      const socket = new WebSocket(`${scheme}://${URLws}/ws/table/?token=${token}`);
      setWs(socket);

      socket.onopen = () => console.log("✅ Conectado al WebSocket ====");

      const handleCellClick = (message) => {
        setCellSelections((prev) => {
          const newSelections = { ...prev };

          // Quitar selección previa del usuario en cualquier celda
          for (const key in newSelections) {
            newSelections[key] = newSelections[key].filter(
              (entry) => entry.user !== message.user
            );
            if (newSelections[key].length === 0) {
              delete newSelections[key];
            }
          }

          // Agregar nueva selección
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

      const handleRefreshRequest = (message) => {
        dispatch(getAllCotizadorCotizadorRemoveThunks(message.rowId));
      };

      socket.onmessage = (e) => {
        const message = JSON.parse(e.data);

        switch (message.type) {
          case "cell_click":
            handleCellClick(message);
            break;

          case "cell_unselect":
            handleCellUnselect(message);
            break;

          case "refresh_request_cotizador":
            handleRefreshRequest(message);
            break;

          default:
            console.warn("⚠️ Tipo de mensaje desconocido:", message.type);
            break;
        }
      };

      socket.onclose = () => console.log("WebSocket cerrado");
      socket.onerror = (err) => console.error("WebSocket error:", err);

      return () => socket.close();
    }, [loggedUser]);


    const handleCellClickWs = (rowId, column) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          const currentKey = `${rowId}-${column}`;
          const alreadySelected =
            cellSelections[currentKey]?.some((u) => u.user === loggedUser);

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
  /************************************
   ********** END WEBSOCKET ***********
   * ******************************** */

    const handleShowUserSelect = (row) => {
      if(row.id){
        const now = new Date();
        // Convertir a la zona horaria de Bogotá
        const bogotaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));

        // Obtener componentes de la fecha
        const year  = bogotaTime.getFullYear();
        const month = String(bogotaTime.getMonth() + 1).padStart(2, "0");
        const day = String(bogotaTime.getDate()).padStart(2, "0");
        const hours = String(bogotaTime.getHours()).padStart(2, "0");
        const minutes = String(bogotaTime.getMinutes()).padStart(2, "0");
        const seconds = String(bogotaTime.getSeconds()).padStart(2, "0");
        const milliseconds = String(bogotaTime.getMilliseconds()).padStart(3, "0") + "000"; // Agrega tres ceros extras

        // Formatear la fecha
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

        let data = {id:row.id, cotizadorModulo:0, tramiteModulo:1, confirmacionPreciosModulo:0, pdfsModulo:0, fechaTramite:formattedDate}
        dispatch(updateThunks(data, "cotizador"));

              // 🔄 Apagar la ruedita para todos
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type : "refresh_request_cotizador",
            rowId: row.id,
            user : loggedUser,
          }));
        }

      }
    }
    
    let { cotizadores, dateFilter } = useSelector(state => state.cotizadorStore);
    
    const handleCopyToClipboard = (value) => {
      navigator.clipboard.writeText(value);
    };

    const getPastelColor = () => {
      const hue = Math.floor(Math.random() * 360); // Selecciona un tono aleatorio
      return `hsl(${hue}, 70%, 85%)`; // 70% de saturación y 85% de luminosidad para colores suaves
    };

    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      {
        field: "image_usuario",
        headerName: "Usuario",
        width: 100,
        sortable: false,
        renderCell: (params) => {
          const imageUrl = URL + params.row.image_usuario;
          const fullName = params.row.nombre_usuario || "Usuario";
          const colorPunto = getPastelColor();

          const content = (
            <Tooltip title={fullName} arrow>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  alt={fullName}
                  src={imageUrl || ""}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 16,
                    bgcolor: "#2196f3",
                    cursor: "pointer",
                  }}
                >
                  {!imageUrl ? fullName[0] : ""}
                </Avatar>
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

          return renderCellWithSelections(params, content);
        },
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
        field: "etiquetaDos",
        headerName: "Etiqueta",
        width: 170,
        renderCell: (params) => {
          const colorFondoEtiqueta = params.row.color_etiqueta || "#ddd";
          const colorTexto = getContrastColor(colorFondoEtiqueta);

          const content = (
            <Chip
              style={{
                backgroundColor: colorFondoEtiqueta,
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
        field: "placa",
        headerName: "Placa",
        width: 150,
        renderCell: (params) => {
          const content = (
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
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "cilindraje",
        headerName: "Cilindraje",
        width: 150,
        renderCell: (params) => {
          const content = (
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
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "modelo",
        headerName: "Modelo",
        width: 150,
        renderCell: (params) => {
          const content = (
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
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "chasis",
        headerName: "Chasis",
        width: 180,
        renderCell: (params) => {
          const content = (
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
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "numeroDocumento",
        headerName: "Documento",
        width: 150,
        renderCell: (params) => {
          const content = (
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
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "nombreCompleto",
        headerName: "Nombre",
        width: 130,
        renderCell: (params) => {
          const content = (
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
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "telefono",
        headerName: "Teléfono ",
        width: 130,
        renderCell: (params) => {
          const content = (
            <>
              {params.value != "" ? (
                <Tooltip title="Copiar Teléfono">
                  <IconButton
                    aria-label="Copiar Teléfono"
                    onClick={() => handleCopyToClipboard(params.value)}
                    color="primary"
                    size="small"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {params.value}
            </>
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "correo",
        headerName: "Correo",
        width: 130,
        renderCell: (params) => {
          const content = (
            <>
              {params.value != "" ? (
                <Tooltip title="Copiar correo">
                  <IconButton
                    aria-label="Copiar correo"
                    onClick={() => handleCopyToClipboard(params.value)}
                    color="primary"
                    size="small"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {params.value}
            </>
          );

          return renderCellWithSelections(params, content);
        },
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 180,
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

            <Tooltip title="Pasar a Emision" arrow>
              <IconButton
                aria-label="Pasar a Emision"
                onClick={() => handleShowUserSelect(params.row)}
                color="warning"
              >
                <DoubleArrowIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar Registro" arrow>
              <IconButton
                aria-label="Eliminar Registro"
                onClick={() => handleDelete(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            {!dateFilter ? (
              <Tooltip title="Historia de registros" arrow>
                <IconButton
                  aria-label="Show"
                  onClick={() => handleShow(params.row.id)}
                  color="success"
                >
                  <ReceiptLongIcon />
                </IconButton>
              </Tooltip>
            ) : (
              ""
            )}
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
      toast(
        () => (
          <div>
            <p>¿Estás seguro de que deseas eliminar el cliente?</p>
            <button
              onClick={() => {
                confirmDelete(id); 
                toast.dismiss(); // cierra el toast manualmente
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
              onClick={() => toast.dismiss()} // cancelar
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
        { autoClose: false }
      );
    };

    // Lógica para confirmar la eliminación
    const confirmDelete = async (id, closeToast) => {
      await dispatch(deleteThunk(id, "cotizador"));
      
      if (typeof closeToast === "function") {
        closeToast(); // cerrar solo el toast actual
      } else {
        toast.dismiss(); // respaldo en caso de que no sea función
      }
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


  const [selectedCell, setSelectedCell] = useState({ rowId: null, field: null });

  const handleCellClick = (params) => {
    setSelectedCell({ rowId: params.id, field: params.field });
  };

  const enhancedColumns = columns.map((col) => ({
  ...col,
  cellClassName: (params) => {
    return selectedCell.rowId === params.id && selectedCell.field === col.field
      ? 'selected-cell'
      : '';
  },
}));

  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Filtros */}
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <FilterData cotizador="cotizador" />
        <DateRange cotizador="cotizador" />
      </Box>

      {/* Tabla */}
      <DataGrid
        rows={cotizadores}
        columns={enhancedColumns}
        onCellClick={(params, event) => {
          handleCellClick(params, event);
          handleCellClickWs(params.id, params.field);
        }}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          "& .even-row": { backgroundColor: "#f5f5f5" },
          "& .odd-row": { backgroundColor: "#ffffff" },
          "& .selected-cell": {
            border: "2px solid green",
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
      />
      
    </Box>
  );
}
