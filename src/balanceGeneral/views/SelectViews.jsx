import { useEffect }        from 'react';
import { Grid, Typography } from '@mui/material';
import Button               from '@mui/material/Button';
import PersonAddAltIcon     from '@mui/icons-material/PersonAddAlt';

import { DataTable }                    from '../components/DataTable';
import { resetFormularioStore }         from '../../store/clientesStore/clientesStore';
import { openModalShared, clearAlert }  from '../../store/globalStore/globalStore';
import { FormDialogUser }               from '../components/Modal';

import { useSelector, useDispatch }     from 'react-redux';

import { SimpleBackdrop }               from "../../components/Backdrop/BackDrop";
import { getAllThunks }                 from '../../store/cuentasBancariasStore/cuentasBancariasThunks';

import { ToastContainer, toast } from 'react-toastify';

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
    <Grid container direction="row" justifyContent="space-between" sx={{ mb: { xs: 0.5, sm: 1 } }} alignItems='center'>

        <Grid item xs={12}>
            <Typography fontSize={{ xs: 24, sm: 32, md: 39 }} fontWeight="light"> </Typography>
        </Grid>

        {/*<Grid item xs={12} sm="auto">
            <Button
              color="primary"
              variant="outlined"
              onClick={ (e) => handleOpenModal() }
              fullWidth={{ xs: true, sm: false }}
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
                <PersonAddAltIcon sx={{ fontSize: { xs: 24, sm: 28, md: 30 }, mr: 1 }}/>
                 Crear Tarjeta Bancaria
            </Button>
        </Grid>*/}

        <Grid container sx={{ mt: { xs: 1, sm: 2 }, width: "100%" }}>
            <DataTable/>
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
