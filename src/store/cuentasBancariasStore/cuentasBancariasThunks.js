import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { showStore, listStore, resetFormularioStore, handleFormStore, listDashboard  } from "./cuentasBancariasStore.js";

// Función asincrónica para obtener los Pokemons
const parametersURL = 'cuentasbancarias/api/cuentas/';

export const getAllThunks = () => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        const options = {
            method: 'GET',
            url: `${ URL}/${parametersURL}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
        
            if(response.status === 200){

                let data = response.data;
                console.log("data ",data)
                
                data.forEach(cuenta => {
                    const valor = parseFloat(cuenta.valor_alias) || 0;
                    const cuatroPorMil = parseFloat(cuenta.cuatro_por_mil) || 0;
                    cuenta.total = valor < 0 ? valor + cuatroPorMil : valor - cuatroPorMil;
                });

                if(data.length > 0){
                    
                    await dispatch(listStore({'cuentasBancarias':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'cuentasBancarias':[]}))

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
            url: `${URL}/${parametersURL}create/`,
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
            url: `${ URL}/cuentasbancarias/api/cuenta/${id}`,
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
                                              fechaIngreso  : response.data.fechaIngreso ?? '',
                                              fechaTransaccion : response.data.fechaTransaccion ?? '',
                                              descripcion   : response.data.descripcion ?? '',
                                              valor         : response.data.valor ?? '',
                                              cilindraje    : response.data.cilindraje ?? '',
                                              placa         : response.data.placa ?? '',
                                              nombreTitular : response.data.nombreTitular ?? '',
                                              archivo       : response.data.archivo ?? '',
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
            url: `${URL}/${parametersURL}update/${data.id}/`,
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
            
            await dispatch ( loginFail() );

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
            url: `${ URL}/${parametersURL}delete/${idUser}/`,
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
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};

export const dashboard_obtener_datos_cuenta = (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token
        
        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}/cuentasbancarias/api/cuenta/${id}/obtener_datos_cuenta/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            console.log("response.status ",response.status)

            if(response.status === 200){

                let data = response.data;

                if(data.data.length > 0){
                    
                    const dashboardData = data.data.map(item => {
                        const valor = parseFloat(item.total) || 0;
                        const cuatroPorMil = parseFloat(item.cuatro_por_mil) || 0;
                        const total_meno_cuatro_por_mil = valor < 0 ? valor + cuatroPorMil : valor - cuatroPorMil;
                    
                        return {
                          ...item,
                          total_meno_cuatro_por_mil
                        };
                      });
                      console.log(" === dashboardData === ",dashboardData)
                    await dispatch(
                                    listDashboard(
                                        {
                                            dashboardData           : dashboardData.concat(data.cuatro_por_mil_data),
                                            total_cuenta_bancaria   : data.totales.total_cuenta_bancaria,
                                            total_devoluciones      : data.totales.total_devoluciones,
                                            total_gastos_generales  : data.totales.total_gastos_generales,
                                            total_utilidad_ocacional: data.totales.total_utilidad_ocacional,
                                            total_recepcionDePagos  : data.totales.total_recepcionDePagos,
                                            total_cuatro_por_mil    : data.totales.total_cuatro_por_mil,
                                            total                   : data.totales.total,
                                            total_meno_cuatro_por_mil: data.totales.total_meno_cuatro_por_mil,
                                            cuatro_por_mil          : data.totales.cuatro_por_mil,
                                            nombre_cuenta           : data.tarjeta.nombre_cuenta,
                                            descripcion_cuenta      : data.tarjeta.descripcion_cuenta,
                                            numero_cuenta           : data.tarjeta.numero_cuenta,
                                            banco                   : data.tarjeta.banco,
                                            obtener_datos_cuenta    : data.obtener_datos_cuenta
                                        }
                                    )
                                )
                    await dispatch(hideBackDropStore());

                }else{

  
                    await dispatch(
                        listDashboard(
                            {
                                dashboardData           : [], 
                                total_cuenta_bancaria   : 0,
                                total_devoluciones      : 0,
                                total_gastos_generales  : 0,
                                total_utilidad_ocacional: 0,
                                total_recepcionDePagos  : 0,
                                total                   : 0,
                                total_cuatro_por_mil    : 0,
                                cuatro_por_mil          : 0,
                                nombre_cuenta           : '',
                                descripcion_cuenta      : '',
                                numero_cuenta           : '',
                                banco                   : '',
                                obtener_datos_cuenta    : []}
                        )
                    )

                    await dispatch(hideBackDropStore());
                }

            }else{

                await dispatch(hideBackDropStore());

            }
            

        } catch (error) {

            //await dispatch ( loginFail() );

            await dispatch( hideBackDropStore() );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const dashboard_obtener_datos_cuenta_dates = (id, fechaInicio="", fechaFin="") => {
    
    return async (dispatch, getState) => {

        await dispatch(showBackDropStore());
        
        const { authStore } = getState();
        const token = authStore.token;

        // Construir la URL con los parámetros de fecha 
        let url = `${ URL}/cuentasbancarias/api/cuenta/${id}/get_cuentasbancarias_filter_date/`;

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

            
            if(response.status === 200){

                let data = response.data;

                if(data.data.length > 0){

                    await dispatch(
                                    listDashboard(
                                        {
                                            dashboardData           : response.data.data, 
                                            total_cuenta_bancaria   : data.totales.total_cuenta_bancaria,
                                            total_devoluciones      : data.totales.total_devoluciones,
                                            total_gastos_generales  : data.totales.total_gastos_generales,
                                            total_utilidad_ocacional: data.totales.total_utilidad_ocacional,
                                            total_recepcionDePagos  : data.totales.total_recepcionDePagos,
                                            total                   : data.totales.total,
                                            cuatro_por_mil          : data.totales.cuatro_por_mil,
                                            nombre_cuenta           : data.tarjeta.nombre_cuenta,
                                            descripcion_cuenta      : data.tarjeta.descripcion_cuenta,
                                            numero_cuenta           : data.tarjeta.numero_cuenta,
                                            banco                   : data.tarjeta.banco}
                                    )
                                )
                    await dispatch(hideBackDropStore());

                }else{

  
                    await dispatch(
                        listDashboard(
                            {
                                dashboardData           : [], 
                                total_cuenta_bancaria   : 0,
                                total_devoluciones      : 0,
                                total_gastos_generales  : 0,
                                total_utilidad_ocacional: 0,
                                total_recepcionDePagos  : 0,
                                total                   : 0,
                                cuatro_por_mil          : 0,
                                nombre_cuenta           : '',
                                descripcion_cuenta      : '',
                                numero_cuenta           : '',
                                banco                   : ''}
                        )
                    )

                    await dispatch(hideBackDropStore());
                }

            }else{

                await dispatch(hideBackDropStore());

            }

        } catch (error) {
            console.error("Error al obtener cotizadores:", error);
        }

        // Ocultar el loader sin importar si hubo éxito o error
        await dispatch(hideBackDropStore());
    };
}

export const downloadExcelThunk = (id,startDate, endDate) => {
    return async (dispatch, getState) => {
        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        const options = {
            method: "GET",
            url: `${URL}/cuentasbancarias/api/cuenta/${id}/download_report_excel/?fechaInicio=${startDate}&fechaFin=${endDate}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Indicar que la respuesta es un archivo binario
        };

        try {
            const response = await axios(options);

            // Crear un blob y un enlace de descarga
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", `Reporte_Cuenta_${id}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            await dispatch(hideBackDropStore());

        } catch (error) {
            await dispatch(hideBackDropStore());
            await dispatch(setAlert({ message: "Error al descargar el archivo", type: "error" }));
            console.error("Error al descargar el archivo:", error);
        }
    };
};

