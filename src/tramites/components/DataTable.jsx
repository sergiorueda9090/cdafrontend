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
import WarningIcon from "@mui/icons-material/Warning";

import { Autocomplete, TextField } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, updateThunks }   from '../../store/cotizadorStore/cotizadorThunks';

import { useNavigate }              from 'react-router-dom';
import { URL } from '../../constants.js/constantGlogal';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { ToastContainer, toast, Bounce } from 'react-toastify';

import smallLoading from "../../assets/images/small_loading.gif";
import emptyDataTable from "../../assets/images/emptyDataTable.png";
import { getAllThunks as etiquetasAllThunks, handleFormStoreThunk, clearAllEtiquetas }  from '../../store/etiquetasStore/etiquetasThunks';

import { Chip } from "@mui/material";
// Habilitar el plugin de tiempo relativo
dayjs.extend(relativeTime);

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
    
    let { cotizadores } = useSelector(state => state.cotizadorStore);
   
    const [rows, setRows] = useState(cotizadores);

    const [editingField, setEditingField] = useState("");
    const [editingValue, setEditingValue] = useState("");

    const [idRow, setIdRow] = useState('');

    const [loading, setLoading] = useState(false);

    const processRowUpdate = async (newRow) => {
      const oldRow = cotizadores.find((row) => row.id === newRow.id);
    
      if (!oldRow) return newRow;
    
      const changedField = Object.keys(newRow).find((key) => oldRow[key] !== newRow[key]);
    
      if (changedField) {
        const newValue = newRow[changedField];
    
        let respuesta = true;
    
        if (changedField === "escribirlink") {
          try {
            respuesta = await handleConfirmar(`Esta seguro que la url es: ${newValue}`);
          } catch (error) {
            respuesta = false; // Manejar el error y establecer respuesta en false
          }
        }
    
    
        if (respuesta) {

          setEditingField(changedField);
          setEditingValue(newValue);
          
          let formValues = { [changedField]: newValue, 'id': newRow.id };

          if(changedField === "escribirlink"){
             formValues = { ['linkPago']: newValue, 'id': newRow.id };
          }
          
          dispatch(updateThunks(formValues, 'tramite'));
        }
      }
    
      return oldRow;
    };
    
    const handleCopyToClipboard = (text, id="") => {

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
              ❌ No Puedo Pagar RRR
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
          closeButton: false,
        });
  
        if (tiempoRestante <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    };
  
    const confirmarPago = async (idToast, id="") => {
      await toast.dismiss(idToast);
    
      await handleConfirmEmitido(id)
      
      await toast.success("✅ Pago confirmado con éxito.", {
        position: "bottom-right",
        autoClose: 5000,
      });
    
    };
  
    const noPuedePagar = async (idToast) => {
      await toast.dismiss(idToast);
      await setLoading(false)
      await toast.error("❌ No pudiste realizar el pago.", {
        position: "bottom-right",
        autoClose: 1500,
      });
    };


    const confirmDelete = (rowId) => {
      alert("llama el endpoint de elminar el archivo");
    }

    
    /* ====================== */

    /* ============== PRUEBAS ========== */
    let { etiquetas } = useSelector(state => state.etiquetasStore);
    let { etiqueta }  = useSelector(state => state.etiquetasStore);
    let { correo }    = useSelector(state => state.tramitesStore);

    const [rowsTest,  setRowsTest] = useState("");
    const [activeRow, setActiveRow] = useState(null);
   
    const handleCellClick = (id) => {
      handleCallEtiquetas();
      setActiveRow(id);
    };
    
    const handleSelectionChange = (id, newValue) => {
      dispatch(handleFormStoreThunk({name: 'etiqueta', value:newValue.nombre }));
      dispatch(updateThunks({ id:id, etiquetaDos: newValue.nombre}, 'tramite'));
      dispatch(clearAllEtiquetas())
    };
  

    const handleCallEtiquetas = () => {
      dispatch(etiquetasAllThunks());
    }

    const handleSaveCorreo = (correo = "") => {
      dispatch(handleFormStoreThunk({name: 'correo', value:correo }));
    }
    

    const EditableCell = ({ params }) => {
      const [valor, setValor] = useState(params.value || ""); // Estado local
    
      const handleBlur = async () => {    
        // Crear el nuevo objeto de fila con el valor actualizado
        const newRow = { ...params.row, escribirlink: valor };
    
        // Llamar a processRowUpdate con la nueva fila
        await processRowUpdate(newRow);
      };
      
      const isDisabled = !params.row.correo ||  params.row.etiquetaDos !== "LINK DE PAGO" || params.row.linkPago; 
      
      return isDisabled ? (
        <div>{params.row.linkPago || "No disponible"}</div> // Muestra el link o un texto por defecto
      ) : (
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={handleBlur} // Llamar a processRowUpdate al perder el foco
          style={{
            width: "100%",
            padding: "5px",
            border: "1px solid gray",
            backgroundColor: "white",
          }}
        />
      );
    };
    
    /* ============== END PRUEBAS ========== */
    const columns = [
      { field: 'id',              headerName: 'ID',                 width: 80},
      {
        field: 'fechaTramite',
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
      {
        field: 'etiquetaDos',
        headerName: 'etiqueta SELECT',
        width: 250,
        renderCell: (params) => {
          const isActive = activeRow === params.id; // Verifica si esta celda está activa
          return (
            <Box width="100%">
            {isActive && etiquetas.length > 0 ? (
              <Autocomplete
                options={etiquetas}
                getOptionLabel={(option) => option.nombre}
                value={etiquetas.find((option) => option.nombre == etiqueta) || null} // Encuentra el objeto correspondiente
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleSelectionChange(params.id, newValue);
                  } else {
                    handleCallEtiquetas(); // Manejo cuando se borra la selección
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Seleccione una Etiqueta"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    autoFocus
                  />
                )}
                fullWidth
              />
            ) : (
              <Chip
                onClick={params.value == "LINK DE PAGO" ? undefined : () => handleCellClick(params.id)}
                label={params.value ? params.value : "Seleccionar Etiqueta"}
                style={{
                  backgroundColor: "#262254",
                  color: "#ffffff",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  width: "100%",
                  cursor: params.value == "LINK DE PAGO" ? "default" : "pointer",
                  opacity: params.value == "LINK DE PAGO" ? 0.6 : 1, // Opcional: Reduce la opacidad si está deshabilitado
                }}
              />
            )}
          </Box>
          );
        },
      },
      {
        field: "escribirlink",
        headerName: "Escribir link",
        width: 200,
        editable: false, // Manejo manual con el input
        renderCell: (params) => <EditableCell params={params} />,
      },
      {
        field: "linkPago",
        headerName: "Link de Pago",
        width: 200,
        renderCell: (params) => {
        
          const handleCopy = () => {
            if (!params.row.correo || params.row.correo.trim() === "") {
              toast.error("❌ El correo es obligatorio para confirmar el pago.", {
                position: "bottom-right",
                autoClose: 5000,
              });
              return; // Detiene la ejecución si el correo es inválido
            }

            let url = params.value;

            // Check if the URL starts with "https://", if not, prepend it
            if (!url.startsWith("https://")) {
                url = `https://${url}`;
            }

            setIdRow(params.row.id);

            setLoading(true); // Muestra la imagen de carga

            handleCopyToClipboard(params, params.id);

            setTimeout(() => setLoading(false), 180000); // Simula un tiempo de espera

            navigator.clipboard.writeText(params.value).then(() => {
              window.open(`${url}`, "_blank");
            }).catch(err => {
              console.error("Error al copiar:", err);
              setLoading(false);
            });

          };
    
          return (
            <>
              {params.value && (
                <>
                  {!loading ? (
                    <Tooltip title="Copiar link de pago">
                      <IconButton
                        aria-label="Copiar link de pago"
                        onClick={handleCopy}
                        color="success"
                        size="small"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  ) : idRow === params.row.id ? (
                    <Tooltip title="Link de pago copiado">
                      <img
                        src={smallLoading}
                        alt="Cargando"
                        style={{ width: 24, height: 24 }}
                      />
                    </Tooltip>
                  ) : (<Tooltip title="Copiar link de pago">
                    <IconButton
                      aria-label="Copiar link de pago"
                      onClick={handleCopy}
                      color="success"
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>)}
                </>
              )}
            </>
          );
        },
      },
      {
        field: "correo",
        headerName: "Email",
        width: 200,
        editable: true,
        renderCell: (params) => (
          <>
            {params.value ? (
              <Tooltip title="Copiar Email">
                <IconButton
                  aria-label="Copiar Email"
                  onClick={() => handleCopyToClipboard(params.value)}
                  color="primary"
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Correo no disponible">
                <WarningIcon color="error" fontSize="small" />
              </Tooltip>
            )}
            {params.value || "No disponible"}
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
              const tipoDocumentoOptions = [
                { value: "Cedula", label: "Cédula", abbr: "CC" },
                { value: "Pasaporte", label: "Pasaporte", abbr: "PP" },
                { value: "Tarjeta de Identidad", label: "Tarjeta de Identidad", abbr: "TI" },
                { value: "Número de Identificación Tributaria", label: "NIT", abbr: "NIT" },
                { value: "Cédula de Extranjería", label: "Cédula de Extranjería", abbr: "CE" },
                { value: "Permiso por Protección Temporal", label: "Permiso P. Temporal", abbr: "PPT" }
              ];
          
              // Buscar la abreviatura correspondiente al valor de `params.value`
              const documento = tipoDocumentoOptions.find(doc => doc.value === params.value);
              const abbr = documento ? documento.abbr : params.value; // Si no encuentra, usa el valor original
          
              const isNotCC = abbr !== "CC"; // Mostrar punto rojo si NO es "CC"
          
              return (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>{abbr}</span>
                  {isNotCC && (
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: "red",
                        display: "inline-block",
                      }}
                    ></span>
                  )}
                </div>
              );
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
          { field: 'telefono',  headerName: 'Teléfono',  width: 130, editable: true,  
            renderCell: (params) => (
              <>
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
          {/* Botón de Editar 
          <Tooltip title="Editar" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>*/}
    
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
          { 
          params.row.correo != "" && params.row.etiquetaDos != "LINK DE PAGO"? 
          <>
            <Tooltip title="Emitido" arrow>
            <IconButton
              aria-label="emitido"
              onClick={() => handleConfirmEmitido(params.row.id)}
              color="success"
            >
              <AssignmentTurnedInIcon />
            </IconButton>
          </Tooltip>
          </>:''
          }
        </>
        ),
      },
    ];
    

    const handleShow = async(id) => {
      navigate(`/tramites/PageShow/${id}`);
    };

    const handleConfirmEmitido = async(id) => {

      await dispatch(updateThunks({ id, confirmacionPreciosModulo: 1, cotizadorModulo:0, pdfsModulo:1, tramiteModulo:0 }, 'tramite'));
      
      //navigate('/confirmacionprecios')
    
    }
    
    const paginationModel = { page: 0, pageSize: 15 };
    
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

    // Función para manejar la edición
    const handleEdit = async (row) => {
      await dispatch(showThunk(row.id));
    };

    const handleConfirmar = (txt="") => {
      return new Promise((resolve) => {
        // Mostrar la notificación con opciones de confirmación
        toast(
          ({ closeToast }) => (
            <div>
              <p>{txt}</p>
              <button
                onClick={() => {
                  resolve(true); // Confirmar eliminación y resolver la promesa con true
                  closeToast(); // Cierra el toast
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
                Sí, Confirmar.
              </button>
              <button
                onClick={() => {
                  resolve(false); // Cancelar eliminación y resolver la promesa con false
                  closeToast(); // Cierra el toast
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
      });
    };

  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>
          
      <ToastContainer />

      {/* Contenedor de filtros */}
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <FilterData cotizador="tramite"/>  {/* Componente de filtros adicionales buscar */}
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
        slots={{
          noRowsOverlay: NoRowsOverlay, // Personaliza el estado sin datos
        }}
        //onCellEditCommit={handleEditCellCommit}
      />
    </Paper>
  );
}
