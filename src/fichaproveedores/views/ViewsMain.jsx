import React, { useState, useEffect }               from "react";
import { Grid, Typography, Box, Card, Button }      from "@mui/material";

import { ToastContainer } from 'react-toastify';
import { DataTable } from '../components/DataTable';
import { ModalPagos } from "../components/ModalPagos";

export const ViewsMain = () => {

  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid container sx={{ mt:2, width:"99.99%" }}>
            < DataTable/>
        </Grid>

        <ModalPagos />

              {/* START ALERT */}
              <ToastContainer
                  position="top-center" // Posición predeterminada
                  autoClose={1000} // Tiempo de cierre automático
                  hideProgressBar={false} // Mostrar barra de progreso
                  newestOnTop={true} // Notificaciones más recientes arriba
                  closeOnClick // Cierre al hacer clic
                  draggable // Arrastrar para cerrar
                  pauseOnHover // Pausar al pasar el ratón
                  theme="colored" // Tema colorido
              />
              {/* END ALERT */}
    </Grid>
  )
};
