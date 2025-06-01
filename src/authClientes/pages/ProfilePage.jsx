import React, { useEffect } from "react";
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
  Link
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginFail } from "../../store/authCustomers/authCustomers"; // Ajusta según tu path
import InstagramIcon from "@mui/icons-material/Instagram";
import movilidadA2 from "../../assets/images/movilidadA2.jpeg"; // Ajusta si tu alias no es "@/"
import { getCotizadoresCliente } from "../../store/authCustomers/authCustomersThunks";


export const ProfilePage = () => {
  
  const { data } = useSelector((state) => state.authCustomerStore);
  

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

  const handleLogout = () => {
    localStorage.removeItem("cliente_data");
    dispatch(loginFail());
    navigate("/customer/customer", { replace: true });
  };

  const hasData = Array.isArray(data) && data.length > 0;
  const cliente = hasData ? data[0] : null;

  const columns = [
      { field: "placa", headerName: "Placa", flex: 1 },
      { field: "modelo", headerName: "Modelo", flex: 1 },
      { field: "correo", headerName: "Correo electrónico", flex: 1 },
      { field: "chasis", headerName: "Chasis", flex: 1 },
      { field: "cilindraje", headerName: "Cilindraje", flex: 1 },
      { field: "total", headerName: "Total", flex: 1 },
      { field: "fechaCreacion", headerName: "Fecha de creación", flex: 1 },
      { field: "fechaTramite", headerName: "Fecha de trámite", flex: 1 },
      {
          field: "acciones",
          headerName: "Acciones",
          flex: 1,
          renderCell: (params) => (
            <a
              href={`http://127.0.0.1:8000${params.row.pdf}`} // cambia TU_BACKEND.com por tu dominio
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton color="error">
                <PictureAsPdfIcon />
              </IconButton>
            </a>
          ),
    },
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
        <Grid container spacing={3} sx={{ maxWidth: "1200px", width: "100%" }}>
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
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Información de Trámites
              </Typography>
              <DataGrid
                rows={data}
                columns={columns}
                autoHeight
                disableSelectionOnClick
                sx={{ backgroundColor: "white" }}
              />
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
