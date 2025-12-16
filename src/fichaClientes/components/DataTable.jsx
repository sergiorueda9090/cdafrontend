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
      { field: 'id',                      headerName: 'ID',                         width: 80, minWidth: 60 },
      { field: 'fi',                      headerName: 'Fecha Transacción',       width: 180, minWidth: 150, flex: 0.5,
        valueFormatter: (params) => {
          if (!params) return "";
          // Toma los primeros 16 caracteres y reemplaza la "T" por un espacio
          return params.slice(0, 16).replace("T", " ");
        }
      },
      {
        field: 'valor_alias',
        headerName: 'Valor',
        width: 150,
        minWidth: 120,
        flex: 0.5,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%', justifyContent: 'flex-end' }}>
            <span style={{ color: params.value < 0 ? 'red' : 'green', fontWeight: "bold", fontSize:"1.1rem" }}>
              {new Intl.NumberFormat('es-CO').format(params.value)}
            </span>
          </Box>
        ),
      },
      { field: 'desc_alias',              headerName: 'Observación',                width: 180, minWidth: 150, flex: 1 },
      {
        field: 'archivo',
        headerName: 'Soporte',
        width: 100,
        minWidth: 80,
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
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '95%', sm: '85%', md: '70%', lg: '60%' },
                            maxWidth: 800,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: { xs: 2, sm: 3, md: 4 },
                            borderRadius: 2,
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                          <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12}>
                                  <Card elevation={0}>
                                      <CardMedia
                                        component="img"
                                        image={modalImageUrl}
                                        alt="Soporte de Pago"
                                        sx={{
                                          maxWidth: "100%",
                                          height: "auto",
                                          objectFit: "contain",
                                          maxHeight: { xs: '400px', sm: '500px', md: '600px' }
                                        }}
                                      />
                                    <CardContent>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                      >
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
      { field: 'Fecha de ingreso (Auto)', headerName: 'Fecha Ingreso',    width: 150, minWidth: 120, flex: 0.5 },
      { field: 'placa',                   headerName: 'Placa',    width: 120, minWidth: 100 },
      {
        field: "origen",
        headerName: "Origen",
        width: 180,
        minWidth: 150,
        flex: 0.5,
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
    <Paper sx={{
      padding: { xs: 1, sm: 1.5, md: 2 },
      height: { xs: 600, sm: 650, md: 700 },
      width: '100%'
    }}>

      <Box
        display="flex"
        justifyContent={{ xs: "center", sm: "space-between" }}
        marginBottom={{ xs: 1.5, sm: 2 }}
        flexWrap="wrap"
        gap={1}
      >
           {/*<FilterData  cotizador="fichacliente"/>  Componente de filtros adicionales */}
          <DateRange cotizador="fichacliente"/>
      </Box>

      <DataGrid
        rows={fichasClienteData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        rowHeight={60}
        //checkboxSelection
        sx={{
          border: 0,
          "& .even-row": { backgroundColor: "#f5f5f5" },
          "& .odd-row": { backgroundColor: "#ffffff" },
          "& .MuiDataGrid-cell": {
            fontSize: { xs: "0.7rem", sm: "0.875rem", md: "0.875rem" },
            padding: { xs: "4px", sm: "8px", md: "16px" },
            display: 'flex',
            alignItems: 'center'
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: { xs: "0.7rem", sm: "0.875rem", md: "0.875rem" },
            minHeight: { xs: "45px !important", sm: "56px !important" }
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold"
          },
          "& .MuiDataGrid-row": {
            minHeight: "60px !important",
            maxHeight: "60px !important"
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto"
          }
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
      />
    </Paper>
  );
}
