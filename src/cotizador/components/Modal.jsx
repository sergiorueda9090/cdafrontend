import React, { useEffect, useRef,useState } from "react";
import { Dialog, DialogTitle, Tabs, Tab, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks }     from '../../store/clientesStore/clientesThunks';

import { EtapaUno }     from "./EtapaUno";
import { EtapaDos }     from "./EtapaDos";
import { EtapaTres }    from "./EtapaTres";
import { EtapaCuatro }  from "./EtapaCuatro";

export const FormDialogUser = () => {

    const dispatch = useDispatch();

    // Estado global del modal y cliente actual
    const { openModalStore } = useSelector((state) => state.globalStore);
    const { id, etiquetaUno, precioDeLey } = useSelector((state) => state.tramitesStore);
  
    // Cerrar el modal
    const handleClose = () => {
      dispatch(closeModalShared());
    };
  

    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
      setValue(newValue);
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