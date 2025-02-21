import { useEffect }        from 'react';
import { Grid, Typography } from '@mui/material';
import Button               from '@mui/material/Button';
import PersonAddAltIcon     from '@mui/icons-material/PersonAddAlt';

import { DataTable }                    from '../components/DataTable';
import { resetFormularioStore }         from '../../store/gastosStore/gastosStore';
import { openModalShared, clearAlert }  from '../../store/globalStore/globalStore';
import { FormDialogUser }               from '../components/Modal';

import { useSelector, useDispatch }     from 'react-redux';

import { SimpleBackdrop }               from "../../components/Backdrop/BackDrop";
import { getAllThunks }                 from '../../store/gastosStore/gastosStoreThunks';

import { ToastContainer, toast }        from 'react-toastify';

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
                 Crear Nuevo gasto
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
