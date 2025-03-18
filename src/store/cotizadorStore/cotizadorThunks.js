import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showThunk as precioClientesShow } from "../clientesStore/clientesThunks.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { showStore, listStore, resetFormularioStore, handleFormStore  } from "./cotizadorStore.js";
// Función asincrónica para obtener los Pokemons
const urlPatter = "cotizador";

export const getAllThunks = () => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/${urlPatter}/api`,
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
                    
                    await dispatch(listStore({'cotizadores':data, 'dateFilter':false}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'cotizadores':[], 'dateFilter':false}))

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

export const createThunks = (data, modulo="") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
        console.log("data ",data)
        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url: `${URL}/${urlPatter}/api/create/`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
              },
            data:data
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status == 201){
                
                await dispatch(resetFormularioStore());

                await dispatch(setAlert({ message: '¡✨ Acción completada con éxito!', type: 'success'}));

                if(modulo == "tramite"){

                    await dispatch( getAllCotizadorTramitesThunks() );

                }else{

                    await dispatch( getAllThunks() );
                    
                }
                

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.success('Successfully created!');
            }else if(response.status == 200){
                
                await dispatch(resetFormularioStore());

                await dispatch(setAlert({ message: `¡🚗 ${response.data.error}`, type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

            }else{

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.error('This is an error!');;
            }
            

        } catch (error) {

            // Mostrar una alerta con el mensaje de error
            await dispatch(setAlert({ message: '❌ Error en el servidor.', type: 'error'}));

            await dispatch( getAllThunks() );

            //await dispatch ( loginFail() );

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const showThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}/${urlPatter}/api/${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){
                
                await dispatch(showStore(response.data) );

                if(response.data.idCliente){

                    await dispatch(precioClientesShow(response.data.idCliente));
                    
                }

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));
 
            }
            

        } catch (error) {

            await dispatch ( loginFail() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const updateThunks = (data, modulo="") => {
    
    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
    
        await dispatch(showBackDropStore());

        const options = {
            method: 'PUT',
            url: `${URL}/${urlPatter}/api/${data.id}/update/`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
              },
            data:data
        }
        /******************************** */

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 201 || response.status == 200){
                
                await dispatch(resetFormularioStore());

                await dispatch(setAlert({ message: '¡ ✏️ Acción completada con éxito!', type: 'success'}));

                if(modulo == "cotizador"){
                
                    await dispatch(getAllThunks());

                }else if(modulo == "tramite"){

                    await dispatch( getAllCotizadorTramitesThunks() );

                }else if(modulo == "confirmarprecio"){

                    //Before await dispatch( getAllCotizadorConfirmacionPreciosThunks() );
                    await dispatch( getAllCotizadorTramitesThunks() );

                }else if(modulo == "pdf"){

                    await dispatch( getAllCotizadorPdfsThunks() );

                }else{
                    
                    alert("eeeee");

                }
                

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.success('Successfully created!');
            }else{

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));

                await dispatch( getAllCotizadorTramitesThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.error('This is an error!');;
            }
            

        } catch (error) {

            
            await dispatch(setAlert({ message: '❌ Error en el servidor.', type: 'error'}));
            
            //await dispatch ( loginFail() );

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const deleteThunk = (idUser = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${ URL}/${urlPatter}/api/${idUser}/delete/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            await dispatch( hideBackDropStore() );
            
            // Despachar la acción setAuthenticated con la respuesta de la solicitud
            if(response.status == 204){

                await dispatch( getAllThunks() );

                await dispatch(setAlert({ message: '¡ 🗑️ Acción completada con éxito!', type: 'success'}));

            }else{

                await dispatch(setAlert({ message: ' ❌ Ocurrió un error.', type: 'error'}));

            }
            

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(setAlert({ message: 'Ocurrió un error.', type: 'error'}));
            
            await dispatch ( loginFail() );
            
            // Manejar errores
            console.error(error);
        }

    }

}

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data; // Extraer el nombre y el valor del evento
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};

export const getAllCotizadorTramitesThunks = () => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/cotizador/get_logs_cotizador_tramites/api`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
        
            if(response.status === 200){

                let data = response.data;
                
                console.log("datos ",data);

                if(data.length > 0){
                    
                    await dispatch(listStore({'cotizadores':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'cotizadores':[]}))

                    await dispatch(hideBackDropStore());
                }

            }else{

                await dispatch(hideBackDropStore());

            }


        } catch (error) {
            
            await dispatch(hideBackDropStore());

            // Manejar errores
            console.error(error);
            
            await dispatch ( loginFail() );
            
            await dispatch( hideBackDropStore() );

        }
    };
};

export const getAllCotizadorConfirmacionPreciosThunks = () => {

    return async (dispatch, getState) => {
       
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/cotizador/get_cotizadores_confirmacion_precios/api`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
        
            if(response.status === 200){

                let data = response.data;
                
                console.log("datos ",data);

                if(data.length > 0){
                    
                    await dispatch(listStore({'cotizadores':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'cotizadores':[]}))

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

export const getAllCotizadorPdfsThunks = () => {

    return async (dispatch, getState) => {
       
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/cotizador/get_cotizadores_pdfs/api`,
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
                    
                    await dispatch(listStore({'cotizadores':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'cotizadores':[]}))

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

export const getAllFilterDateThunks = (fechaInicio, fechaFin) => {

    return async (dispatch, getState) => {
        await dispatch(showBackDropStore());
        
        const { authStore } = getState();
        const token = authStore.token;

        // Construir la URL con los parámetros de fecha
        let url = `${URL}/cotizador/get_cotizadores_filter_date/api/`;

        // Agregar las fechas a los parámetros de la URL si existen
        if (fechaInicio || fechaFin) {
            const params = new URLSearchParams();
            if (fechaInicio) params.append("fechaInicio", fechaInicio);
            if (fechaFin) params.append("fechaFin", fechaFin);
            url += `?${params.toString()}`;
        }

        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if (response.status === 200) {
                let data = response.data;

                // Si hay datos, actualizar el store
                await dispatch(listStore({ cotizadores: data.length > 0 ? data : [], dateFilter: true }));
            }

        } catch (error) {
            console.error("Error al obtener cotizadores:", error);
        }

        // Ocultar el loader sin importar si hubo éxito o error
        await dispatch(hideBackDropStore());
    };
};


export const search_cotizadores = (searchTerm) => {

    return async (dispatch, getState) => {

        await dispatch(showBackDropStore());
        
        const { authStore } = getState();

        const token = authStore.token;

        let url = `${URL}/cotizador/search_cotizadores/api/`;

        const options = {
            method: "GET",
            url: url,
            headers: {Authorization: `Bearer ${token}`},
            params:  { q: searchTerm },
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if (response.status === 200) {
                let data = response.data;
                // Si hay datos, actualizar el store
                await dispatch(listStore({ cotizadores: data.length > 0 ? data : [], dateFilter: true }));
            }

        } catch (error) {
            console.error("Error al obtener cotizadores:", error);
        }

        // Ocultar el loader sin importar si hubo éxito o error
        await dispatch(hideBackDropStore());
    };
};
