import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "../../assets/images/404cda.svg";

export const NothingSelectedView = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/users"); // Redirige al dashboard o a la página de inicio
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", backgroundColor: "#f4f5f7" }}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
        }}
      >
        <img
          src={NotFoundImage}
          alt="404 Not Found"
          style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
        />

        <Typography
          variant="h5"
          sx={{ mt: 2, mb: 3, color: "text.secondary" }}
        >
          Oops! The page you're looking for isn't here.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2, px: 5, py: 1.5, backgroundColor: "#673ab7" }}
          onClick={handleGoBack}
        >
          Back to Home
        </Button>
      </Box>
    </Grid>
  );
}
