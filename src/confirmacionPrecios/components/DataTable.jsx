import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip, CircularProgress } from "@mui/material";
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

import { showThunk, updateThunks } from '../../store/cotizadorStore/cotizadorThunks';
import { getAllThunks as getAllTarjetas, handleFormStoreThunk, handleDisplayAllTarjetasThunk } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';
import { handleFormStoreThunk as handleFormStoreThunkCotizador, update_cotizador_devolver } from '../../store/cotizadorStore/cotizadorThunks';
import { clearAllProveedores, handleFormStoreThunk as handleFormStoreThunkProveedores, getAllThunks as getAllProveedores } from '../../store/proveedoresStore/proveedoresThunks';

import { useNavigate }              from 'react-router-dom';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
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
    
    let { cotizadores, archivo, idBanco } = useSelector(state => state.cotizadorStore);
    let { tarjetasBancarias, banco }      = useSelector(state => state.registroTarjetasStore);
    let { proveedores, nombre, etiqueta, id: idProveedor } = useSelector( state => state.proveedoresStore);

    const [comisiones, setComisiones] = useState({});

    const handleComisionChange = (event, id) => {
      let value = event.target.value.replace(/\D/g, ''); // Permite solo números
      value = Number(value).toLocaleString('es-CO'); // Formato moneda COP
    
      setComisiones((prev) => ({
        ...prev,
        [id]: value, // Solo actualiza la fila seleccionada
      }));
    };
    

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


    const [editingRowId, setEditingRowId] = useState(null);
  
    const handleShowAllTarjetas = () => {
      dispatch(getAllTarjetas())
    }

    const handleDisplayAllTarjetas = () => {
      dispatch(handleDisplayAllTarjetasThunk())
    }

    const handleShowAllProveedores = () => {
      dispatch(clearAllProveedores())
    }

  
    const handleSelectionChange = (id, newValue) => {
      console.log(" id ",id)
      console.log(" newValue ",newValue)
      if(newValue){
        dispatch(handleFormStoreThunk({name: 'banco', value:newValue.nombre_cuenta }));
        dispatch(handleFormStoreThunkCotizador({name: 'idBanco', value:id }));
      }else{
        dispatch(handleFormStoreThunk({name: 'banco', value:"" }));
        dispatch(handleFormStoreThunkCotizador({name: 'idBanco', value:"" }));
      }

    };

    const handleProveedorSelectionChange = (id, newValue) => {
      console.log("newValue sss ",newValue)
      if(newValue){
        dispatch(handleFormStoreThunkProveedores({name: 'nombre',    value:newValue.nombre }));
        dispatch(handleFormStoreThunkProveedores({name: 'etiqueta',  value:newValue.etiqueta_nombre }));
        dispatch(handleFormStoreThunkProveedores({name: 'id',        value:id }));

      }else{
        dispatch(handleFormStoreThunkProveedores({name: 'nombre',    value:"" }));
        dispatch(handleFormStoreThunkProveedores({name: 'etiqueta',  value:"" }));
        dispatch(handleFormStoreThunkProveedores({name: 'id',        value:"" }));

      }
    };

    const [activeRow, setActiveRow] = useState(null); // Guarda la fila activa

    const handleCellClick = (rowId) => {
      setActiveRow(rowId); // Activa solo la celda seleccionada
    };

    const handleBlur = () => {
      setActiveRow(null); // Cierra el Autocomplete al hacer clic afuera
    };
    console.log(" ==== nombre ==== ",nombre)
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
        
    const esEditable = etiqueta?.toUpperCase() === 'AMALFI' || etiqueta?.toUpperCase() === 'ELVIN';

    
    const columns = [
      { field: 'id',                    headerName: 'ID',              width: 90},
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
      { field: 'placa',                 headerName: 'Placa',           width: 130 },
      /*{ field: 'numeroDocumento',       headerName: 'Documento',     width: 150 },
      { field: 'nombreCompleto',        headerName: 'Nombre',          width: 130 },*/
      { field: 'cilindraje',            headerName: 'Cilindraje',      width: 150 },
      { field: 'modelo',                headerName: 'Modelo',          width: 130 },
      {
        field: 'proveedores',
        headerName: 'Proveedores',
        width: 250,
        editable: false, // Porque manejamos la edición manualmente
        renderCell: (params) => {
          const isActive = activeRow === params.id;

          return (
            <Box width="100%">
              {isActive && proveedores.length > 0 ? (
                <Autocomplete
                  options={proveedores}
                  getOptionLabel={(option) => option.nombre}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  value={
                    proveedores.find((option) => option.nombre === nombre) || null
                  }
                  onChange={(_, newValue) => {
                    if (newValue) {
                      handleProveedorSelectionChange(newValue.id, newValue);

                      const comisionColumn = columns.find(col => col.field === 'comisionProveedor');
                      if (comisionColumn) {
                        comisionColumn.editable = newValue.nombre === 'Link de Pago';
                      }
                    } else {
                      handleProveedorSelectionChange(null, null);
                      handleShowAllProveedores();
                    }
                  }}
                  renderInput={(paramsInput) => (
                    <TextField
                      {...paramsInput}
                      variant="standard"
                      placeholder="Seleccione un Proveedor"
                      autoFocus
                      // vuelve a mostrar el chip si pierde el foco
                    />
                  )}
                  fullWidth
                  clearOnEscape
                  clearText="Limpiar"
                  disableClearable={false}
                />
              ) : (
                <Chip
                    label={
                      nombre && nombre !== ""
                        ? nombre
                        : "Seleccione un Proveedor"
                    }
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
                    handleCellClick(params.id); // activa edición solo cuando se hace clic en el chip
                  }}
                />
              )}
            </Box>
          );
        },
      },     
      {
        field: 'comisionProveedor',
        headerName: 'Comisión Proveedor',
        width: 180,
        renderCell: (params) => {
          console.log("activeRow ",activeRow)
          console.log("params.id ",params.id)
          return esEditable && activeRow == params.id? (
            <input 
              type="text"
              value={comisiones[params.id] || ''}
              onChange={(event) => handleComisionChange(event, params.id)}
              placeholder="Ingrese la comisión"
              style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent' }}
            />
          ) : (
            <span>0</span> // Si no es editable, muestra "0"
          );
        },
      },
    { field: 'precioDeLey',           headerName: 'Precio de ley',   width: 130, align: "right", headerAlign: "right" },
      { field: 'comisionPrecioLey',     headerName: 'Comision',        width: 130, align: "right", headerAlign: "right" },
      {
        field: 'total',
        headerName: 'Total',
        width: 130,
        align: "right", headerAlign: "right",
        valueFormatter: (params) => {
          if (params == null) return ''; // Manejo de valores nulos
          return new Intl.NumberFormat('es-CO', { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
          }).format(params);
        }
      },
      {
        field: 'tarjetas',
        headerName: 'Tarjetas',
        width: 250,
        editable: false, // La edición se maneja manualmente con el Chip
        renderCell: (params) => {
          const isActive = activeRow === params.id;
          const tarjetaSeleccionada = tarjetasBancarias.find((option) => option.id === params.value?.id);
          console.log("tarjetasBancarias ",tarjetasBancarias)
          console.log("banco ",banco)
          return (
            <Box width="100%">
              {isActive && tarjetasBancarias.length > 0 ? (
                <Autocomplete
                    options={tarjetasBancarias}
                    getOptionLabel={(option) => option.nombre_cuenta}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    value={tarjetasBancarias.find((option) => option.nombre_cuenta === banco) || null}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        handleSelectionChange(newValue.id, newValue);
                      } else {
                        handleSelectionChange(null, null); // Limpia selección
                        handleDisplayAllTarjetas();
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Seleccione una tarjeta"
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
                    clearOnEscape
                    disableClearable={false} // permite que aparezca la "X"
                  />
              ) : (
                <Chip
                  label={params.value ? params.value.nombre_cuenta : "Seleccionar Tarjeta"}
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
                    handleShowAllTarjetas(); // si necesitas cargar tarjetas desde Redux
                    handleCellClick(params.id);
                  }}
                />
              )}
            </Box>
          );
        },
      },
      /*{
        field: 'tarjetas',
        headerName: 'Tarjetas',
        width: 250,
        editable: true,
        renderCell: (params) => {
          const isActive = activeRow === params.id; // Verifica si esta celda está activa
          return (
            <Box width="100%"  onClick={() => handleCellClick(params.id)}>
            {isActive && tarjetasBancarias.length > 0 ? (
              <Autocomplete
                options={tarjetasBancarias}
                getOptionLabel={(option) => option.nombre_cuenta}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={tarjetasBancarias.find((option) => option.banco === banco) || null} // Encuentra el objeto correspondiente
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleSelectionChange(newValue.id, newValue);
                  } else {
                    handleDisplayAllTarjetas(); // Manejo cuando se borra la selección
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Seleccione una tarjeta"
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
                label={params.value ? params.value.nombre_cuenta : "Seleccionar Tarjeta"}
                style={{
                  backgroundColor: "#262254",
                  color: "#ffffff",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleShowAllTarjetas()}
              />
            )}
          </Box>
          );
        },
      },*/
      {
        field: "actions",
        headerName: "Actions",
        width: 250,
        sortable: false,
        renderCell: (params) => {
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

              
            <Tooltip title="Volver al valor anterior" arrow>
              <IconButton
                aria-label="Volver al valor anterior"
                onClick={() => handleDevolver({'id':params.row.id,'devolver':'confirmarprecio'})}
                color="info"
              >
                <UndoIcon />
              </IconButton>
            </Tooltip>
  
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

                  {params.row.precioDeLey != "" && banco != "" && !archivoFile && isFileUploaded &&
                  <Tooltip title="Confirmar">
                    <IconButton
                      aria-label="delete-file"
                      color="success"
                      onClick={() => handleUploadFile(params.row.id)}
                    >
                      <AutoStoriesIcon />
                    </IconButton>
                  </Tooltip>
                  }
              
                  
                </>
              )}
            </>
          );
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
      
      let comisionproveedor = Object.values(comisiones);

      // Si no existe o es vacío, asignar "0"
      let comisionRaw = comisionproveedor[0] ? comisionproveedor[0] : "0";
      
      // Eliminar separadores de miles y convertir a número
      let comision = parseFloat(comisionRaw.replace(/\./g, ''));
     
      if (etiqueta.toLowerCase() === "elvin" || etiqueta.toLowerCase() === "amalfi"){
          comision = -Math.abs(comision); // Asegura que sea negativo
      }

      if (!fileUpload) {
        alert("Por favor selecciona un archivo.");
        return;
      }

      const allowedImageTypes = [
                                  'image/jpeg',
                                  'image/png',
                                  'image/gif',
                                  'image/webp',
                                  'image/svg+xml'
                                ];

      const fileName = fileUpload.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

      if (!allowedImageTypes.includes(fileUpload.type)) {
        alert("Por favor sube solo archivos de imagen (JPEG, PNG, GIF, WEBP o SVG).");
        return;
      }

      // Validación adicional por extensión (opcional)
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Tipo de archivo no permitido. Sube solo imágenes con extensión .jpg, .jpeg, .png, .gif, .webp o .svg");
        return;
      }

      if (!idBanco) {
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
                                  archivo: fileUpload,
                                  idBanco: idBanco,
                                  confirmacionPreciosModulo: 0,
                                  cotizadorModulo: 0,
                                  pdfsModulo: 1,
                                  tramiteModulo: 0,
                                  idProveedor: idProveedor,
                                  comisionproveedor: comision
                              },
                              'confirmarprecio'
                          ));

     /* dispatch(updateThunks({id,  
                              'archivo'                 : fileUpload, 
                              'idBanco'                 : idBanco, 
                              confirmacionPreciosModulo : 0, 
                              cotizadorModulo           : 0, 
                              pdfsModulo                : 1, 
                              tramiteModulo             : 0,
                              idProveedor               : idProveedor,
                              comisionproveedor         : comisionproveedor[0]
                            }, 'confirmarprecio'))  */                           
      //navigate('/cargarpdfs');
    }
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };


  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

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
        slots={{
          noRowsOverlay: NoRowsOverlay, // Personaliza el estado sin datos
        }}
      />
    </Paper>
  );
}
