import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { showThunk, deleteThunk, downloadExcelThunk } from '../../store/gastosGeneralesStore/gastosGeneralesStoreThunks';
import { getAllThunks as listGastos }    from '../../store/gastosStore/gastosStoreThunks';
import { getAllThunks as listTarjetas } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';

import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { Box } from '@mui/material';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';

export function DataTable() {

    const dispatch = useDispatch();

    let { gastosGenerales }    = useSelector(state => state.gastosGeneralesStore);
    const { startDate, endDate } = useSelector(state => state.globalStore);
    
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
      {
        field: 'id',
        headerName: 'ID',
        width: 80,
        minWidth: 60,
        flex: 0.5
      },
      {
        field: 'fecha_ingreso',
        headerName: 'Fecha de Ingreso',
        width: 180,
        minWidth: 150,
        flex: 1,
        valueFormatter: (params) => {
          if (!params) return "";
          return params.slice(0, 16).replace("T", " ");
        }
      },
      {
        field: 'fecha_transaccion',
        headerName: 'Fecha de Transacción',
        width: 180,
        minWidth: 150,
        flex: 1
      },
      {
        field: 'observacion',
        headerName: 'Descripción',
        width: 200,
        minWidth: 150,
        flex: 1.2
      },
      {
        field: 'valor',
        headerName: 'Valor',
        width: 140,
        minWidth: 100,
        flex: 0.8,
        align: "right",
        headerAlign: "right",
        valueFormatter: (params) => {
          return new Intl.NumberFormat('es-CO').format(params);
        },
        renderCell: (params) => {
          const valor = params.value || 0;
          const color = valor < 0 ? 'red' : 'green';
          return (
            <span style={{
              color,
              fontWeight: 'bold',
              fontSize: window.innerWidth < 600 ? "18px" : "26px"
            }}>
             {new Intl.NumberFormat('es-CO').format(valor)}
            </span>
          );
        }
      },
      {
        field: 'cuatro_por_mil',
        headerName: 'Cuatro x Mil',
        width: 140,
        minWidth: 100,
        flex: 0.8,
        align: "right",
        headerAlign: "right",
        valueFormatter: (params) => {
          return new Intl.NumberFormat('es-CO').format(params);
        },
        renderCell: (params) => {
          const valor = params.value || 0;
          const color = valor < 0 ? 'red' : 'green';
          return (
            <span style={{
              color,
              fontWeight: 'bold',
              fontSize: window.innerWidth < 600 ? "18px" : "26px"
            }}>
             {new Intl.NumberFormat('es-CO').format(valor)}
            </span>
          );
        }
      },
      {
        field: 'nombre_gasto',
        headerName: 'Gasto',
        width: 160,
        minWidth: 120,
        flex: 1
      },
      {
        field: 'nombre_tarjeta',
        headerName: 'Tarjeta',
        width: 160,
        minWidth: 120,
        flex: 1
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 120,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(params.row)}
              color="primary"
              size={window.innerWidth < 600 ? "small" : "medium"}
            >
              <EditIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleDelete(params.row.id)}
              color="error"
              size={window.innerWidth < 600 ? "small" : "medium"}
            >
              <DeleteIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
            </IconButton>
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
            <p>¿Estás seguro de que deseas eliminar esta registro?</p>
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
    await dispatch(listGastos());
    await dispatch(listTarjetas());
    await dispatch(showThunk(row.id));
  };

  // Función para descargar Excel
  const handleDownloadExcel = async () => {
    await dispatch(downloadExcelThunk(startDate, endDate));
  };


  return (
    <Box sx={{
      height: { xs: 'calc(100vh - 150px)', sm: 'calc(100vh - 120px)', md: '100vh' },
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        gap={{ xs: 1, sm: 2 }}
        marginBottom={{ xs: 1, sm: 2 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        {/*<FilterData  cotizador="gastosGenerales"/>   Componente de filtros adicionales */}
        <DateRange cotizador="gastosGenerales"/>  {/* Componente para selección de rango de fechas */}

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2E7D32",
            color: "white",
            height: { xs: '40px', sm: '56px' },
            minWidth: { xs: '100%', sm: '180px' },
            '&:hover': {
              backgroundColor: "#1B5E20"
            }
          }}
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadExcel}
        >
          Descargar Excel
        </Button>
      </Box>

      <DataGrid
        rows={gastosGenerales}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15]}
        sx={{
          border: 0,
          minHeight: { xs: 400, sm: 500, md: 600 },
          "& .even-row": { backgroundColor: "#f5f5f5" },
          "& .odd-row": { backgroundColor: "#ffffff" },
          "& .MuiDataGrid-cell": {
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            padding: { xs: '4px 8px', sm: '8px 16px' }
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            fontWeight: 'bold'
          },
          "& .MuiDataGrid-footerContainer": {
            minHeight: { xs: '40px', sm: '52px' }
          }
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
        autoHeight={false}
      />
    </Box>
  );
}
