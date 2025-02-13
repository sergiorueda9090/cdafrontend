import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar }      from "@mui/x-data-grid";
import { Grid, Typography, Box }      from "@mui/material";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch }   from "react-redux";
import { getAllThunks }               from '../../store/logsTramitesStore/logsTramitesThunks';
import KeyboardReturnIcon             from '@mui/icons-material/KeyboardReturn';
import { useNavigate }                from 'react-router-dom';

export const ShowView = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const returnTramites = async() => {
    navigate(`/tramites`);
  };

  const params = useParams();

  const { logsTramites } = useSelector(state => state.logsTramitesStore);
  useEffect(() => {
     dispatch(getAllThunks(params.id));
  },[])

  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5); // Tamaño de la página para la paginación

  // Definir las columnas para el DataGrid
  const columns = [
    { field: "fecha",         headerName: "Fecha",          flex: 1, sortable: true },
    { field: "idUsuario",     headerName: "Usuario",        flex: 1, sortable: true },
    { field: "estado",        headerName: "Estado",         flex: 1, sortable: true },
    { field: "idCliente",     headerName: "Cliente",        flex: 1, sortable: true },
    { field: "antiguoValor",  headerName: "Antiguo Valor",  flex: 1, sortable: true },
    { field: "antiguoValor",  headerName: "Nuevo Valor",    flex: 1, sortable: true },
    { field: "idTramite",     headerName: "Tramite",        flex: 1, sortable: true },
    { field: "campo",         headerName: "Campo",          flex: 1, sortable: true },
    { field: "accion",        headerName: "Acción",         flex: 1, sortable: true, filterable: true },
  ];

  return (
    <Box sx={{ height: 500, width: "100%", p: 3 }}>
     
     <Typography 
          variant="h4" 
          fontWeight="light" 
          gutterBottom 
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} // Aquí añadimos cursor: pointer
          onClick={returnTramites} // Asegúrate de tener el evento onClick
        >
          <KeyboardReturnIcon color="primary" sx={{ fontSize: 30, marginRight: 1 }} /> 
          Historial de Logs
      </Typography>
      <DataGrid
        rows={logsTramites}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]} // Opciones para cambiar el tamaño de la página
        pagination
        disableSelectionOnClick // Evitar selección al hacer clic en una fila
        components={{
          Toolbar: GridToolbar, // Barra de herramientas completa
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: "fecha", sort: "desc" }], // Orden inicial por fecha descendente
          },
        }}
      />
    </Box>
  );
};
