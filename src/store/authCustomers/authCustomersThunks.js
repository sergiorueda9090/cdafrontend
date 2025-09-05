import axios from "axios";
import { loginSuccess, loginFail, showStoreRecepcionPago } from "./authCustomers.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";

export const getLogin = (username) => {

    return async (dispatch, getState) => {
       
        // Iniciar la carga
        await dispatch(showBackDropStore());
            
        const options = {
            method: 'POST',
            url:    `${URL}/clientes/api/verificar_cliente_y_generar_token/`,
            headers: {
                'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
            },
            data: {username:username}
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status === 200){

                let data = response.data;
                
                await dispatch(getCotizadoresCliente({
                                                        token:    data.token,
                                                        nombre:   data.nombre,
                                                        telefono: data.telefono,
                                                        username: data.username,
                                                        isLogin:  true,
                                                        id_cliente: data.id, 
                                                    }));

                await dispatch(hideBackDropStore());

            }else{
           
                let data = response.data;

                await dispatch(setAlert({ message: data.error, type: 'error'}));
                
                await dispatch(loginFail());

                await dispatch(hideBackDropStore());
            
            }

            await dispatch(hideBackDropStore());
            // Despachar la acción setAuthenticated con la respuesta de la solicitud
        } catch (error) {

                await dispatch(setAlert({ message:error.response.data.error, type: 'error'}));
                
                await dispatch(loginFail());

                await dispatch(hideBackDropStore());
            
        }
    };
};


export const getCotizadoresCliente = (clienteData) => {

    return async (dispatch) => {
        try {
            
            if (!clienteData || !clienteData.token || !clienteData.username || !clienteData.id_cliente) {
                throw new Error("Faltan datos del cliente.");
            }

            const response = await axios.post(`${URL}/clientes/api/cotizador-cliente/`, {
                token       : clienteData.token,
                username    : clienteData.username,
                id_cliente  : clienteData.id_cliente
            });
            
        
            if (response.status === 200) {
                
                let data = response.data.data.filter((d) => d.pdf);
                localStorage.setItem("cliente_data", JSON.stringify({isLogin: true, token:clienteData.token, 
                                                                     username:clienteData.username, id_cliente:clienteData.id_cliente }));

                await dispatch(setAlert({ message: '¡✨ Acción completada con éxito!', type: 'success'}));

                await dispatch(loginSuccess({data: data, islogin: true}));
    
                await dispatch(showRecepcionPago(clienteData.id_cliente));

            } else {
                
                let data = response.data;

                localStorage.removeItem("cliente_data");

                window.location.href = '/customer/customer';

                await dispatch(setAlert({ message: data.error, type: 'error'}));
                
                await dispatch(loginSuccess({data:[], islogin: false}));

                await dispatch(loginFail());

                await dispatch(hideBackDropStore());
            }

        } catch (error) {

            //await dispatch(setAlert({ message:error.response.data.error, type: 'error'}));
            
            //await dispatch(loginFail());

                localStorage.removeItem("cliente_data");

                window.location.href = '/customer/customer';

                await dispatch(setAlert({ message: error.response.data.error, type: 'error'}));
                
                await dispatch(loginSuccess({data:[], islogin: false}));

                await dispatch(loginFail());

                await dispatch(hideBackDropStore());

        }
    };
};

export const getAuth = (email,password) => {

    return async (dispatch, getState) => {
       
        // Iniciar la carga
        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url:    `${URL}/auth/`,
            headers: {
                'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
            },
            data: {
                email:      email,
                password:   password
            }
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            if(response.status === 200){
                let data = response.data;
                //await dispatch(setAuthenticated({"access":data.access,"islogin":true}));
                await dispatch(hideBackDropStore());
            }
            await dispatch(hideBackDropStore());
            // Despachar la acción setAuthenticated con la respuesta de la solicitud
        } catch (error) {
            // Manejar errores
            await dispatch(hideBackDropStore());
            console.error(error);
            await dispatch(loginFail());
        }
    };
};

export const showRecepcionPago= ( id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token
        const parametersURL = 'recepcionpago/api/';

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${URL}/${parametersURL}recepcionescliente/${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){
                console.log("response.data ",response);
                await dispatch(showStoreRecepcionPago(response.data));

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch(showStoreRecepcionPago([]));

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

export const getCotizadoresClienteSecond = (clienteData) => {
   
    return async (dispatch) => {
        try {
            
            if (!clienteData || !clienteData.token || !clienteData.telefono || !clienteData.id_cliente) {
                throw new Error("Faltan datos del cliente.");
            }

            const response = await axios.post(`${URL}/clientes/api/cotizador-cliente/`, {
                token       : clienteData.token,
                telefono    : clienteData.telefono,
                id_cliente  : clienteData.id_cliente
            });
            
        
            if (response.status === 200) {
             
                await dispatch(loginSuccess({data: response.data.data, islogin: true}));
    

            } else {
                
                let data = response.data;

                localStorage.removeItem("cliente_data");

                window.location.href = '/customer/customer';

                await dispatch(setAlert({ message: data.error, type: 'error'}));
                
                await dispatch(loginSuccess({data:[], islogin: false}));

                await dispatch(loginFail());

            }

        } catch (error) {

                localStorage.removeItem("cliente_data");

                window.location.href = '/customer/customer';

                await dispatch(setAlert({ message: error.response.data.error, type: 'error'}));
                
                await dispatch(loginSuccess({data:[], islogin: false}));

                await dispatch(loginFail());


        }
    };
};

export const showRecepcionPagoSecond = ( id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token
        const parametersURL = 'recepcionpago/api/';
        
        const options = {
            method: 'GET',
            url: `${URL}/${parametersURL}recepcionescliente/${id}/`,
            /*headers: {
              Authorization: `Bearer ${token}`
            }*/
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){

                console.log("response.data.data ",response.data);

                await dispatch(showStoreRecepcionPago({"data":response.data.data, "total":response.data.total}));


            }else{

                await dispatch(showStoreRecepcionPago([]));

                await dispatch( hideBackDropStore() );

                await dispatch(setAlert({ message: '❌ Ocurrió un error.', type: 'error'}));
 
            }
            

        } catch (error) {

            // Manejar errores
            console.error(error);
       
        }

    }

}
