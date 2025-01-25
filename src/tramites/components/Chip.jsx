import React from "react";
import { Chip } from "@mui/material";

const getStatusColor = (estado) => {
  switch (estado) {
    case "Recepción":
      return "primary"; // Azul
    case "Validación":
      return "warning"; // Amarillo
    case "Ejecución":
      return "secondary"; // Naranja
    case "Finalización":
      return "success"; // Verde
    default:
      return "default"; // Gris
  }
};

export const StatusChip = ({ estado }) => {
  return (
    <Chip
      label={estado}
      color={getStatusColor(estado)}
      variant="outlined"
      style={{ fontWeight: "bold", textTransform: "capitalize" }}
    />
  );
};
