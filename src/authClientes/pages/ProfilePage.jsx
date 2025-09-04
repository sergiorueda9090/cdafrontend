import React, { useEffect, useState } from "react";
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
  Tooltip
} from "@mui/material";

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
        dispatch(getCotizadoresCliente(clienteData));
      } else {
        console.warn("No hay datos en localStorage al cargar.");
        localStorage.removeItem("cliente_data")
      }

  }, [])

  const startPollingRecepcionPago = () => {
    setInterval(() => {
      const clienteData = JSON.parse(localStorage.getItem("cliente_data"));
      const idCliente = clienteData?.id_cliente;

      if (idCliente) {
        dispatch(showRecepcionPagoSecond(idCliente));
      } else {
        console.warn("ID cliente no encontrado en localStorage.");
      }
    }, 1000); // 1000 ms = 1 segundo
  };

  const startPollingCotizadores = () => {
    setInterval(() => {
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
    }, 1000); // cada segundo
  };

  useEffect(() => {
    startPollingRecepcionPago();
    startPollingCotizadores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cliente_data");
    dispatch(loginFail());
    navigate("/customer/customer", { replace: true });
  };

  const hasData = Array.isArray(data) && data.length > 0;
  const cliente = hasData ? data[0] : null;

      const columnsRecepcion = [
        { field: 'id',                      headerName: 'ID',                     width: 100 },
        {
          field: 'fecha_ingreso',
          headerName: 'Fecha de Ingreso',
          width: 200,
          valueFormatter: (params) => {
            if (!params) return "";
            // Toma los primeros 16 caracteres y reemplaza la "T" por un espacio
            return params.slice(0, 16).replace("T", " ");
          }
        },
        {
          field: 'fecha_transaccion',
          headerName: 'Fecha de Transacción',
          width: 200,
          valueFormatter: (params) => {
            if (!params) return "";
            // Toma los primeros 16 caracteres y reemplaza la "T" por un espacio
            return params.slice(0, 16).replace("T", " ");
          }
        },
        {
          field: 'valor',
          headerName: 'Valor',
          width: 130,
          align: "right", headerAlign: "right",
        },
      ];

  const columns = [
      { field: "placa", headerName: "Placa",  width: 250 },
      { field: "modelo", headerName: "Modelo",  width: 250 },
      { field: "correo", headerName: "Correo electrónico",  width: 250 },
      { field: "chasis", headerName: "Chasis",  width: 250 },
      { field: "cilindraje",        headerName: "Cilindraje",  width: 250 },
      { field: "precioDeLey",       headerName: "precioDeLey", width: 250 },
      { field: "comisionPrecioLey", headerName: "comisionPrecioLey", width: 250 },
      { 
        field: "total", 
        headerName: "Total", 
        width: 250,
        valueFormatter: (params) => {
          return new Intl.NumberFormat('es-CO').format(params);
        },
      },
      { field: "fechaCreacion", headerName: "Fecha de creación",  width: 250 },
      { field: "fechaTramite", headerName: "Fecha de trámite",  width: 250 },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 250,
        renderCell: (params) => {
          if (!params.row.pdf) return null; // Si no hay PDF, no muestra nada

          return (
            <a
              href={`${URL}${params.row.pdf}`} // Construcción correcta de la ruta
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
      }
  ];


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
                <DataGrid
                  rows={data}
                  columns={columns}
                  autoHeight
                  disableSelectionOnClick
                    sx={{ 
                    backgroundColor: "white",
                    height: 1000 // 👈 altura fija
                  }}
                />
              </TabPanel>

              <TabPanel value={tabIndex} index={1}>

                <DataGrid
                  rows={recepcionPagoArray}
                  columns={columnsRecepcion}
                  autoHeight
                  disableSelectionOnClick
                                     sx={{ 
                    backgroundColor: "white",
                    height: 1000 // 👈 altura fija
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