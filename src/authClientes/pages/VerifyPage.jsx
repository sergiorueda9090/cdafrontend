import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import TokenImage from "../../assets/images/token.svg";
import fondoMovilidad from "../../assets/images/fondoMovilidad.jpg";

export const VerifyPage = () => {
  return (
    <Grid
      container
      component="main"
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
             overflow: "hidden"
           }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        sx={{
          textAlign: "center",
          p: 3,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          boxShadow: 3,
        }}
      >
        <Box>
          <img
            src={TokenImage}
            alt="Token Verification"
            style={{ maxWidth: "120px", height: "auto", marginBottom: "20px" }}
          />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Ingrese el Código de Verificación
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          Hemos enviado un código a su WhatsApp. Por favor, revise su aplicación de WhatsApp y copie el código enviado para ingresarlo a continuación y verificar su cuenta.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {[...Array(6)].map((_, index) => (
            <Grid item xs={2} key={index}>
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 1.5, backgroundColor: "#673ab7" }}
        >
          Verificar Código
        </Button>

        {/*<Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          ¿No recibió el código? <Button variant="text">Reenviar</Button>
        </Typography>*/}
      </Grid>
    </Grid>
  );
};
