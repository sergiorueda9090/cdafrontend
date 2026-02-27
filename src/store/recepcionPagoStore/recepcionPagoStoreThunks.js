import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { showStore, listStore, resetFormularioStore, handleFormStore  } from "./recepcionPagoStore.js";

// Función asincrónica para obtener los Pokemons
const parametersURL = 'recepcionpago/api/';

export const getAllThunks = (page = 1, pageSize = 20) => {

    return async (dispatch, getState) => {

        await dispatch(showBackDropStore());

        const {authStore} = getState();
        const token = authStore.token

        const options = {
            method: 'GET',
            url: `${ URL}/${parametersURL}recepciones/?page=${page}&page_size=${pageSize}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };


        try {
            const response = await axios.request(options);

            if(response.status === 200){

                const data = response.data;

                await dispatch(listStore({
                    recepcionPagos : data.data ?? [],
                    count          : data.count ?? 0,
                    page,
                    pageSize,
                    fechaInicio    : '',
                    fechaFin       : '',
                }));

                await dispatch(hideBackDropStore());

            }else{

                await dispatch(hideBackDropStore());

            }


        } catch (error) {

            await dispatch(hideBackDropStore());
            console.error(error);

        }
    };
};

export const createThunks = (data) => {
    return async (dispatch, getState) => {
        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const options = {
            method: 'POST',
            url: `${URL}/${parametersURL}recepciones/crear/`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data',
            },
            data: formData,
        };

        try {
            const response = await axios.request(options);
            console.log("response.data", response.data);

            if (response.status === 201) {

                await dispatch(resetFormularioStore());
                await dispatch(setAlert({ message: '¡✨ Acción completada con éxito!', type: 'success' }));
                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());

            } else if (response.data.requiere_confirmacion) {

                await dispatch(hideBackDropStore());

                const confirmar = window.confirm(response.data.advertencia); // Esto puede adaptarse a un modal personalizado

                if (confirmar) {
                    data.confirmar = true;
                    await dispatch(createThunks(data));
                }
                
            } else {
                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error' }));
                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            }

        } catch (error) {
            await dispatch(setAlert({ message: '❌ Error en el servidor.', type: 'error' }));
            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());
            console.error(error);
        }
    };
}

export const showThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}/${parametersURL}recepciones/${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){
                console.log("response.data ",response.data)
                await dispatch(showStore(
                                            { id                    : response.data.id ?? '',
                                              id_tarjeta_bancaria   : response.data.id_tarjeta_bancaria ?? '',
                                              fecha_transaccion     : response.data.fecha_transaccion ?? '',
                                              valor                 : response.data.valor ?? '',
                                              observacion           : response.data.observacion ?? '',
                                              cliente_id            : response.data.cliente ?? '',
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
            url: `${URL}/${parametersURL}recepciones/${data.id}/update/`,
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

export const deleteThunk = (idUser = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${ URL}/${parametersURL}recepciones/${idUser}/delete`,
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


export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data; // Extraer el nombre y el valor del evento
      console.log("name", name);
      console.log("value", value);
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};

export const getAllThunksFilter = (fechaInicio, fechaFin, page = 1, pageSize = 20) => {

    return async (dispatch, getState) => {
        await dispatch(showBackDropStore());

        const { authStore } = getState();
        const token         = authStore.token;

        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin)    params.append("fechaFin", fechaFin);
        params.append("page", page);
        params.append("page_size", pageSize);

        const url = `${ URL}/${parametersURL}recepciones/listar_recepciones_pago_filtradas/?${params.toString()}`;

        const options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const response = await axios.request(options);

            if (response.status === 200) {
                const data = response.data;
                await dispatch(listStore({
                    recepcionPagos : data.data ?? [],
                    count          : data.count ?? 0,
                    page,
                    pageSize,
                    fechaInicio,
                    fechaFin,
                }));
            }

        } catch (error) {
            console.error("Error al obtener recepciones filtradas:", error);
        }

        await dispatch(hideBackDropStore());
    };
};
