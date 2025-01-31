import axios            from "axios";
import { loginFail }    from "../authStore/authStore.js";
import { showBackDropStore, hideBackDropStore } from "../globalStore/globalStore.js";
import { URL }          from "../../constants.js/constantGlogal.js";
import { listStore  }   from "./logsCotizadorStore.js";

// Función asincrónica para obtener los Pokemons
export const getAllThunks = (id) => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore}   = getState();
        const token         = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/cotizador/get_logs_cotizador/api/${id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
        
            if(response.status === 200){

                let data = response.data;

                if(data.length > 0){
                    
                    await dispatch(listStore({'logsCotizador':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'logsCotizador':[]}))

                    await dispatch(hideBackDropStore());
                }

            }else{

                await dispatch(hideBackDropStore());

            }


        } catch (error) {
            
            await dispatch(hideBackDropStore());

            // Manejar errores
            console.error(error);
            
            //await dispatch ( loginFail() );
            
            await dispatch( hideBackDropStore() );

        }
    };
};
