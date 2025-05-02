import { createSlice } from '@reduxjs/toolkit'

// Función para obtener la fecha actual en formato YYYY-MM-DDTHH:mm
/*
const obtenerFechaActualFormatoInput = () => {
  const ahora = new Date();
  const fecha = ahora.toISOString().slice(0, 16); // Ej: "2025-05-02T21:33"
  return fecha;
};
*/

export const recepcionPagoStore = createSlice({
  name: 'recepcionPagoStore',
  initialState: {
    id                      : '',
    id_tarjeta_bancaria     : '',
    fecha_transaccion       : '',
    valor                   : '',
    observacion             : 0,
    cliente_id              : '',
    recepcionPagos          : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id                      = action.payload.id;
      state.id_tarjeta_bancaria     = action.payload.id_tarjeta_bancaria;
      state.fecha_transaccion       = action.payload.fecha_transaccion;
      state.valor                   = action.payload.valor;
      state.observacion             = action.payload.observacion;
      state.cliente_id              = action.payload.cliente_id;
    },
    listStore:(state, action) => {
      state.recepcionPagos = action.payload.recepcionPagos
    },
    resetFormularioStore:(state) => {
      state.id                      = '';
      state.id_tarjeta_bancaria     = '';
      state.fecha_transaccion       = '';
      state.observacion             = '';
      state.cliente_id              = '';
      state.valor                   = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = recepcionPagoStore.actions;