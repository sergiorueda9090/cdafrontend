import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip, CircularProgress, Avatar, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { Autocomplete, TextField } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icono de confirmación
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { getAllCotizadorConfirmacionPreciosAddThunks, getAllCotizadorConfirmacionPreciosRemoveThunks, showThunk, updateThunks } from '../../store/cotizadorStore/cotizadorThunks';
import { getAllThunks as getAllTarjetas, handleFormStoreThunk, handleDisplayAllTarjetasThunk } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';
import { handleFormStoreThunk as handleFormStoreThunkCotizador, update_cotizador_devolver } from '../../store/cotizadorStore/cotizadorThunks';
import { clearAllProveedores, handleFormStoreThunk as handleFormStoreThunkProveedores, getAllThunks as getAllProveedores } from '../../store/proveedoresStore/proveedoresThunks';

import { useNavigate }              from 'react-router-dom';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import emptyDataTable from "../../assets/images/emptyDataTable.png"

import { Chip } from "@mui/material";
import { handleFormColumnsConfirmacionPrecioStore } from '../../store/proveedoresStore/proveedoresStore';

import { URL, URLws } from '../../constants.js/constantGlogal';

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


export function DataTable({loggedUser}) {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    let { cotizadores, idBanco }          = useSelector(state => state.cotizadorStore);
    let { tarjetasBancarias, banco }      = useSelector(state => state.registroTarjetasStore);
    let { proveedores, etiqueta, id: idProveedor, defaultProv, columnsConfirmacionPrecios } = useSelector( state => state.proveedoresStore);

    const [rows, setRows] = useState(cotizadores);
    const [activeRow, setActiveRow] = useState(null); // Guarda la fila activa


    useEffect(() => {
      setRows(cotizadores);
    }, [cotizadores]);
   
    const handleCellClick = (rowId) => {
      setActiveRow(rowId); // Activa solo la celda seleccionada
    };

    const handleBlur = () => {
      setActiveRow(null); // Cierra el Autocomplete al hacer clic afuera
    };
    

    const [selectedRow, setSelectedRow]     = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({}); // Estado para archivos subidos

    const fileInputRef = useRef(null);

    const [fileUpload, setFileUpload] = useState({});


    const handleUpload = (event) => {
      
      const file = event.target.files[0];

        setFileUpload((prev) => ({
          ...prev,
          [selectedRow.id]: file, // Almacenar el nombre del archivo
        }));

      if (file && selectedRow) {

        toast.success(`Archivo ${file.name} subido.`)
   
        // Guardar en el estado que el archivo fue subido para este ID
        setUploadedFiles((prev) => ({
          ...prev,
          [selectedRow.id]: file.name, // Almacenar el nombre del archivo
        }));
  
        // Limpiar el input después de seleccionar el archivo
        fileInputRef.current.value = "";

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: "update_archivo",
              rowId: selectedRow.id,
              action: "upload",       // puede ser "upload" o "confirmar"
              user: loggedUser,
              value: file.name,
            }));
          }
        
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

      if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "delete_local_file",
              rowId: rowId,
              user: loggedUser, // <-- acá pasas el usuario o ID según tu lógica
            })
          );
        }

      toast.info("Archivo eliminado, puedes subir uno nuevo.");
    }

    const handleShowAllTarjetas = () => {
      dispatch(getAllTarjetas())
    }

    const handleDisplayAllTarjetas = () => {
      dispatch(handleDisplayAllTarjetasThunk())
    }

    const handleShowAllProveedores = () => {
      dispatch(clearAllProveedores())
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

    const handleDevolverConfirmar = (data) => {
      dispatch(update_cotizador_devolver({'id':data.id, 'devolver':data.devolver}))
    }

    const getPastelColor = () => {
      const hue = Math.floor(Math.random() * 360); // Color aleatorio en el espectro HSL
      return `hsl(${hue}, 70%, 85%)`; // Colores suaves
    };

        /************************************
        ******** START WEBSOCKET ********
        * ******************************** */
        const { token } = useSelector((state) => state.authStore);
    
        const [ws, setWs] = useState(null);
        const [cellSelections, setCellSelections] = useState({});
        const [rowSelections, setRowSelections]    = useState({});
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

          const handleUpdateProveedores = (message) => {
            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === message.rowId
                  ? { ...row, proveedores: message.value.nombre } // si en rows guardas solo el nombre
                  : row
              )
            );

            // 🔑 También actualizamos columnsConfirmacionPrecios (para el renderCell)
            dispatch(handleFormColumnsConfirmacionPrecioStore({
              name: "columnsConfirmacionPrecios",
              value: {
                id_row: message.rowId,
                idProveedor: message.value.idProveedor,
                nombre: message.value.nombre,
                etiqueta: message.value.etiqueta,
              },
            }));
          };

          const handleUpdateComisionProveedor = (message) => {
            setComisiones((prev) => ({
              ...prev,
              [message.rowId]: message.value,
            }));

            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === message.rowId
                  ? { ...row, comisionProveedor: message.value }
                  : row
              )
            );
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

          const handleDeleteArchivo = (message) => {
            setUploadedFiles((prev) => {
              const newFiles = { ...prev };
              delete newFiles[message.rowId];
              return newFiles;
            });

            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === message.rowId ? { ...row, archivo: null } : row
              )
            );
          };

          const handleRefreshConfirmacionRequest = (message) => {
              setTimeout(() => {
                 dispatch(getAllCotizadorConfirmacionPreciosRemoveThunks(message.rowId));
                 dispatch(getAllCotizadorConfirmacionPreciosAddThunks(message.rowId));
              }, 600);
          };

          const handleUpdateTarjeta = (message) => {
            console.log("Evento recibido en frontend:", message);

            // Actualizamos rows
            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === message.rowId
                  ? { ...row, idBanco: message.value.idBanco, banco: message.value.banco }
                  : row
              )
            );

            // 🔑 También actualizamos columnsConfirmacionPrecios
            dispatch(
              handleFormColumnsConfirmacionPrecioStore({
                name: "columnsConfirmacionPrecios",
                value: {
                  id_row: message.rowId,
                  idBanco: message.value.idBanco,
                  banco: message.value.banco,
                  etiqueta: message.value.etiqueta || "seguros generales", // 👈 importante
                },
              })
            );
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
              case "update_proveedores":
                handleUpdateProveedores(message);
                break;
              case "update_comision_proveedor":  // 👈 Nuevo evento
                handleUpdateComisionProveedor(message);
                break;
              case "update_archivo":
                handleUpdateArchivo(message);
                break;
              case "delete_local_file": // 👈 Nuevo caso
                handleDeleteArchivo(message);
                break;
              case "refresh_request_cotizador": // 👈 Nuevo caso
                handleRefreshConfirmacionRequest(message);
                break;
              case "update_tarjeta":
                handleUpdateTarjeta(message);
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
    
            if (ws && ws.readyState === WebSocket.OPEN) {
          
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

      const [comisiones, setComisiones] = useState({});

      const handleComisionChange = (event, id) => {

        let value = event.target.value.replace(/\D/g, ''); // Permite solo números
        value = Number(value).toLocaleString('es-CO'); // Formato moneda COP
      
        setComisiones((prev) => ({
          ...prev,
          [id]: value, // Solo actualiza la fila seleccionada
        }));


        let dataConfirmacionPrecios = {
          id_row            : activeRow,
          comisionProveedor : value,
        }

        dispatch(handleFormColumnsConfirmacionPrecioStore({
                                                              name: 'columnsConfirmacionPrecios',
                                                              value: dataConfirmacionPrecios
                                                            }));
        console.log("ws ",ws)
        console.log("ws.readyState ",ws.readyState)
        console.log("📤 Enviando update_comision_proveedor: ",WebSocket.OPEN)
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: "update_comision_proveedor",
              rowId: id,
              value: value,
              user: loggedUser, // quien hizo el cambio
            }));
        }

      };
    const columns = [
      { field: 'id',                    headerName: 'ID',              width: 90},
      {
        field: 'fechaTramite',
        headerName: 'Fecha',
        width: 160,
        valueFormatter: (params) => {
          if (!params) return "";
          const date = new Date(params);
          return (
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0") + " " +
            String(date.getHours()).padStart(2, "0") + ":" +
            String(date.getMinutes()).padStart(2, "0") + ":" +
            String(date.getSeconds()).padStart(2, "0")
          );
        }
      },
      {
        field: "nombre_cliente",
        headerName: "Cliente",
        width: 150,
        renderCell: (params) => {
          const colorFondo = params.row.color_cliente || "#ddd"; // Usa color_cliente o un color por defecto
          const colorTexto = getContrastColor(colorFondo); // Color de texto calculado
          const content = (
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
          return renderCellWithSelections(params, content);
        },
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
          const content = (
            <span>
              {params.value}
            </span>
          );
          return renderCellWithSelections(params, content);
        }
      },
      {
        field: 'cilindraje',
        headerName: 'Cilindraje',
        width: 150,
        renderCell: (params) => {
          const content = (
            <span>
              {params.value}
            </span>
          );
          return renderCellWithSelections(params, content);
        }
      },
      {
        field: 'modelo',
        headerName: 'Modelo',
        width: 130,
        renderCell: (params) => {
          const content = (
            <span>
              {params.value}
            </span>
          );
          return renderCellWithSelections(params, content);
        }
      },
      {
        field: 'proveedores',
        headerName: 'Proveedores',
        width: 250,
        editable: false,
        renderCell: (params) => {
          const isActive = activeRow === params.id;
          const proveedorAsignado = columnsConfirmacionPrecios.find(item => item.id_row === params.id);
          const proveedorSeleccionado = proveedorAsignado
            ? { id: proveedorAsignado.idProveedor, nombre: proveedorAsignado.nombre }
            : null;

          const content = (
            <Box width="100%">
              {isActive && proveedores.length > 0 ? (
                <Autocomplete
                  options={proveedores}
                  getOptionLabel={(option) => option.nombre}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  value={proveedorSeleccionado}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      dispatch(
                        handleFormColumnsConfirmacionPrecioStore({
                          name: "columnsConfirmacionPrecios",
                          value: {
                            id_row: params.id,
                            idProveedor: newValue.id,
                            nombre: newValue.nombre,
                            etiqueta: newValue.etiqueta_nombre,
                          },
                        })
                      );

                      if(ws && ws.readyState === WebSocket.OPEN) {
                        console.log("📤 Enviando update_etiqueta:", {
                          rowId: params.id,
                          value: newValue.nombre,
                        });

                        ws.send(JSON.stringify({
                          type: "update_proveedores",
                          user: loggedUser,
                          rowId: params.id,
                          value: {
                            idProveedor: newValue.id,
                            nombre: newValue.nombre,
                            etiqueta: newValue.etiqueta_nombre,
                          },
                        }));
                      
                      }

                    } else {
                      handleShowAllProveedores();
                    }
                  }}
                  renderInput={(paramsInput) => (
                    <TextField
                      {...paramsInput}
                      variant="standard"
                      placeholder="Seleccione proveedor"
                      autoFocus
                    />
                  )}
                  fullWidth
                  clearOnEscape
                  clearText="Limpiar"
                  disableClearable={false}
                />
              ) : (
                <Chip
                  label={proveedorSeleccionado?.nombre || "Seleccione proveedor"}
                  style={{
                    backgroundColor: "#262254",
                    color: "#ffffff",
                    padding: "5px",
                    borderRadius: "5px",
                    textAlign: "center",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(getAllProveedores());
                    handleCellClick(params.id);
                  }}
                />
              )}
            </Box>
          );

          return renderCellWithSelections(params, content);
        },
      },
      {
        field: 'comisionProveedor',
        headerName: 'Comisión Proveedor',
        width: 180,
        renderCell: (params) => {
          const proveedorAsignado = columnsConfirmacionPrecios.find(item => item.id_row === params.id);
          const etiqueta = proveedorAsignado ? proveedorAsignado.etiqueta : '';

          // 🔑 Mostrar primero el estado local (si lo hay) o el valor del row recibido en WS
          const value = comisiones[params.id] ?? params.row.comisionProveedor ?? '';

          const content = (etiqueta && (etiqueta === 'Elvin' || etiqueta === 'AMALFI')) ? (
            <input 
              type="text"
              name="comisionProveedor"
              value={value}
              onChange={(event) => handleComisionChange(event, params.id)}
              placeholder="Ingrese la comisión"
              style={{ 
                width: '100%', 
                textAlign: 'right', 
                border: 'none', 
                background: 'transparent' 
              }}
            />
          ) : (
            <span>0</span>
          );

          return renderCellWithSelections(params, content);
        },
      },
      {
        field: 'precioDeLey',
        headerName: 'Precio de ley',
        width: 130,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => {
          const content = (
            <span style={{ width: "100%", textAlign: "right", display: "block" }}>
              {params.value}
            </span>
          );
          return renderCellWithSelections(params, content);
        }
      },
      {
        field: 'comisionPrecioLey',
        headerName: 'Comisión',
        width: 130,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => {
          const content = (
            <span style={{ width: "100%", textAlign: "right", display: "block" }}>
              {params.value}
            </span>
          );
          return renderCellWithSelections(params, content);
        }
      },
      {
        field: 'total',
        headerName: 'Total',
        width: 130,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => {
          const formattedValue =
            params.value == null
              ? ""
              : new Intl.NumberFormat("es-CO", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(params.value);

          const content = (
            <span style={{ width: "100%", textAlign: "right", display: "block" }}>
              {formattedValue}
            </span>
          );

          return renderCellWithSelections(params, content);
        }
      },
      {
        field: 'tarjetas',
        headerName: 'Tarjetas',
        width: 250,
        editable: false,
        renderCell: (params) => {
          const isActive = activeRow === params.id;

          const proveedorAsignado = columnsConfirmacionPrecios.find(
            (item) => item.id_row === params.id
          );

          const etiqueta = proveedorAsignado?.etiqueta?.toLowerCase() || "";
          const bancoAsignadoId = proveedorAsignado ? proveedorAsignado.idBanco : "";
          

          const tarjetaSeleccionada =
            tarjetasBancarias.find((option) => option.id === bancoAsignadoId) || null;

          const content = (
            <Box width="100%">
              {isActive && tarjetasBancarias.length > 0 ? (
                <Autocomplete
                  options={tarjetasBancarias}
                  getOptionLabel={(option) => option.nombre_cuenta}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  value={tarjetaSeleccionada}
                  onChange={(_, newValue) => {
                    if (etiqueta === "seguros generales") {
                      if (newValue) {
                        dispatch(
                          handleFormColumnsConfirmacionPrecioStore({
                            name: "columnsConfirmacionPrecios",
                            value: {
                              id_row: params.id,
                              idBanco: newValue.id,
                              banco: newValue.nombre_cuenta,
                            },
                          })
                        );

                      if (ws && ws.readyState === WebSocket.OPEN) {
                          ws.send(
                            JSON.stringify({
                              type: "update_tarjeta",
                              rowId: params.id,
                              value: {
                                idBanco: newValue.id,
                                banco: newValue.nombre_cuenta,
                              },
                              user: loggedUser,
                            })
                          );
                        }

                      } else {
                        dispatch(
                          handleFormColumnsConfirmacionPrecioStore({
                            name: "columnsConfirmacionPrecios",
                            value: {
                              id_row: params.id,
                              idBanco: null,
                              banco: null,
                            },
                          })
                        );

                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(
                              JSON.stringify({
                                type: "update_tarjeta",
                                rowId: params.id,
                                value: { idBanco: null, banco: null },
                                user: loggedUser,
                              })
                            );
                          }
                        handleDisplayAllTarjetas();
                      }
                    }
                  }}
                  renderInput={(paramsInput) => (
                    <TextField
                      {...paramsInput}
                      variant="standard"
                      placeholder={
                        etiqueta === "seguros generales"
                          ? "Seleccione una tarjeta"
                          : "No disponible"
                      }
                      autoFocus
                    />
                  )}
                  fullWidth
                  clearOnEscape
                  disableClearable={false}
                  disabled={etiqueta !== "seguros generales"}
                />
              ) : (
                <Chip
                  label={
                    etiqueta === "seguros generales"
                      ? tarjetaSeleccionada?.nombre_cuenta || "Seleccionar Tarjeta"
                      : "No disponible"
                  }
                  style={{
                    backgroundColor: "#262254",
                    color: "#ffffff",
                    padding: "5px",
                    borderRadius: "5px",
                    textAlign: "center",
                    width: "100%",
                    cursor: etiqueta === "seguros generales" ? "pointer" : "not-allowed",
                    opacity: etiqueta === "seguros generales" ? 1 : 0.6,
                  }}
                  onClick={() => {
                    if (etiqueta === "seguros generales") {
                      handleShowAllTarjetas();
                      handleCellClick(params.id);
                    }
                  }}
                />
              )}
            </Box>
          );

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
          const archivoFile = params.row.archivo;

          const proveedorAsignado = columnsConfirmacionPrecios.find(
            (item) => item.id_row === params.id
          );

          const etiqueta = proveedorAsignado?.etiqueta?.toLowerCase() || "";
          const bancoAsignadoId = proveedorAsignado ? proveedorAsignado.idBanco : "";
          const comisionProveedor = proveedorAsignado?.comisionProveedor ?? "";

          const content = (
            <>
              <IconButton
                aria-label="edit"
                onClick={() => handleEdit(params.row)}
                color="primary"
              >
                <EditIcon />
              </IconButton>

              {/* Subir archivo SOLO si no hay archivo cargado */}
              {!archivoFile && !isFileUploaded && (
                <Tooltip title="Subir Image">
                  <IconButton
                    aria-label="upload"
                    color="primary"
                    onClick={() => handleOpenFileDialog(params.row)}
                  >
                    <UploadFileIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Volver al valor anterior */}
              <Tooltip title="Volver al valor anterior" arrow>
                <IconButton
                  aria-label="Volver al valor anterior"
                  onClick={() =>
                    handleDevolver({ id: params.row.id, devolver: "confirmarprecio" })
                  }
                  color="info"
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              {isFileUploaded ? (
              <>
                <Tooltip title={`Archivo subido: ${isFileUploaded}`}>
                  <IconButton aria-label="file-uploaded" color="success">
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
              </>
            ) : archivoFile ? (
              <Tooltip title="Eliminar archivo local">
                <IconButton
                  aria-label="delete-file"
                  color="error"
                  onClick={() => handleDeleteFile(params.row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            ) : null}


              {/* Confirmar */}
              {(() => {
                const label = etiqueta?.toLowerCase();
                let canConfirm = false;

                if (label === "seguros generales") {
                  canConfirm = !!bancoAsignadoId;
                } else if (label === "amalfi" || label === "elvin") {
                  canConfirm =
                    comisionProveedor !== "" &&
                    comisionProveedor !== undefined &&
                    comisionProveedor !== null;
                } else if (label) {
                  canConfirm = true;
                }

                return canConfirm ? (
                  <Tooltip title="Confirmar">
                    <IconButton
                      aria-label="confirmar-archivo"
                      color="success"
                      disabled={isDisabled}
                      onClick={() =>
                        handleUploadFile(params.row.id, "confirmar")
                      }
                    >
                      <AutoStoriesIcon />
                    </IconButton>
                  </Tooltip>
                ) : null;
              })()}
            </>
          );

          return renderCellWithSelections(params, content);
        },
      }

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
    /*const confirmDelete = async (id, closeToast) => {
      await dispatch(deleteThunk(id));
      closeToast(); // Cerrar la notificación
    };*/

    const handleShow = async(id) => {
      navigate(`/tramites/PageShow/${id}`);
    };

    const [isDisabled, setIsDisabled] = useState(false);

    const handleUploadFile = (id, confirmar="") => {
      setIsDisabled(true);
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas confirmar la subida del documento y continuar?</p>
            <button
              onClick={() => {
                closeToast();
                handleUploadFileConfirmar(id, confirmar); // Confirmar eliminación
                setIsDisabled(false);
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
  
              onClick={() => {
                closeToast();
                setIsDisabled(false);
              }}

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

    const handleUploadFileConfirmar = (id, confirmar='') => {
    
      let comisionproveedor = columnsConfirmacionPrecios.filter(item => item.id_row === id)[0]?.comisionProveedor || 0;
      let etiqueta          = columnsConfirmacionPrecios.filter(item => item.id_row === id)[0]?.etiqueta || '';
      let idBanco           = columnsConfirmacionPrecios.filter(item => item.id_row === id)[0]?.idBanco || '';
      let idProveedor       =  columnsConfirmacionPrecios.filter(item => item.id_row === id)[0]?.idProveedor || '';  

      let etiquetaNombre    = columnsConfirmacionPrecios.filter(item => item.id_row === id)[0] || '';
      console.log(" === etiquetaNombre === ",etiquetaNombre.etiqueta)


      // Si no existe o es vacío, asignar "0"
      //let comisionRaw = comisionproveedor[0] ? comisionproveedor[0] : "0"; sergio
      let comision = 0;

      if(comisionproveedor == "" || comisionproveedor == undefined){
      
        comisionproveedor = "0";
      
      }else{
      
        comision = parseFloat(comisionproveedor.replace(/\./g, ''));
      
        if (etiqueta.toLowerCase() != "seguros generales"){
      
          comision = -Math.abs(comision); // Asegura que sea negativo
      
        }
      
      }

      if(etiquetaNombre.etiqueta && (etiquetaNombre.etiqueta.toLowerCase() === 'elvin' || etiquetaNombre.etiqueta.toLowerCase() === 'amalfi')){

        if(comision == "0"){
          alert("Por favor ingresa una comisión");
          return;
        }

      }
       
      if (etiqueta.toLowerCase() != "seguros generales"){
          comision = -Math.abs(comision); // Asegura que sea negativo
      }

      let dataSend = {
        id_row            : id,
        comisionProveedor : comisionproveedor,
        comision          : comision,
        etiqueta          : etiqueta,
        idBanco           : idBanco,
        idProveedor       : idProveedor
      }

    const entries = Object.entries(fileUpload); // [[13, File], [12, File], ...]
    const file = entries.find(([key]) => Number(key) === id)?.[1];

      if (!file) {
        alert("Por favor selecciona una imagen.");
        return;
    }

      const allowedImageTypes = [
                                  'image/jpeg',
                                  'image/png',
                                  'image/gif',
                                  'image/webp',
                                  'image/svg+xml'
                                ];

      const fileName      = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

      if (!allowedImageTypes.includes(file.type)) {
        alert("Por favor sube solo archivos de imagen (JPEG, PNG, GIF, WEBP o SVG).");
        return;
      }

      // Validación adicional por extensión (opcional)
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Tipo de archivo no permitido. Sube solo imágenes con extensión .jpg, .jpeg, .png, .gif, .webp o .svg");
        return;
      }

      if (!idBanco && etiqueta == "seguros generales") {
        alert("Por favor selecciona un Tarjeta.");
        return;
      }

      if (!idProveedor) {
        alert("Por favor selecciona un proveedor.");
        return;
      }

      dispatch(updateThunks(
                              {
                                  id,
                                  archivo: file,
                                  idBanco: idBanco,
                                  confirmacionPreciosModulo: 0,
                                  cotizadorModulo : 0,
                                  pdfsModulo      : 1,
                                  tramiteModulo   : 0,
                                  idProveedor       : idProveedor,
                                  comisionproveedor : comision
                              },
                              'confirmarprecio',
                              confirmar
                          ));

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "refresh_request_cotizador",
        rowId: id,
        ser: loggedUser,
      }));
    }

    
    }
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };


  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

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
