import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/etiquetasStore/etiquetasThunks';
import { toast } from 'react-toastify';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import { Box, Card, CardContent, CardMedia, Grid, Modal, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { URL } from '../../constants.js/constantGlogal';
export function DataTable() {

    const dispatch = useDispatch();
    console.log("URL ",URL)
    let { fichasCliente }    = useSelector(state => state.fichaClienteStore);
    const [openModal, setOpenModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState(null);

    const handleOpenModal = (params) => {
      console.log("URL + params.value ",URL+'/media/'+params.value)
        setModalImageUrl(URL+'/media/'+params.value);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalImageUrl(null);
    };
    const columns = [
      { field: 'id',                      headerName: 'ID',                         width: 100 },
      { field: 'fi',                      headerName: 'Fecha de Transaccion',       width: 200 , 
        valueFormatter: (params) => {
          if (!params) return "";
          // Toma los primeros 16 caracteres y reemplaza la "T" por un espacio
          return params.slice(0, 16).replace("T", " ");
        }
      },
      {
        field: 'valor_alias',
        headerName: 'Valor',
        width: 200,
        renderCell: (params) => (
          <span style={{ color: params.value < 0 ? 'red' : 'green', fontWeight: "bold", fontSize:"26px" }}>
            {new Intl.NumberFormat('es-CO').format(params.value)}
          </span>
        ),
      },
      { field: 'desc_alias',              headerName: 'Observacion',                width: 200 },
      {
        field: 'archivo',
        headerName: 'Soporte',
        width: 200,
        renderCell: (params) => {
            return params.value ? (
                <>
                    <IconButton aria-label="archivo" color="primary" onClick={() => handleOpenModal(params)}>
                        <ImageIcon />
                    </IconButton>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box  sx={{
                            p:4,
                            justifyContent: 'center', // Centrar horizontalmente
                            alignItems: 'center', // Centrar verticalmente
                        }}>
                          <Grid Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12} md={6}>
                                  <Card>
                                      <CardMedia
                                        component="img"
                                        image={modalImageUrl} // URL de la imagen
                                        alt="Soporte de Pago"
                                        sx={{
                                          maxWidth: "100%", // Asegura que la imagen no se desborde
                                        }}
                                      />
                                    <CardContent>
                                      <Typography variant="body2" color="textSecondary">
                                        Imagen del soporte de pago
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </>
            ) : null;
        },
    },
      { field: 'Fecha de ingreso (Auto)', headerName: 'Fecha de ingreso (Auto)',    width: 200 },
      { field: 'placa',                   headerName: 'Placa',    width: 200 },
      {
        field: "origen",
        headerName: "Origen",
        width: 230,
        renderCell: (params) => {
          // Obtener el valor de origen
          const origen = params.value;
      
          // Definir colores según el origen
          let backgroundColor = "transparent"; // Color por defecto
          if (origen === "Tramites") backgroundColor = "#E6F4EA"; // Verde claro
          if (origen === "Recepcion de Pago") backgroundColor = "#FFF4DE"; // Amarillo claro
          if (origen === "Devoluciones") backgroundColor = "#F8D7DA"; // Rojo claro
          if (origen === "Ajustes de Saldos") backgroundColor = "#D1ECF1"; // Rojo claro
  
          return (
            <span style={{ 
              backgroundColor, 
              padding: "5px 10px", 
              borderRadius: "5px", 
              display: "inline-block",
              width: "100%",
              textAlign: "center",
              fontWeight: "bold"
            }}>
              {origen}
            </span>
          );
        }
      },
    ];
    
    
    
    // Función para manejar la eliminación
    const handleDelete = (id) => {
      // Mostrar la notificación con opciones de confirmación
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas eliminar la etiqueta?</p>
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
    const confirmDelete = async (id, closeToast) => {
      await dispatch(deleteThunk(id));
      closeToast(); // Cerrar la notificación
    };
    
    const paginationModel = { page: 0, pageSize: 15 };

  // Función para manejar la edición
  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };

  const fichasClienteData = fichasCliente.map(row => ({
    ...row,
    id: uuidv4() // Usa el ID existente o genera uno nuevo
  }));
  return (
    <Paper sx={{ padding: 2, height: 700, width: '100%' }}>

      
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <FilterData  cotizador="fichacliente"/>  {/* Componente de filtros adicionales */}
          <DateRange   cotizador="fichacliente"/>  {/* Componente para selección de rango de fechas */}
      </Box>

      <DataGrid
        rows={fichasClienteData}
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
      />
    </Paper>
  );
}
