import React, { useEffect, useState, useRef  } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
  Tabs, 
  Tab,
  Tooltip,
  TextField,
  InputAdornment
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"
import { DataGrid } from "@mui/x-data-grid";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginFail } from "../../store/authCustomers/authCustomers"; // Ajusta según tu path
import InstagramIcon from "@mui/icons-material/Instagram";
import movilidadA2 from "../../assets/images/movilidadA2.jpeg"; // Ajusta si tu alias no es "@/"
import { getCotizadoresCliente, getCotizadoresClienteSecond, showRecepcionPagoSecond } from "../../store/authCustomers/authCustomersThunks";
import { URL } from "../../constants.js/constantGlogal";

export const ProfilePage = () => {
  
  const { data, recepcionPagoArray, total } = useSelector((state) => state.authCustomerStore);

  const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const clienteDataString = localStorage.getItem("cliente_data");
    console.log("¿Qué hay en localStorage?:", clienteDataString);

    if (clienteDataString) {
      const clienteData = JSON.parse(clienteDataString);
      console.log("clienteData decodificado:", clienteData);
    } else {
      console.warn("No hay datos en localStorage al cargar.");
      localStorage.removeItem("cliente_data");
    }
  }, []);

  const pollingRefs = useRef([]); // <== Guardamos los IDs de los intervalos

  const startPollingRecepcionPago = () => {
    const intervalId = setInterval(() => {
      const clienteData = JSON.parse(localStorage.getItem("cliente_data"));
      const idCliente = clienteData?.id_cliente;

      if (idCliente) {
        dispatch(showRecepcionPagoSecond(idCliente));
        dispatch(getCotizadoresCliente(clienteData));
      } else {
        console.warn("ID cliente no encontrado en localStorage.");
      }
    }, 3000);

    pollingRefs.current.push(intervalId);
  };

  const startPollingCotizadores = () => {
    const intervalId = setInterval(() => {
      const clienteData = JSON.parse(localStorage.getItem("cliente_data"));

      if (
        clienteData &&
        clienteData.token &&
        clienteData.telefono &&
        clienteData.id_cliente
      ) {
        dispatch(getCotizadoresClienteSecond(clienteData));
      } else {
        console.warn("Faltan datos válidos en localStorage para getCotizadoresClienteSecond.");
      }
    }, 3000);

    pollingRefs.current.push(intervalId);
  };

  // Iniciar los pollings cuando carga el componente
  useEffect(() => {
    startPollingRecepcionPago();
    startPollingCotizadores();

    // Limpiar automáticamente cuando el componente se desmonta
    return () => {
      pollingRefs.current.forEach(clearInterval);
      pollingRefs.current = [];
    };
  }, []);

  // Manejar logout
  const handleLogout = () => {
    // Detener todos los intervalos activos
    pollingRefs.current.forEach(clearInterval);
    pollingRefs.current = [];

    // Borrar datos del cliente
    localStorage.removeItem("cliente_data");

    // Resetear estado global (por ejemplo, token)
    dispatch(loginFail());

    // Redirigir
    navigate("/cliente", { replace: true });
  };

  const hasData = Array.isArray(data) && data.length > 0;
  const cliente = hasData ? data[0] : null;

  const columnsRecepcion = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'fecha_ingreso',
      headerName: 'Fecha de Ingreso',
      width: 250,
      valueFormatter: (params) => {
        if (!params) return "";
        return params.slice(0, 16).replace("T", " ");
      },
    },
    {
      field: 'fecha_transaccion',
      headerName: 'Fecha de Transacción',
      width: 250,
      valueFormatter: (params) => {
        if (!params) return "";
        return params.slice(0, 16).replace("T", " ");
      },
    },
    {
      field: 'valor',
      headerName: 'Valor',
      width: 220,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const value = params.value?.toString().replace(/\./g, "").replace(/,/g, "");
        const numericValue = parseFloat(value) || 0;
        const color = numericValue >= 0 ? "#2E7D32" : "#C62828"; // verde oscuro / rojo intenso

        return (
          <strong
            style={{
              color,
              fontSize: "1.9rem",
              fontWeight: "bold",
            }}
          >
            {params.value}
          </strong>
        );
      },
    },
    {
      field: 'tipo',
      headerName: 'Origen',
      width: 280,
      renderCell: (params) => {
        const origen = params.value?.toLowerCase() || "";
        let backgroundColor = "#f0f0f0"; // color base

        if (origen.includes("cotizador")) backgroundColor = "#E8F5E9"; // verde claro
        else if (origen.includes("recepcion")) backgroundColor = "#FFF4DE"; // amarillo suave
        else if (origen.includes("ajuste")) backgroundColor = "#E3F2FD"; // azul claro
        else if (origen.includes("devolucion")) backgroundColor = "#F3E5F5"; // violeta suave
        else if (origen.includes("cargo")) backgroundColor = "#FFEBEE"; // rosado suave

        return (
          <div
            style={{
              backgroundColor,
              borderRadius: "10px",
              padding: "4px 8px",
              fontWeight: "500",
              fontSize: "1.2rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            {params.value}
          </div>
        );
      },
    },
  ];

  const columns = [
    {
      field: "fechaTramite",
      headerName: "Fecha de trámite",
      width: 250,
      valueFormatter: (params) => {
        if (!params) return "";
        const date = new Date(params);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
    },
    {
      field: "acciones",
      headerName: "Documento",
      width: 250,
      renderCell: (params) => {
        if (!params.row.pdf) return null; // Si no hay PDF, no muestra nada

        return (
          <a
            href={`${params.row.pdf}`} // Construcción correcta de la ruta
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip title="Ver PDF">
              <IconButton color="error" size="small">
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
          </a>
        );
      },
    },
    {
      field: "placa",
      headerName: "Placa",
      width: 250,
      renderCell: (params) => (
        <strong style={{ fontSize: "18px" }}>{params.value}</strong>
      ),
    },
    { field: "precioDeLey",       headerName: "Precio de ley", width: 280 },
    { field: "comisionPrecioLey", headerName: "Comisión precio ley", width: 280 },
    { 
      field: "total", 
      headerName: "Total", 
      width: 250,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('es-CO').format(params);
      },
    },
    { field: "nombreCompleto",    headerName: "Nombre", width: 250 },
    /*{
      field: "fechaCreacion",
      headerName: "Fecha de creación",
      width: 250,
      valueFormatter: (params) => {
        if (!params) return "";
        const date = new Date(params);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
    },*/
    /*{ field: "modelo", headerName: "Modelo",  width: 250 },
    { field: "correo", headerName: "Correo electrónico",  width: 250 },
    { field: "chasis", headerName: "Chasis",  width: 250 },
    { field: "cilindraje",        headerName: "Cilindraje",  width: 250 },*/
  ];

  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");

  const [searchText2, setSearchText2] = useState("");
  const [startDate2, setStartDate2]   = useState("");
  const [endDate2, setEndDate2]       = useState("");

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* NAVBAR */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: "#003871" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box component="img" src={movilidadA2} alt="Logo Movilidad 2A" sx={{ height: 50 }} />
          <Button color="inherit" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* CONTENIDO */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#f4f6f8",
          padding: 3,
        }}
      >
        <Grid container spacing={3} >
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                {/*<Avatar
                  src="https://via.placeholder.com/150"
                  alt="User Avatar"
                  sx={{ width: 120, height: 120, margin: "0 auto", mb: 2 }}
                />*/}
              {cliente?.nombre_cliente && (
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {cliente.nombre_cliente}
                </Typography>
              )}
                {cliente?.correo && (
                  <Typography variant="body2" color="text.secondary">
                    {cliente.correo}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <List>
                  <>
                    {cliente?.nombre_cliente && (
                      <ListItem>
                        <ListItemText primary="Nombre" secondary={cliente.nombre_cliente} />
                      </ListItem>
                    )}
                    {cliente?.correo && (
                      <ListItem>
                        <ListItemText primary="Correo Electrónico" secondary={cliente.correo} />
                      </ListItem>
                    )}
                    {cliente?.telefono && (
                      <ListItem>
                        <ListItemText primary="Teléfono" secondary={cliente.telefono} />
                      </ListItem>
                    )}
                    {cliente?.direccion && (
                      <ListItem>
                        <ListItemText primary="Dirección" secondary={cliente.direccion} />
                      </ListItem>
                    )}
                  </>
              </List>
            </Paper>
          </Grid>

          {/* Trámites */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    maxWidth: 600, 
                    mx: 'auto', 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: 2, 
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  <Typography variant="subtitle1" align="center" color="textSecondary">
                    Saldo actual
                  </Typography>
                  <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                    {total == 0 ? 0 : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(total)}
                  </Typography>
              </Paper>

              <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Información de Trámites" />
                <Tab label="Recepción de Pago" />
              </Tabs>
                <TabPanel value={tabIndex} index={0}>
                  {/* Barra de búsqueda */}
                  <TextField
                    label="Buscar..."
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ mb: 2, mr: 2 }}
                  />

                  {/* Filtro por fecha: Desde */}
                  <TextField
                    label="Desde"
                    type="datetime-local"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ mb: 2, mr: 2 }}
                    InputProps={{
                      endAdornment: startDate && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setStartDate("")} size="small">
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Filtro por fecha: Hasta */}
                    <TextField
                      label="Hasta"
                      type="datetime-local"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: endDate && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setEndDate("")} size="small">
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                  <DataGrid
                      rows={data.filter((row) => {
                        console.log("row ",row.fechaTramite)
                      // 🔍 Filtrar por buscador
                      const matchesSearch = Object.values(row).some((value) =>
                        String(value).toLowerCase().includes(searchText.toLowerCase())
                      );

                      // 📅 Filtrar por fechas (ajusta el campo de fecha según tu modelo)
                      const rowDate = new Date(row.fechaTramite); 
                      const validStart = startDate ? rowDate >= new Date(startDate) : true;
                      const validEnd = endDate ? rowDate <= new Date(endDate) : true;

                      return matchesSearch && validStart && validEnd;
                    })}
                    //rows={data}
                    columns={columns}
                    autoHeight
                    disableSelectionOnClick
                    sx={{ 
                      backgroundColor: "white",
                      height: 1000, // 👈 altura fija
                      "& .MuiDataGrid-cell": {
                        fontSize: "18px", // 👈 Tamaño de letra de las celdas
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        fontSize: "20px", // 👈 Tamaño de letra de los headers
                        fontWeight: "bold",
                      },
                      // 🎨 Estilo de filas intercaladas tipo "table-striped"
                      "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9", // fila impar
                      },
                      "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: "#ffffff", // fila par
                      },
                    }}
                  />
                </TabPanel>

              <TabPanel value={tabIndex} index={1}>

                <TextField
                  label="Buscar..."
                  variant="outlined"
                  size="small"
                  value={searchText2}
                  onChange={(e) => setSearchText2(e.target.value)}
                  sx={{ mb: 2, mr: 2 }}
                />

                {/* Filtro por fecha: Desde */}
                <TextField
                  label="Desde"
                  type="datetime-local"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={startDate2}
                  onChange={(e) => setStartDate2(e.target.value)}
                  sx={{ mb: 2, mr: 2 }}
                />

                {/* Filtro por fecha: Hasta */}
                <TextField
                  label="Hasta"
                  type="datetime-local"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={endDate2}
                  onChange={(e) => setEndDate2(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <DataGrid
                  rows={recepcionPagoArray.filter((row) => {
                    // 🔍 Filtro por buscador
                    const matchesSearch = Object.values(row).some((value) =>
                      String(value).toLowerCase().includes(searchText2.toLowerCase())
                    );

                    // 📅 Filtro por fechas (ajusta el campo de fecha de tu data)
                    const rowDate = new Date(row.fecha_transaccion); // <-- cambia si tu campo se llama distinto
                    const validStart = startDate2 ? rowDate >= new Date(startDate2) : true;
                    const validEnd = endDate2 ? rowDate <= new Date(endDate2) : true;

                    return matchesSearch && validStart && validEnd;
                  })}
                  columns={columnsRecepcion}
                  autoHeight
                  disableSelectionOnClick
                  sx={{ 
                    backgroundColor: "white",
                    height: 1000, // 👈 altura fija
                    "& .MuiDataGrid-cell": {
                      fontSize: "18px", // 👈 Tamaño de letra de las celdas
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      fontSize: "20px", // 👈 Tamaño de letra de los headers
                      fontWeight: "bold",
                    },
                    // 🎨 Estilo de filas intercaladas tipo "table-striped"
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: "#f9f9f9", // fila impar
                    },
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: "#ffffff", // fila par
                    },
                  }}
                />
              </TabPanel>

            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          backgroundColor: "#003871",
          color: "white",
          py: 4,
          mt: 6,
          px: 3,
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Movilidad 2A
            </Typography>
            <Typography variant="body2">
              BARRIO OLAYA CLL 31D 63-75<br />
              Cartagena, Colombia
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contacto
            </Typography>
            <Typography variant="body2">📞 314 8556245</Typography>
            <Typography variant="body2">✉️ tramitesmovilidad2a@gmail.com</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Redes Sociales
            </Typography>
            <Box display="flex" alignItems="center">
              <InstagramIcon sx={{ mr: 1 }} />
              <Link
                href="https://instagram.com/movilidad2a"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
              >
                instagram.com/movilidad2a
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Typography variant="caption" color="gray">
            © {new Date().getFullYear()} Movilidad 2A. Todos los derechos reservados.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}