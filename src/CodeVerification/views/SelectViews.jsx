import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import LoginImage from "../../assets/images/img-login.svg"; // Reemplazar con la imagen que tengas

export const SelectViews = () => {
  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", backgroundColor: "#f4f5f7" }}
    >
      {/* Imagen del lado izquierdo */}
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: `url(${LoginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Formulario del lado derecho */}
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ p: 4, width: "100%", maxWidth: 400 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 2, textAlign: "center" }}>
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}
          >
            Please enter your login details
          </Typography>

          <Box component="form" noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{ borderRadius: 1 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{ borderRadius: 1 }}
            />



            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, backgroundColor: "#673ab7" }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
