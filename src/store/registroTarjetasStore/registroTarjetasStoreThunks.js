import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { showStore, listStore, resetFormularioStore, handleFormStore , listTotalStore } from "./registroTarjetasStore.js";

// Función asincrónica para obtener los Pokemons
const parametersURL = 'registrotarjetas/api/';
const parametersURLT = 'traslados/api/create/';

export const getAllThunks = () => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/${parametersURL}tarjetas/`,
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
                    
                    await dispatch(listStore({'tarjetasBancarias':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'tarjetasBancarias':[]}))

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

export const createThunks = (data) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());


        const options = {
            method: 'POST',
            url: `${URL}/${parametersURL}tarjeta/crear/`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
              },
            data:data
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            console.log("response.data ",response);

            if(response.status == 201){
                
                await dispatch(resetFormularioStore());

                await dispatch(setAlert({ message: '¡✨ Acción completada con éxito!', type: 'success'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.success('Successfully created!');
            }else{

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.error('This is an error!');;
            }
            

        } catch (error) {

            //await dispatch ( loginFail() );
            await dispatch(setAlert({ message: '❌ Error en el servidor.', type: 'error'}));
            
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
            url: `${ URL}/${parametersURL}tarjeta/${id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){

                await dispatch(showStore(
                                            { id            : response.data.id ?? '',
                                              numero_cuenta : response.data.numero_cuenta ?? '',
                                              nombre_cuenta : response.data.nombre_cuenta ?? '',
                                              descripcion   : response.data.descripcion ?? '',
                                              saldo         : response.data.saldo ?? '',
                                              imagen        : response.data.imagen ?? '',
                                              banco         : response.data.banco ?? '',
                                              transMoneyState: false,
                                              is_daviplata  : response.data.is_daviplata ?? '',
                                            }
                                        )
                                );

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));
 
            }
            

        } catch (error) {

            //await dispatch ( loginFail() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const transMoneyThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}/${parametersURL}tarjeta/${id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){

                await dispatch(showStore(
                                            { id            : response.data.id ?? '',
                                              numero_cuenta : response.data.numero_cuenta ?? '',
                                              nombre_cuenta : response.data.nombre_cuenta ?? '',
                                              descripcion   : response.data.descripcion ?? '',
                                              saldo         : response.data.saldo ?? '',
                                              imagen        : response.data.imagen ?? '',
                                              banco         : response.data.banco ?? '',
                                              transMoneyState: true,
                                            }
                                        )
                                );

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));
 
            }
            

        } catch (error) {

            //await dispatch ( loginFail() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const updateThunks = (data) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
   
        await dispatch(showBackDropStore());


        const options = {
            method: 'PUT',
            url: `${URL}/${parametersURL}tarjeta/${data.id}/update/`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
              },
            data:data
        }
 

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 201 || response.status == 200){
                
                await dispatch(resetFormularioStore());

                await dispatch(setAlert({ message: '¡ ✏️ Acción completada con éxito!', type: 'success'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
              
            }else{

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
           
            }
            

        } catch (error) {

            //await dispatch ( loginFail() );
            await dispatch(setAlert({ message: '❌ Error en el servidor.', type: 'error'}));
            
            //await dispatch ( loginFail() );

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}


export const updateTranferirThunks = (data) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
   
        await dispatch(showBackDropStore());
        
        console.log(`${URL}/${parametersURLT}${data.id_tarjeta_bancaria_envia}/${data.id_tarjeta_bancaria_recibe}/`);

        const options = {
            method: 'POST',
            url: `${URL}/${parametersURLT}`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
              },
            data:data
        }
 

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 201 || response.status == 200){
                
                await dispatch(resetFormularioStore());

                await dispatch(setAlert({ message: '¡ ✏️ Acción completada con éxito!', type: 'success'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
              
            }else{

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
           
            }
            

        } catch (error) {   

            await dispatch(resetFormularioStore());

            await dispatch(setAlert({ message: `❌ ${error.response.data.error}.`, type: 'error'}));

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );
       
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
            url: `${ URL}/${parametersURL}tarjeta/${idUser}/delete`,
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

            await dispatch ( loginFail() );
            
            await dispatch( hideBackDropStore() );

            await dispatch(setAlert({ message: 'Ocurrió un error.', type: 'error'}));
            // Manejar errores
            console.error(error);
        }

    }

}

export const handleDisplayAllTarjetasThunk = () => {
    return async (dispatch) => {
        await dispatch(listStore({'tarjetasBancarias':[]}))
      };
}

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data; // Extraer el nombre y el valor del evento
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};

export const getTotalAllThunks = () => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/${parametersURL}obtener_tarjetas_total/`,
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
                    
                    await dispatch(listTotalStore({'getTotalTarjetas':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'getTotalTarjetas':[]}))

                    await dispatch(listTotalStore());
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
