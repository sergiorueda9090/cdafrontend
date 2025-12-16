import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, getAllThunks } from '../../store/historialtramitesemitidosStore/historialtramitesemitidosStoreThunks';
import { FilterData } from '../../cotizador/components/FilterData';
import { DateRange } from '../../cotizador/components/DateRange';
import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png";
import { URL } from '../../constants.js/constantGlogal';

export function DataTable() {

  const dispatch = useDispatch();
  const { historial, count } = useSelector(state => state.historialtramitesemitidosStore);

  // Estado de paginación controlada
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 20,
  });

  // Cargar datos al cambiar de página
  React.useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getAllThunks(
          "",  // fechaInicio
          "",  // fechaFin
          "",  // query
          paginationModel.page + 1, // Django usa índice 1-based
          paginationModel.pageSize
        )
      );
    };
    fetchData();
  }, [paginationModel, dispatch]);

  const NoRowsOverlay = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      marginTop: "10px",
      marginBottom: "10px"
    }}>
      <img
        src={emptyDataTable}
        alt="No hay datos disponibles"
        style={{ width: "150px", opacity: 0.7 }}
      />
      <p style={{ fontSize: "16px", color: "#666" }}>No hay datos disponibles</p>
    </div>
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copiado al portapapeles");
    }).catch(err => console.error("Error al copiar: ", err));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "fechaCreacion",
      headerName: "Fecha Creación",
      width: 200,
      valueGetter: (params) => params ? params.slice(0, 16).replace("T", " ") : ""
    },
    { field: "nombre_usuario", headerName: "Usuario", width: 120 },
    { field: "nombre_cliente", headerName: "Cliente", width: 150 },
    { field: "placa", headerName: "Placa", width: 120 },
    { field: "cilindraje", headerName: "Cilindraje", width: 120 },
    { field: "modelo", headerName: "Modelo", width: 100 },
    { field: "chasis", headerName: "Chasis", width: 150 },
    { field: "tipoDocumento", headerName: "Tipo Documento", width: 150 },
    { field: "numeroDocumento", headerName: "N° Documento", width: 150 },
    { field: "telefono", headerName: "Teléfono", width: 150 },
    { field: "correo", headerName: "Correo", width: 200 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "pagoInmediato", headerName: "Pago Inmediato", width: 120 },
    {
      field: "linkPago",
      headerName: "Link de Pago",
      width: 200,
      renderCell: (params) => (
        params.value ? (
          <Tooltip title="Copiar">
            <ContentCopyIcon
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => handleCopy(params.value)}
            />
          </Tooltip>
        ) : (
          "No disponible"
        )
      ),
    },
    { field: "precioDeLey", headerName: "Precio de Ley", width: 120 },
    { field: "comisionPrecioLey", headerName: "Comisión", width: 100 },
    { field: "total", headerName: "Total", width: 100 },
    { field: "nombre_tarjeta", headerName: "Tarjeta", width: 120 },
    {
      field: "pdf",
      headerName: "PDF",
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            <PictureAsPdfIcon style={{ color: "red", fontSize: 40 }} />
          </a>
        ) : (
          "No disponible"
        )
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="view"
          onClick={() => handleEdit(params.row)}
          color="primary"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    }
  ];

  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
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
        <FilterData cotizador="historialtramitesemitidos" />
        <DateRange cotizador="historialtramitesemitidos" />
      </Box>

      <DataGrid
        rows={historial}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode="server"
        rowCount={count}
        pageSizeOptions={[15, 30, 50, 100]}
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
