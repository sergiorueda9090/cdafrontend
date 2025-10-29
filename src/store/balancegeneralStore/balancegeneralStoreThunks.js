import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { listStore, resetFormularioStore, getObtenerTotalTarjetasStore, getPatrimonioNetoStore, 
      getUtilidadNominalStore, getUtilidadRealStore, getTotalDiferenciaStore, getGastosTotalesDelPeriodoStore} from "./balancegeneralStore.js";

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
                  
                  console.log(" data.datos ",data.datos)

                    await dispatch(listStore({
                        balanceGeneral: data.datos,
                        totalSaldoClientes: data.total_saldo_clientes,
                        totalGastosGenerales: data.total_gastos_generales,
                        totalComisionesProveedores: data.total_comisiones_proveedores,
                        total_cargo_no_deseados: data.total_cargo_no_deseados,
                        total_recepcion_pago: data.total_recepcion_pago,
                        totalTarjetas: data.totalTarjetas,
                        total_cuatro_por_mil: data.total_cuatro_por_mil,
                        sumaTotal: data.sumaTotal,
                        utilidades:data.utilidades,
                        tarjetas: data.tarjetas,
                        clientes: data.clientes
                    }));
                } else {
                    await dispatch(listStore({
                        balanceGeneral: [],
                        totalSaldoClientes: 0,
                        totalGastosGenerales: 0,
                        totalComisionesProveedores: 0,
                        total_cargo_no_deseados: 0,
                        total_recepcion_pago: 0,
                        total_cuatro_por_mil: 0,
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


export const getObtenerTotalTarjetas = (fechaInicio, fechaFin) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir la URL
    let url = `${URL}/${parametersURL}balancegeneral/obtenertotaltarjetas`;

    // Agregar fechas si existen
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
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const data = response.data;

        // ✅ Solo esperamos totalTarjetas
        const patrimonioBruto = data?.patrimonioBruto || 0;

        await dispatch(getObtenerTotalTarjetasStore({patrimonioBruto}));
      }
    } catch (error) {
      console.error("Error al obtener totalTarjetas:", error);
      await dispatch(getObtenerTotalTarjetasStore({patrimonioBruto: 0}));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


export const getPatrimonioNeto = (fechaInicio, fechaFin) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir la URL
    let url = `${URL}/${parametersURL}balancegeneral/obtenercuatroxmilygastos`;

    // Agregar fechas si existen
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
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const data = response.data;
        
        console.log("data ",data)

        //Solo esperamos totalTarjetas
        const patrimonioNeto = data?.patrimonio_neto || 0;
        await dispatch(getPatrimonioNetoStore({patrimonioNeto}));
      }
    } catch (error) {
      console.error("Error al obtener totalTarjetas:", error);
      //await dispatch(getObtenerTotalTarjetasStore({totalTarjetasBalance: 0}));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};

export const getGastoTotalesDelPeriodo = (fechaInicio, fechaFin) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir la URL
    let url = `${URL}/${parametersURL}balancegeneral/gastostotalesdelperiodo`;

    // Agregar fechas si existen
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
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const data = response.data;
        
        console.log("data ",data)

        //Solo esperamos totalTarjetas
        const gastos_totales_de_periodo = data?.gastos_totales_de_periodo || 0;
        await dispatch(getGastosTotalesDelPeriodoStore({gastos_totales_de_periodo}));
      }
    } catch (error) {
      console.error("Error al obtener totalTarjetas:", error);
      //await dispatch(getObtenerTotalTarjetasStore({totalTarjetasBalance: 0}));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


export const getUtilidadNominal = (fechaInicio, fechaFin) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir la URL
    let url = `${URL}/${parametersURL}balancegeneral/utilidadnominal`;

    // Agregar fechas si existen
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
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const data = response.data;
        
        console.log("data ",data)

        //Solo esperamos totalTarjetas
        const utilidadnominal = data?.total || 0;
        await dispatch(getUtilidadNominalStore({utilidadnominal}));
      }
    } catch (error) {
      console.error("Error al obtener totalTarjetas:", error);
      //await dispatch(getObtenerTotalTarjetasStore({totalTarjetasBalance: 0}));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


export const getUtilidadReal = (fechaInicio, fechaFin) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir la URL
    let url = `${URL}/${parametersURL}balancegeneral/utilidadreal`;

    // Agregar fechas si existen
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
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const data = response.data;
        
        console.log("utilidadreal data ",data)

        //Solo esperamos totalTarjetas
        const utilidadreal = data?.resultado || 0;
        await dispatch(getUtilidadRealStore({utilidadreal}));
      }
    } catch (error) {
      console.error("Error al obtener totalTarjetas:", error);
      //await dispatch(getObtenerTotalTarjetasStore({totalTarjetasBalance: 0}));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};

export const getTotalDiferencia = (fechaInicio, fechaFin) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir la URL
    let url = `${URL}/${parametersURL}balancegeneral/totaldiferencia`;

    // Agregar fechas si existen
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
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const data = response.data;
        
        console.log("utilidadreal data ",data)

        //Solo esperamos totalTarjetas
        const totaldiferencia = data?.total_diferencia || 0;
        await dispatch(getTotalDiferenciaStore({totaldiferencia}));
      }
    } catch (error) {
      console.error("Error al obtener totalTarjetas:", error);
      //await dispatch(getObtenerTotalTarjetasStore({totalTarjetasBalance: 0}));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};
