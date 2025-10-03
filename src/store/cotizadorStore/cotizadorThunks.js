import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showThunk as precioClientesShow } from "../clientesStore/clientesThunks.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { showStore, listStore, resetFormularioStore, handleFormStore, listStoreUpdate, listRemoveStore, listTramitesStore, listAddStore  } from "./cotizadorStore.js";
import { handleFormColumnsConfirmacionPrecioStore } from "../proveedoresStore/proveedoresStore.js";
import { getAllThunks as getAllThunksProveedores }   from "../proveedoresStore/proveedoresThunks.js";

// Función asincrónica para obtener los Pokemons
const urlPatter = "cotizador";

export const  getAllThunks = () => {

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

export const  getAllCotizadorThunks = () => {

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
                    
                    await dispatch(listTramitesStore({'cotizadores':data, 'dateFilter':false}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listTramitesStore({'cotizadores':[], 'dateFilter':false}))

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

                await dispatch(setAlert({ message: `¡🚗 ${response.data.error}`, type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.error('This is an error!');;
            }
            

        }catch (error) {
            const errorData = error.response?.data;

            let errorMessage = '❌ Ha ocurrido un error.';

            if (typeof errorData === 'string') {
                errorMessage = `❌ ${errorData}`;
            } else if (typeof errorData === 'object') {
                // Convertimos errores del tipo { campo: ["mensaje"] } a texto
                errorMessage = '❌ ' + Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join(' | ');
            }
            await dispatch(setAlert({ message: errorMessage, type: 'error' }));
            await dispatch(getAllThunks());
            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());
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

export const updateThunks = (data, modulo="", confirmar="") => {
  
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

                    await dispatch(getAllCotizadorThunks());

                }else if(modulo == "tramite"){

                    await dispatch( getAllCotizadorTramitesThunks() );

                }else if(modulo == "confirmarprecio"){

                    if(confirmar == "confirmar"){
                        await dispatch(getAllCotizadorConfirmacionPreciosRemoveThunks(data.id) );
                    }else{
                        await dispatch( getAllCotizadorConfirmacionPreciosIdThunks(data.id) );
                    }


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

            
            await dispatch(setAlert({ message: `❌ ${error.response.data.error}.`, type: 'error'}));
            
            //await dispatch ( loginFail() );

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error.response.data.error);
       
        }

    }

}

export const updatePdfThunks = (data, modulo="") => {
    
    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
    
        await dispatch(showBackDropStore());

        const options = {
            method: 'PUT',
            url: `${URL}/${urlPatter}/api/${data.id}/updatepdf/`,
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

                    await dispatch( getAllCotizadorConfirmacionPreciosThunks() );
                    //await dispatch( getAllCotizadorTramitesThunks() );

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

export const deleteThunk = (idUser = "", modulo="") => {

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

                if(modulo == "cotizador"){
                    await dispatch( getAllCotizadorThunks() );
                }else{
                    await dispatch( getAllThunks() );
                }
                

                await dispatch(setAlert({ message: '¡ 🗑️ Acción completada con éxito!', type: 'success'}));

            }else if(response.status == 200){

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
        
        await dispatch(listStore({'cotizadores':[]}))

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

export const getAllCotizadorCotizadorRemoveThunks = (id) => {
    return async (dispatch, getState) => {
        await dispatch(listRemoveStore({'id':id}));        
    };
};

export const getAllCotizadorTramitesSecondThunks = () => {

    return async (dispatch, getState) => {
        
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
                
                if(data.length > 0){
                    
                    await dispatch(listStore({'cotizadores':data}))

                }else{

                    await dispatch(listStore({'cotizadores':[]}))

                }

            }


        } catch (error) {


            // Manejar errores
            console.error(error);
        

        }
    };
};

export const getAllEliminarCotizadorTramitesThunks = (id) => {

    return async (dispatch, getState) => {
        
    
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
        
        await dispatch(listStore({'cotizadores':[]}))

        await dispatch(showBackDropStore());
        
        const {authStore} = getState();

        //defaultProv
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

                if(data.length > 0){
        
                    await dispatch(listStore({'cotizadores':data}));
                    // Filtrar los elementos con etiqueta_nombre "seguros generales"

                    await dispatch(getAllThunksProveedores())

                            
                    const {proveedoresStore} = getState();
                  
                    for (const item of data) {
                        const dataConfirmacionPrecio = {
                            id_row            : item.id,
                            idProveedor       : proveedoresStore.defaultProv.id,
                            nombre            : "Seguros generales",
                            etiqueta          : "seguros generales",
                            comisionProveedor : 0,
                            banco             : "",
                            idBanco           : ""
                        };

                        await dispatch(handleFormColumnsConfirmacionPrecioStore({
                            name: 'columnsConfirmacionPrecios',
                            value: dataConfirmacionPrecio
                        }));
                    }

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

export const getAllCotizadorConfirmacionPreciosRemoveThunks = (id) => {

    return async (dispatch, getState) => {
       
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();

        //defaultProv
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

                if(data.length > 0){

                    console.log("data ", data);
                    //await dispatch(listStore({'cotizadores':data}));
                    
                    await dispatch(listRemoveStore({'id':id}));
                    // Filtrar los elementos con etiqueta_nombre "seguros generales"


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

export const getAllCotizadorConfirmacionPreciosAddThunks = (id) => {

    return async (dispatch, getState) => {
       
        await dispatch(showBackDropStore());
        console.log("==========================")
        const {authStore} = getState();

        //defaultProv
        const token = authStore.token;

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${URL}/cotizador/get_cotizadores_confirmacion_precios/api`,
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

                    console.log("data ", data);

                    // En vez de eliminar, ahora agregamos
                    // Buscar el cotizador en la lista por ID
                    const cotizadorEncontrado = data.find(c => c.id === id);

                    if (cotizadorEncontrado) {
                        await dispatch(listAddStore(cotizadorEncontrado));
                    } else {
                        console.log(`⚠️ No se encontró cotizador con id ${id}`);
                        await dispatch(listAddStore(cotizadorEncontrado));
                    }

                    await dispatch(hideBackDropStore());

                } else {

                    await dispatch(listStore({'cotizadores': []}));

                    await dispatch(hideBackDropStore());
                }

            } else {
                await dispatch(hideBackDropStore());
            }

        } catch (error) {
            
            await dispatch(hideBackDropStore());

            console.error(error);
        }
    };
};

export const getAllCotizadorConfirmacionPreciosIdThunks = (id) => {

    return async (dispatch, getState) => {
       
        await dispatch(showBackDropStore());
        
        const {authStore, cotizadorStore} = getState();
        
        //defaultProv
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/cotizador/get_cotizadores_confirmacion_precios/api/${id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            console.log("======================== (response.status ",response.status)
            if(response.status == 200){

                /*let data = response.data;

                console.log("data ", data.id);
                console.log("cotizadorStore.cotizadores ",cotizadorStore.cotizadores)
                cotizadorStore.cotizadores = cotizadorStore.cotizadores.map(c =>
                    c.id === data.id ? { ...c, comisionPrecioLey: data.comisionPrecioLey } : c
                );*/

                  let data = response.data;

                console.log("data ", data.id);
                console.log("cotizadorStore.cotizadores ", cotizadorStore.cotizadores);

                // solo despachas el objeto
                await dispatch(listStoreUpdate({ cotizadores: data }));

                if(data.length > 0){
                    console.log("data ", data);
                    console.log("cotizadorStore.cotizadores ",cotizadorStore.cotizadores)
                    //await dispatch(listStore({'cotizadores':data}));
                    
                    await dispatch(listStoreUpdate({'cotizadores':data}));
                    // Filtrar los elementos con etiqueta_nombre "seguros generales"

                    await dispatch(getAllThunksProveedores())

                            
                    const {proveedoresStore} = getState();
                  
                    for (const item of data) {
                        const dataConfirmacionPrecio = {
                            id_row            : item.id,
                            idProveedor       : proveedoresStore.defaultProv.id,
                            nombre            : "Seguros generales",
                            etiqueta          : "seguros generales",
                            comisionProveedor : 0,
                            banco             : "",
                            idBanco           : ""
                        };

                        await dispatch(handleFormColumnsConfirmacionPrecioStore({
                            name: 'columnsConfirmacionPrecios',
                            value: dataConfirmacionPrecio
                        }));
                    }

                    await dispatch(hideBackDropStore());

                }else{

                    //await dispatch(listStore({'cotizadores':[]}))

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
       
        await dispatch(listStore({'cotizadores':[]}))
        
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


export const getAllFilterDatePdfThunks = (fechaInicio, fechaFin, query = "") => {

    return async (dispatch, getState) => {

        await dispatch(showBackDropStore());

        const { authStore } = getState();
        const token = authStore.token;

        let url = `${URL}/cotizador/get_cotizadores_pdf_filter_date/api/`;

        // Construcción de parámetros
        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin)    params.append("fechaFin", fechaFin);
        if (query.trim()) params.append("q", query.trim());

        // Agregar parámetros si existen
        if ([...params].length > 0) {
            url += `?${params.toString()}`;
        }

        const options = {
            method: "GET",
            url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
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
            console.error("Error al obtener cotizadores:", error);
        }

        await dispatch(hideBackDropStore());
    };
};

export const update_cotizador_devolver = (data) => {
    
    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
    
        await dispatch(showBackDropStore());

        const options = {
            method: 'PUT',
            url: `${URL}/${urlPatter}/update_cotizador_devolver/api/${data.id}/`,
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

                if(data.devolver == "cotizador"){
                
                    await dispatch(getAllThunks());

                }else if(data.devolver == "tramite"){

                    await dispatch( getAllCotizadorTramitesThunks() );

                }else if(data.devolver == "confirmarprecio"){

                    await dispatch( getAllCotizadorConfirmacionPreciosThunks() );


                }else if(data.devolver == "pdf"){

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


export const getAllThunksSecond = () => {

    return async (dispatch, getState) => {
        
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
                    
                    await dispatch(listTramitesStore({'cotizadores':data, 'dateFilter':false}))

                }else{

                    await dispatch(listTramitesStore({'cotizadores':[], 'dateFilter':false}))


                }

            }


        } catch (error) {
            
  

            // Manejar errores
            console.error(error);
            

        }
    };
};


export const createExcelThunks = (data, modulo="") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url: `${URL}/${urlPatter}/api/createexcel/`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            data:JSON.stringify({ registros: data })
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status == 201){
                

                await dispatch(setAlert({
                    message: `✅ ${response.data.guardados.length} registros guardados exitosamente.`,
                    type: 'success'
                }));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );

            }else if(response.status == 207){
                
                const erroresTexto = response.data.errores
                    .map(err => `Fila ${err.fila}: ${err.error}`)
                    .join("\n"); // unimos en un string legible

                await dispatch(
                setAlert({
                    message: `⚠️ Guardados: ${response.data.guardados.length}, Errores: ${response.data.errores.length}\n\n${erroresTexto}`,
                    type: "error",
                    autoHide: false,
                })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );

                console.table(response.data.errores); // 🔥 ver errores en consola

            }else{

                await dispatch(setAlert({ message: `¡🚗 ${response.data.error}`, type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
       
            }
            

        }catch (error) {
            let errorMessage = '❌ Ha ocurrido un error.'
            await dispatch(setAlert({ message: errorMessage, type: 'error' }));
            await dispatch(getAllThunks());
            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());
            console.error(error);
        }

    }

}