import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, Link } from "@mui/material";
import LoginImage         from "../../assets/images/img-login.svg";
import fondoMovilidad     from "../../assets/images/fondoMovilidad.jpg";
import { getLogin }       from "../../store/authCustomers/authCustomersThunks";
import { useDispatch }    from "react-redux";
import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { useSelector } from "react-redux";
import { clearAlert }  from '../../store/globalStore/globalStore';
import { ToastContainer, toast } from 'react-toastify';

export const LoginPage = () => {
  
  const dispatch = useDispatch();

  const [identificacionLogin, setIdentificacionLogin] = useState('');
  const [error, setError] = useState('');
  
  const { alert }  = useSelector( state => state.globalStore );

  useEffect(() => {
    if (alert) {
      // Muestra la alerta según el tipo
      if (alert.type === 'success') toast.success(alert.message, { position: 'top-center' });
      if (alert.type === 'error') toast.error(alert.message, { position: 'top-center' });

      // Limpia la alerta después de mostrarla
      dispatch(clearAlert());
    }
}, [alert]);

  const handleLogin = () => {
    
    if (identificacionLogin.length <= 5) {
    
      setError('El número de identificación no valido.');
   
    } else {
      
      setError('');
     
      dispatch(getLogin(identificacionLogin));
   
    }
  };

  const handleChange = (e) => {
    const identificacion = e.target.value;
    setIdentificacionLogin(identificacion);
    if (identificacion.length > 5) {
      setError('');
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${fondoMovilidad})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "400px",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 2,
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img 
            src={LoginImage} 
            alt="Logo" 
            style={{ width: "160px", height: "160px", marginBottom: "1rem" }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: "1rem", textAlign: "center" }}
        >
          ¡Bienvenido a Movilidad 2A!
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#6b7280", marginBottom: "2rem" }}
        >
          Consulta el estado de tu SOAT y mantén tu auto asegurado.
        </Typography>

        <form>
          <TextField
            label="Número de Identificación"
            name="identificacion"
            value={identificacionLogin}
            onChange={handleChange}
            type="text"
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error}
            sx={{ marginBottom: "1.5rem" }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              padding: "0.75rem",
              backgroundColor: "#114276",
              ":hover": { backgroundColor: "#114276" },
            }}
            onClick={handleLogin}
          >
            Generar Token
          </Button>
        </form>
      </Paper>
      <SimpleBackdrop />



          {/* START ALERT */}
          <ToastContainer
            position="top-center" // Posición predeterminada
            autoClose={4000} // Tiempo de cierre automático
            hideProgressBar={false} // Mostrar barra de progreso
            newestOnTop={true} // Notificaciones más recientes arriba
            closeOnClick // Cierre al hacer clic
            draggable // Arrastrar para cerrar
            pauseOnHover // Pausar al pasar el ratón
            theme="colored" // Tema colorido
        />
        {/* END ALERT */}

    </Box>
  );
};
