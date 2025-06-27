import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { listStore, resetFormularioStore} from "./balancegeneralStore.js";

// Función asincrónica para obtener los Pokemons
const parametersURL = 'balancegeneral/api/';

export const getAllThunks = (fechaInicio, fechaFin) => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Construir la URL con los parámetros de fecha
        let url = `${ URL}/${parametersURL}balancegeneral/`

         // Agregar las fechas a los parámetros de la URL si existen
        if (fechaInicio || fechaFin) {
            const params = new URLSearchParams();
            if (fechaInicio) params.append("fechaInicio", fechaInicio);
            if (fechaFin) params.append("fechaFin", fechaFin);
            url += `?${params.toString()}`;
        }
        
        // Iniciar la carga
        const options = {
            method: 'GET',
            url:url,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
        
            if (response.status === 200) {
                const data = response.data;

                // Validación básica de estructura esperada
                if (data && Array.isArray(data.datos) && data.datos.length > 0) {
                    await dispatch(listStore({
                        balanceGeneral: data.datos,
                        totalSaldoClientes: data.total_saldo_clientes,
                        totalGastosGenerales: data.total_gastos_generales,
                        totalComisionesProveedores: data.total_comisiones_proveedores,
                        totalTarjetas: data.totalTarjetas,
                        sumaTotal: data.sumaTotal,
                        utilidades:data.utilidades,
                        tarjetas: data.tarjetas
                    }));
                } else {
                    await dispatch(listStore({
                        balanceGeneral: [],
                        totalSaldoClientes: 0,
                        totalGastosGenerales: 0,
                        totalComisionesProveedores: 0,
                        totalTarjetas:0,
                        sumaTotal:0,
                        utilidades:0,
                        tarjetas:[]
                    }));
                }

                await dispatch(hideBackDropStore());
            } else {
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
