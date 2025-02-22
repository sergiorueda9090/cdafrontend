import { createSlice } from '@reduxjs/toolkit'

export const utilidadOcacionalStore = createSlice({
  name: 'utilidadOcacionalStore',
  initialState: {
    id                    : '',
    id_tarjeta_bancaria   : '',
    fecha_ingreso         : '',
    fecha_transaccion     : '',
    valor                 : '',
    observacion           : '',
    utilidadOcacionales   : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id                    = action.payload.id;
      state.id_tarjeta_bancaria   = action.payload.id_tarjeta_bancaria;
      state.fecha_ingreso         = action.payload.fecha_ingreso;
      state.fecha_transaccion     = action.payload.fecha_transaccion;
      state.valor                 = action.payload.valor;
      state.observacion           = action.payload.observacion;
    },
    listStore:(state, action) => {
      state.utilidadOcacionales = action.payload.utilidadOcacionales
    },
    resetFormularioStore:(state) => {
      state.id                    = '';
      state.id_tarjeta_bancaria   = '';
      state.fecha_ingreso         = '';
      state.fecha_transaccion     = '';
      state.valor                 = '';
      state.observacion           = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = utilidadOcacionalStore.actions;