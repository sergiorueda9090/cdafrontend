import React, { useEffect, useRef,useState } from "react";
import { Dialog, DialogTitle, Tabs, Tab, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';


import { EtapaUno }     from "./EtapaUno";


export const FormDialogUser = () => {

    const dispatch = useDispatch();

    // Estado global del modal y cliente actual
    const { openModalStore } = useSelector((state) => state.globalStore);


    // Cerrar el modal
    const handleClose = () => {
      dispatch(closeModalShared());
    };

  
    return (
      <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
        
        <DialogTitle>Crear Tramite</DialogTitle>  
        <Box sx={{ padding: 2 }}>
          <EtapaUno />
        </Box>
      </Dialog>
    );
}