export const getAllThunksFilter = (fechaInicio="", fechaFin="") => {

    return async (dispatch, getState) => {
        
        await dispatch(showBackDropStore());
        
        const {authStore} = getState();
        const token = authStore.token

        // Iniciar la carga
        let url = `${URL}/cuentasbancarias/api/cuentas/obtener_cuentas_filtradas/`;

        // Agregar las fechas a los parámetros de la URL si existen
        if (fechaInicio || fechaFin) {
            const params = new URLSearchParams();
            if (fechaInicio) params.append("fechaInicio", fechaInicio);
            if (fechaFin) params.append("fechaFin", fechaFin);
            url += `?${params.toString()}`;
        }
        console.log("url ",url)
    
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
        
            if(response.status === 200){

                let data = response.data;
                
                data.forEach(cuenta => {
                    const valor = parseFloat(cuenta.valor_alias) || 0;
                    const cuatroPorMil = parseFloat(cuenta.cuatro_por_mil) || 0;
                    cuenta.total = valor < 0 ? valor + cuatroPorMil : valor - cuatroPorMil;
                });

                if(data.length > 0){
                    
                    await dispatch(listStore({'cuentasBancarias':data}))

                    await dispatch(hideBackDropStore());

                }else{

                    await dispatch(listStore({'cuentasBancarias':[]}))

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