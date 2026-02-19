import axios from "axios";
import { showBackDropStore, hideBackDropStore} from "../globalStore/globalStore.js";
import { URL } from "../../constants.js/constantGlogal.js";
import { listStore } from "./utilidadStore.js";

const paramtersURLId = 'utilidad/api/utilidades/';

export const getAllThunks = (proveedorId, fechaInicio, fechaFin, search, page = 1, pageSize = 50) => {

    return async (dispatch, getState) => {

        await dispatch(showBackDropStore());

        const { authStore } = getState();
        const token = authStore.token;

        // Construir los parámetros dinámicamente
        const queryParams = new URLSearchParams();

        if (proveedorId) queryParams.append('proveedorId', proveedorId);
        if (fechaInicio) queryParams.append('fechaInicio', fechaInicio);
        if (fechaFin)    queryParams.append('fechaFin', fechaFin);
        if (search)      queryParams.append('search', search);

        queryParams.append('page',      page);
        queryParams.append('page_size', pageSize);

        const options = {
            method: 'GET',
            url: `${URL}/${paramtersURLId}?${queryParams.toString()}`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        try {

            const response = await axios.request(options);

            if (response.status === 200) {
                const data = response.data;
                await dispatch(listStore({
                    utilidades  : data.data,
                    total       : data.total,
                    count       : data.count,
                    page,
                    pageSize,
                    search      : search      || '',
                    fechaInicio : fechaInicio || '',
                    fechaFin    : fechaFin    || '',
                }));
            } else {
                await dispatch(listStore({ utilidades: [], total: 0, count: 0, page: 1, pageSize }));
            }

        } catch (error) {
            // console.error(error);
        } finally {
            await dispatch(hideBackDropStore());
        }
    };
};