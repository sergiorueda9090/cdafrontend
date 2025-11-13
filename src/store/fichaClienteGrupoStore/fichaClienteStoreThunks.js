import axios from "axios";
import { showBackDropStore, hideBackDropStore } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { listStore } from "./fichaClienteGrupoStore.js";

// Función asincrónica para obtener los Pokemons
const parametersURL = 'fichacliente/api/';

export const getAllThunks = (fechaInicio, fechaFin, query = "") => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token       = authStore.token

        let url = `${ URL}/${parametersURL}fichaclientes/agrupado/`;
  
        // Construcción de parámetros
        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin)    params.append("fechaFin", fechaFin);
        if (query.trim()) params.append("q", query.trim());

        // Agregar parámetros si existen
        if ([...params].length > 0) {
            url += `?${params.toString()}`;
        }

        
        // Iniciar la carga
        const options = {
            method: 'GET',
            url: url,
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
                    
                    await dispatch(listStore({'fichasClienteGrupo':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'fichasClienteGrupo':[]}))

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
