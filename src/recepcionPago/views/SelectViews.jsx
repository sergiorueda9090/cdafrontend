import { useEffect }        from 'react';
import { Grid, Typography } from '@mui/material';
import Button               from '@mui/material/Button';
import PersonAddAltIcon     from '@mui/icons-material/PersonAddAlt';

import { DataTable }                    from '../components/DataTable';
import { openModalShared, clearAlert }  from '../../store/globalStore/globalStore';
import { FormDialogUser }               from '../components/Modal';
import { useSelector, useDispatch }     from 'react-redux';
import { SimpleBackdrop }               from "../../components/Backdrop/BackDrop";
import { ToastContainer, toast } from 'react-toastify';

import { resetFormularioStore }         from '../../store/recepcionPagoStore/recepcionPagoStore';
import { getAllThunks }                 from '../../store/recepcionPagoStore/recepcionPagoStoreThunks';
import { getAllThunksTramites }         from '../../store/clientesStore/clientesThunks';
import { getAllThunks as listTarjetas } from '../../store/registroTarjetasStore/registroTarjetasStoreThunks';

export const SelectViews = () => {

    const dispatch = useDispatch();
    
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

    useEffect(() => {
        dispatch(getAllThunks());
      },[])

    const handleOpenModal = async () => {
        await dispatch(resetFormularioStore());
        await dispatch(getAllThunksTramites());
        await dispatch(listTarjetas());
        await dispatch(openModalShared())
    }
  
  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid item>
            <Typography fontSize={39} fontWeight="light"> </Typography>
        </Grid>

        <Grid item>
            <Button color="primary" variant="outlined" onClick={ (e) => handleOpenModal() }>
                <PersonAddAltIcon sx={{ fontSize:30, mr:1 }}/>
                 Crear Nueva Recepción de pago
            </Button>
        </Grid>

        <Grid container sx={{ mt:2, width:"99.99%" }}>
            < DataTable/>
        </Grid>
        
        {/* START MODAL */}
        <FormDialogUser/>
        {/* END MODAL */}

        {/* START LOAD */}
        <SimpleBackdrop />
        {/* END LOAD */}

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
}
