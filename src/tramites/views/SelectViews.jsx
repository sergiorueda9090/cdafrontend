import { useState,  useEffect }        from 'react';
import { Grid, Typography } from '@mui/material';
import Button               from '@mui/material/Button';
import PersonAddAltIcon     from '@mui/icons-material/PersonAddAlt';

import { DataTable }                    from '../components/DataTable';
import { resetFormularioStore }         from '../../store/tramitesStore/tramitesStore';
import { openModalShared, clearAlert }  from '../../store/globalStore/globalStore';
import { FormDialogUser }               from '../components/Modal';

import { useSelector, useDispatch }     from 'react-redux';

import { SimpleBackdrop }                 from "../../components/Backdrop/BackDrop";
import { getAllCotizadorTramitesThunks, getAllCotizadorTramitesSecondThunks }  from "../../store/cotizadorStore/cotizadorThunks";
import { URL } from "../../constants.js/constantGlogal";
//import { getAllThunksTramites }           from '../../store/clientesStore/clientesThunks';

import { ToastContainer, toast } from 'react-toastify';

export const SelectViews = () => {

    const dispatch = useDispatch();
    
    const { alert }  = useSelector( state => state.globalStore );
    const { token } = useSelector((state) => state.authStore);
    const [loggedUser, setLoggedUser] = useState(null);

        /*const useIntervalDispatch = () => {
            useEffect(() => {
                let isMounted = true;
                let timeoutId;
                let controller = new AbortController();
        
                const fetchLoop = async () => {
                controller.abort(); // cancela petición previa
                controller = new AbortController();
        
                await dispatch(getAllCotizadorTramitesSecondThunks(controller.signal));
        
                if (isMounted) {
                    timeoutId = setTimeout(fetchLoop, 1000);
                }
                };
        
                fetchLoop();
        
                return () => {
                isMounted = false;
                clearTimeout(timeoutId);
                controller.abort(); // 🔑 aborta request pendiente al desmontar
                };
            }, [dispatch]);
        };*/

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
        dispatch(getAllCotizadorTramitesThunks());
    },[])

    //useIntervalDispatch();

  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid item>
            <Typography fontSize={39} fontWeight="light"> </Typography>
        </Grid>

        <Grid container sx={{ mt:2, width:"99.99%" }}>
            < DataTable loggedUser={loggedUser}/>
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
