import React, { useState, useRef } from 'react';
import {
  Paper,
  IconButton,
  Box,
  Tooltip,
  Chip,
  CircularProgress,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import { Autocomplete } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { showThunk, updateThunks, update_cotizador_devolver } from '../../store/cotizadorStore/cotizadorThunks';
import { getAllThunks as getAllTarjetas, handleDisplayAllTarjetasThunk, handleFormStoreThunk as handleFormStoreThunkTarjetas } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';
import { clearAllProveedores, handleFormStoreThunk as handleFormStoreThunkProveedores, getAllThunks as getAllProveedores } from '../../store/proveedoresStore/proveedoresThunks';

import { useNavigate } from 'react-router-dom';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import emptyDataTable from "../../assets/images/emptyDataTable.png"

const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#333" : "#FFF";
};

export function DataTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { cotizadores, archivo, idBanco } = useSelector(state => state.cotizadorStore);
  let { tarjetasBancarias, banco }      = useSelector(state => state.registroTarjetasStore);
  let { proveedores, etiqueta, id: idProveedor, defaultProv } = useSelector(state => state.proveedoresStore);
  
  console.log(" === proveedores === ",proveedores);
  console.log(" === defaultProv === ",defaultProv)

  const [comisiones, setComisiones] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [fileUpload, setFileUpload] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [editingRowId, setEditingRowId] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [selectedProveedores, setSelectedProveedores] = useState({});

  const fileInputRef = useRef(null);

  const paginationModel = { page: 0, pageSize: 15 };
  const esEditable = etiqueta?.toUpperCase() === 'AMALFI' || etiqueta?.toUpperCase() === 'ELVIN';

  const handleComisionChange = (e, id) => {
    let value = e.target.value.replace(/\D/g, '');
    value = Number(value).toLocaleString('es-CO');
    setComisiones((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setFileUpload(file);
    if (file && selectedRow) {
      toast.success(`Archivo ${file.name} subido.`);
      setUploadedFiles((prev) => ({ ...prev, [selectedRow.id]: file.name }));
      fileInputRef.current.value = "";
    }
  };

  const handleOpenFileDialog = (row) => {
    setSelectedRow(row);
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (id) => {
    toast(({ closeToast }) => (
      <Box>
        <p>¿Estás seguro de que deseas eliminar el archivo?</p>
        <button onClick={() => confirmDelete(id, closeToast)}>Sí</button>
        <button onClick={closeToast}>Cancelar</button>
      </Box>
    ), { autoClose: false });
  };

  const confirmDelete = (rowId) => {
    alert("llama el endpoint para eliminar el archivo");
  };

  const handleDeleteLocalFile = (rowId) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[rowId];
      return newFiles;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectionChange = (id, newValue) => {
    if(newValue){
      dispatch(handleFormStoreThunkTarjetas({name: 'banco', value:newValue.nombre_cuenta }));
      dispatch(handleFormStoreThunkTarjetas({name: 'idBanco', value:id }));
    }else{
      dispatch(handleFormStoreThunkTarjetas({name: 'banco', value:""}));
      dispatch(handleFormStoreThunkTarjetas({name: 'idBanco', value:""}));
    }
  };

  const handleProveedorSelectionChange = (id, newValue) => {
    if(newValue){
      dispatch(handleFormStoreThunkProveedores({name: 'nombre',   value:newValue.nombre }));
      dispatch(handleFormStoreThunkProveedores({name: 'etiqueta', value:newValue.etiqueta_nombre }));
      dispatch(handleFormStoreThunkProveedores({name: 'id',       value:id }));
      if(newValue.etiqueta_nombre !== "seguros generales"){
        dispatch(handleFormStoreThunkTarjetas({name: 'idBanco', value:""}));
        dispatch(handleFormStoreThunkTarjetas({name: 'banco', value:""}));
      }
    }else{
      dispatch(handleFormStoreThunkProveedores({name: 'nombre',   value:""}));
      dispatch(handleFormStoreThunkProveedores({name: 'etiqueta', value:""}));
      dispatch(handleFormStoreThunkProveedores({name: 'id',       value:""}));
    }
  };

  const handleCellClick = (id) => setActiveRow(id);
  const handleDevolver = (data="") => {
    if(data==="") return;
    toast(({closeToast}) => (
      <Box>
        <p>¿Estás seguro de devolver este registro al estado de confirmación?</p>
        <button onClick={()=>{handleDevolverConfirmar(data);closeToast()}}>Sí</button>
        <button onClick={closeToast}>Cancelar</button>
      </Box>
    ),{autoClose:false});
  }
  const handleDevolverConfirmar = (data) => {
    dispatch(update_cotizador_devolver({'id':data.id,'devolver':data.devolver}))
  };

  const handleUploadFileConfirmar = (id) => {
    let comisionproveedor = Object.values(comisiones);
    let comisionRaw = comisionproveedor[0] ? comisionproveedor[0] : "0";
    let comision = parseFloat(comisionRaw.replace(/\./g,''));
    if(etiqueta.toLowerCase()!="seguros generales") comision = -Math.abs(comision);

    if(!fileUpload){ alert("Selecciona un archivo."); return; }
    const allowedTypes=['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
    const ext=fileUpload.name.split('.').pop().toLowerCase();
    if(!allowedTypes.includes(fileUpload.type)){ alert("Formato no permitido."); return;}
    if(!idBanco && etiqueta=="seguros generales"){ alert("Seleccione una tarjeta."); return; }
    if(!idProveedor){alert("Seleccione un proveedor.");return;}

    dispatch(updateThunks(
      { id, archivo:fileUpload,idBanco,confirmacionPreciosModulo:0,cotizadorModulo:0,pdfsModulo:1,tramiteModulo:0,idProveedor,comisionproveedor:comision },
      'confirmarprecio'
    ));
  };

  const handleUploadFile = (id)=>{
    toast(({closeToast})=>(
      <Box>
        <p>¿Confirmar subida del archivo?</p>
        <button onClick={()=>{handleUploadFileConfirmar(id);closeToast()}}>Sí</button>
        <button onClick={closeToast}>Cancelar</button>
      </Box>
    ),{autoClose:false});
  }

  const handleEdit = async(row)=>{ await dispatch(showThunk(row.id)); }

  const NoRowsOverlay = () => (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={2} mb={2}>
      <img src={emptyDataTable} width={150} style={{opacity:0.7}} alt="no data"/>
      <p>No hay datos disponibles</p>
    </Box>
  )

  return (
    <Paper sx={{ padding: 2, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FilterData  cotizador="confirmacionprecios"/>
        <DateRange   cotizador="confirmacionprecios"/>
      </Box>
      <input type="file" ref={fileInputRef} style={{display:"none"}} onChange={handleUpload}/>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Etiqueta</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Cilindraje</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Comisión Proveedor</TableCell>
              <TableCell align="right">Precio ley</TableCell>
              <TableCell align="right">Comisión precio ley</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Tarjetas</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cotizadores.map((row) => {
              const isActive = activeRow === row.id;
              const proveedorSeleccionado = selectedProveedores[row.id] || null;
              const isFileUploaded = uploadedFiles[row.id];
              const archivoFile = row.archivo;

              return (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>

                  <TableCell>
                    <Chip
                      label={row.nombre_cliente}
                      style={{
                        backgroundColor: row.color_cliente || '#ddd',
                        color: getContrastColor(row.color_cliente || '#ddd')
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.etiquetaDos}
                      style={{
                        backgroundColor: row.color_etiqueta || '#ddd',
                        color: getContrastColor(row.color_etiqueta || '#ddd')
                      }}
                    />
                  </TableCell>

                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.cilindraje}</TableCell>
                  <TableCell>{row.modelo}</TableCell>

                  <TableCell>
                    {isActive && proveedores.length > 0 ? (
                      <Autocomplete
                        options={proveedores}
                        getOptionLabel={(o)=>o.nombre}
                        isOptionEqualToValue={(o,v)=>o.id===v?.id}
                        value={proveedorSeleccionado}
                        onChange={(_,newValue)=>{
                          setSelectedProveedores(prev=>({...prev,[row.id]:newValue}));
                          if(newValue){ handleProveedorSelectionChange(newValue.id,newValue);} else {handleProveedorSelectionChange(null,null); dispatch(clearAllProveedores()); }
                        }}
                        renderInput={(p)=><TextField {...p} variant="standard" placeholder="Seleccione un proveedor" autoFocus/>}
                      />
                    ) : (
                      <Chip
                        label={proveedorSeleccionado?.nombre || "Seleccione un Proveedor"}
                        style={{background:"#262254",color:"#fff",cursor:"pointer"}}
                        onClick={()=>{dispatch(getAllProveedores()); handleCellClick(row.id)}}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    {esEditable && activeRow === row.id ? (
                      <input
                        type="text"
                        value={comisiones[row.id] || ''}
                        onChange={(e)=>handleComisionChange(e,row.id)}
                        placeholder="Ingrese comisión"
                        style={{ width:'100%',textAlign:'right',border:'none',background:'transparent' }}
                      />
                    ) : (
                      <span>0</span>
                    )}
                  </TableCell>

                  <TableCell align="right">{row.precioDeLey}</TableCell>
                  <TableCell align="right">{row.comisionPrecioLey}</TableCell>
                  <TableCell align="right">{new Intl.NumberFormat("es-CO").format(row.total)}</TableCell>

                  <TableCell>
                    {isActive && tarjetasBancarias.length>0 ? (
                      <Autocomplete
                        options={tarjetasBancarias}
                        getOptionLabel={(o)=>o.nombre_cuenta}
                        isOptionEqualToValue={(o,v)=>o.id===v?.id}
                        value={tarjetasBancarias.find(o=>o.nombre_cuenta===banco)||null}
                        onChange={(_,newValue)=>{
                          if(newValue){handleSelectionChange(newValue.id,newValue)} else{handleSelectionChange(null,null); dispatch(handleDisplayAllTarjetasThunk());}
                        }}
                        renderInput={(p)=><TextField {...p} variant="standard" placeholder="Seleccione una tarjeta" autoFocus/>}
                        disabled={etiqueta!=="seguros generales"}
                      />
                    ) : (
                      <Chip
                        label={row.tarjetas?row.tarjetas.nombre_cuenta:"Seleccionar Tarjeta"}
                        style={{background:"#262254",color:"#fff",cursor:"pointer"}}
                        onClick={()=>{dispatch(getAllTarjetas()); handleCellClick(row.id)}}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={()=>handleEdit(row)} color="primary"><EditIcon/></IconButton>
                    {!archivoFile && !isFileUploaded && (
                      <Tooltip title="Subir archivo">
                        <IconButton color="primary" onClick={()=>handleOpenFileDialog(row)}>
                          <UploadFileIcon/>
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Volver al valor anterior">
                      <IconButton onClick={()=>handleDevolver({id:row.id,devolver:"confirmarprecio"})} color="info">
                        <UndoIcon/>
                      </IconButton>
                    </Tooltip>
                    {archivoFile ? (
                      <Tooltip title="Eliminar archivo">
                        <IconButton color="error" onClick={()=>handleDeleteFile(row.id)}>
                          <DeleteIcon/>
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {!archivoFile && isFileUploaded && (
                      <>
                        <Tooltip title={`Archivo subido: ${isFileUploaded}`}>
                          <IconButton color="success"><CheckCircleIcon/></IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar archivo">
                          <IconButton color="error" onClick={()=>handleDeleteLocalFile(row.id)}><HighlightOffIcon/></IconButton>
                        </Tooltip>
                        {(
                          etiqueta !== "" &&
                          ((etiqueta !== "seguros generales" && isFileUploaded) ||
                          (etiqueta==="seguros generales" && isFileUploaded && banco!==""))
                        ) && (
                          <Tooltip title="Confirmar">
                            <IconButton color="success" onClick={()=>handleUploadFile(row.id)}><AutoStoriesIcon/></IconButton>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {cotizadores.length === 0 && <NoRowsOverlay/>}
      </TableContainer>
    </Paper>
  );
}
