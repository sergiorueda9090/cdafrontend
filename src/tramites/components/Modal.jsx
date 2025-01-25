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
  
    // Renderizar contenido basado en la etapa
    const renderContent = () => {
      switch (value) {
        case 'one':
          return <EtapaUno />;
        case 'two':
          return <EtapaDos/>;
        case 'three':
          return <EtapaTres/>;
        case 'four':
          return <EtapaCuatro/>;
        case 'five':
          return <Typography>Contenido de la Etapa Cinco</Typography>;
        default:
          return <Typography>Selecciona una etapa</Typography>;
      }
    };
  
    return (
      <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
        
        <DialogTitle>Crear Tramite</DialogTitle>
  
        <Box sx={{ width: '100%' }}>
          {/* Pestañas */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="Etapa 1 (Digitación)" />
            <Tab value="two" label="Etapa 2 (Gestion del trámite)"  disabled={!id}  />
            <Tab value="three" label="Etapa 3 (Confirmacion de precios)" disabled={!etiquetaUno} />
            <Tab value="four" label="Etapa 4 (Subir PDFs)" disabled={!precioDeLey} />
            <Tab value="five" label="Etapa Cinco" disabled />
          </Tabs>
        </Box>
  
        <Box sx={{ padding: 2 }}>
          {/* Contenido de las etapas */}
          {renderContent()}
        </Box>
      </Dialog>
    );
}