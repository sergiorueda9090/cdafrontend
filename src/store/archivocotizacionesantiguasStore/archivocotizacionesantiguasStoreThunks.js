import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { loginFail } from "../authStore/authStore.js";
import { showThunk as precioClientesShow } from "../clientesStore/clientesThunks.js";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, setAlert } from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { listStore, showStore  } from "./archivocotizacionesantiguasStore.js";
// Función asincrónica para obtener los Pokemons
const urlPatter = "archivocotizacionesantiguas";

export const getAllThunks = (fechaInicio, fechaFin) => {

    return async (dispatch, getState) => {
        await dispatch(showBackDropStore());
        
        const { authStore } = getState();
        const token = authStore.token;

        // Construir la URL con los parámetros de fecha
        let url = `${URL}/${urlPatter}/api/archivocotizacionesantiguas/`;

        // Agregar las fechas a los parámetros de la URL si existen
        if (fechaInicio || fechaFin) {
            const params = new URLSearchParams();
            if (fechaInicio) params.append("fecha_inicio", fechaInicio);
            if (fechaFin) params.append("fecha_fin", fechaFin);
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

export const sendToThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}/archivocotizacionesantiguas/api/senttotramites/${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){
                
                await dispatch(getAllThunks());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch(getAllThunks());

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

export const showThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}/archivocotizacionesantiguas/api/getcotizador/${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){
                
                await dispatch(showStore(
                    {
                      id                     : response.data.id ?? '',
                      nombre                 : response.data.nombre ?? '',
                      apellidos              : response.data.apellidos ?? '',
                      telefono               : response.data.telefono ?? '',
                      direccion              : response.data.direccion ?? '',
                      precioDeLey            : response.data.precioDeLey ?? '',  // Se asume que 'precioDeLey' corresponde a 'precios_ley'
                      color                  : response.data.color_cliente ?? '',  // Se asume que 'color_cliente' corresponde a 'color'
                      etiquetaDos            : response.data.etiquetaDos ?? '',
                      idEtiqueta             : response.data.idEtiqueta ?? '',
                      placa                  : response.data.placa ?? '',
                      cilindraje             : response.data.cilindraje ?? '',
                      modelo                 : response.data.modelo ?? '',
                      chasis                 : response.data.chasis ?? '',
                      tipoDocumento          : response.data.tipoDocumento ?? '',
                      numeroDocumento        : response.data.numeroDocumento ?? '',
                      nombreCompleto         : response.data.nombreCompleto ?? '',
                      correo                 : response.data.correo ?? '',
                      pagoInmediato          : response.data.pagoInmediato ?? '',
                      linkPago               : response.data.linkPago ?? '',
                      comisionPrecioLey      : response.data.comisionPrecioLey ?? '',
                      total                  : response.data.total ?? '',
                      pdf                    : response.data.pdf ?? null,
                      archivo                : response.data.archivo ?? '',
                      fechaCreacion          : response.data.fechaCreacion ?? '',
                      cotizadorModulo        : response.data.cotizadorModulo ?? '',
                      tramiteModulo          : response.data.tramiteModulo ?? '',
                      confirmacionPreciosModulo : response.data.confirmacionPreciosModulo ?? '',
                      pdfsModulo             : response.data.pdfsModulo ?? '',
                      idBanco                : response.data.idBanco ?? '',
                      nombre_usuario         : response.data.nombre_usuario ?? '',
                      image_usuario          : response.data.image_usuario ?? '',
                      nombre_cliente         : response.data.nombre_cliente ?? '',
                      color_cliente          : response.data.color_cliente ?? '',
                      color_etiqueta         : response.data.color_etiqueta ?? ''
                    }
                  ));
                
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
