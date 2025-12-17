import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from '@mui/material';
import Button               from '@mui/material/Button';
import PersonAddAltIcon     from '@mui/icons-material/PersonAddAlt';
import ArticleIcon          from '@mui/icons-material/Article';

import { DataTable }                    from '../components/DataTable';
import { resetFormularioStore }         from '../../store/cotizadorStore/cotizadorStore';
import { openModalShared, clearAlert, openModalExcel }  from '../../store/globalStore/globalStore';
import { FormDialogUser }               from '../components/Modal';

import { useSelector, useDispatch }     from 'react-redux';

import { SimpleBackdrop }               from "../../components/Backdrop/BackDrop";
import { getAllThunks, getAllThunksSecond }                 from "../../store/cotizadorStore/cotizadorThunks";
import { getAllThunksTramites }         from '../../store/clientesStore/clientesThunks';
import { getAllThunks as getAllThunksEtiqutas } from '../../store/etiquetasStore/etiquetasThunks';

import { ToastContainer, toast } from 'react-toastify';
import { ModalExcel } from '../components/ModalExcel';
import { URL } from "../../constants.js/constantGlogal";
export const SelectViews = () => {

    const dispatch = useDispatch();
    
    const { alert } = useSelector( state => state.globalStore );
    const { token } = useSelector((state) => state.authStore);
   
    useEffect(() => {
        if (alert) {
          // Muestra la alerta según el tipo
          if (alert.type === 'success') toast.success(alert.message, { position: 'top-center' });
          if (alert.type === 'error') toast.error(alert.message, { position: 'top-center' });
    
          // Limpia la alerta después de mostrarla
          dispatch(clearAlert());
        }
    }, [alert]);

    useEffect(() => {
        dispatch(getAllThunks());
        dispatch(getAllThunksEtiqutas());
        dispatch(getAllThunksTramites());
      },[])

    const handleOpenModal = async () => {
        await dispatch(resetFormularioStore());
        await dispatch(openModalShared())
    }

    const handleOpenModalExcel = () => {
        dispatch(openModalExcel());
    }
    
    //useIntervalDispatch();

    const [loggedUser, setLoggedUser] = useState(null);

    // Cuando tengas el token, puedes decodificarlo para sacar el username
    useEffect(() => {
    if (!token) return;

    // Consumir endpoint /chat/api/me/ para obtener el username
    fetch(`${URL}/cotizador/me/api/me/`, {
        method: "GET",
        headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
        console.log("Datos del usuario tramites:", data);
        setLoggedUser(data.username); // Ajusta según la respuesta de tu API
        })
        .catch((err) => console.error("Error al obtener usuario:", err));
    }, [token]);

  return (  
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid item>
            <Typography fontSize={39} fontWeight="light"> </Typography>
        </Grid>

        <Grid item xs={12} sm="auto" sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            {/* Botón Crear Trámite */}
            <Button 
                color="primary" 
                variant="contained" // Cambiado a contained para jerarquía visual
                onClick={handleOpenModal}
                sx={{ 
                minWidth: { xs: '48px', sm: '160px' },
                px: { xs: 1, sm: 2 } 
                }}
            >
                <PersonAddAltIcon sx={{ fontSize: 24, mr: { xs: 0, sm: 1 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Crear Trámite
                </Box>
            </Button>

            {/* Botón Subir Documento */}
            <Button 
                color="success" 
                variant="outlined" 
                onClick={handleOpenModalExcel}
                sx={{ 
                minWidth: { xs: '48px', sm: '160px' },
                px: { xs: 1, sm: 2 } 
                }}
            >
                <ArticleIcon sx={{ fontSize: 24, mr: { xs: 0, sm: 1 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Subir Documento
                </Box>
            </Button>
        </Grid>

        <Grid container sx={{ mt:2, width:"99.99%" }}>
            < DataTable loggedUser={loggedUser}/>
        </Grid>
        
        {/* START MODAL */}
        <FormDialogUser/>
        <ModalExcel />
        {/* END MODAL */}

        {/* START LOAD */}
        <SimpleBackdrop />
        {/* END LOAD */}

        {/* START ALERT */}
        <ToastContainer
            position="top-center" // Posición predeterminada
            autoClose={100000} // Tiempo de cierre automático
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
}
