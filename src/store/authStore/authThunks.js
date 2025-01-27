import axios from "axios";
import { setAuthenticated, loginFail } from "./authStore.js";
import { showBackDropStore, hideBackDropStore } from "../globalStore/globalStore.js";
import { URL, TOKEN } from "../../constants.js/constantGlogal.js";

// Función asincrónica para obtener los Pokemons
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
                await dispatch(setAuthenticated({"access":data.access,"islogin":true}));
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


