import { createSlice } from '@reduxjs/toolkit'

export const gastosGeneralesStore = createSlice({
  name: 'gastosGeneralesStore',
  initialState: {
    id                    : '',
    id_tipo_gasto         : '',
    id_tarjeta_bancaria   : '',
    fecha_ingreso         : '',
    fecha_transaccion     : '',
    valor                 : '',
    observacion           : '',
    gastosGenerales       : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id                    = action.payload.id;
      state.id_tipo_gasto         = action.payload.id_tipo_gasto;
      state.id_tarjeta_bancaria   = action.payload.id_tarjeta_bancaria;
      state.fecha_ingreso         = action.payload.fecha_ingreso;
      state.fecha_transaccion     = action.payload.fecha_transaccion;
      state.valor                 = action.payload.valor;
      state.observacion           = action.payload.observacion;
    },
    listStore:(state, action) => {
      state.gastosGenerales = action.payload.gastosGenerales
    },
    resetFormularioStore:(state) => {
      state.id                    = '';
      state.id_tipo_gasto         = '';
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = gastosGeneralesStore.actions;