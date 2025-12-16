import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, transMoneyThunk } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';
import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { Box, Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';

export function DataTable() {

    const dispatch = useDispatch();
    
    let { tarjetasBancarias }    = useSelector(state => state.registroTarjetasStore);
    
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

    const columns = [
      { field: 'id',                   headerName: 'ID',                    width: 100 },
      { field: 'numero_cuenta',        headerName: 'Numero de la cuenta',   width: 200 },
      { field: 'nombre_cuenta',        headerName: 'Nombre de la cuenta',   width: 200 },
      { field: 'descripcion',          headerName: 'Descripción',           width: 200 },
      /*{ field: 'saldo',                headerName: 'Saldo',                 width: 160 },*/
      /*{ field: 'imagen',               headerName: 'Image',                 width: 130 },*/
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Editar Registro" arrow>
              <IconButton
                aria-label="edit"
                onClick={() => handleEdit(params.row)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

              <Tooltip title="Eliminar Registro" arrow>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(params.row.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
              </Tooltip>

              <Tooltip title="Transladar dinero entre cuentas" arrow>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleTransMoany(params.row)}
                    color="warning">
                    < CompareArrowsIcon />
                  </IconButton>
              </Tooltip>

           
          </>
        ),
      },
    ];
    
    
    
    // Función para manejar la eliminación
    const handleDelete = (id) => {
      // Mostrar la notificación con opciones de confirmación
      toast(
        ({ closeToast }) => (
          <div>
            <p>¿Estás seguro de que deseas eliminar esta tarjeta?</p>
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

    // Función para manejar la edición
    const handleTransMoany = async (row) => {
      await dispatch(transMoneyThunk(row.id));
    };


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
        {/*<FilterData  cotizador="registroTarjetas"/>*/}
        {/*<DateRange   cotizador="registroTarjetas"/>*/}
      </Box>

      <DataGrid
        rows={tarjetasBancarias}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15]}
        rowHeight={60}
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
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
      />
    </Paper>
  );
}
