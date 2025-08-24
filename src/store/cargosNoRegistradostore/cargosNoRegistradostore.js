import { createSlice } from '@reduxjs/toolkit'

export const cargosNoRegistradostore = createSlice({
  name: 'cargosNoRegistradostore',
  initialState: {
    id                      : '',
    id_tarjeta_bancaria     : '',
    fecha_transaccion       : '',
    valor                   : '',
    observacion             : 0,
    id_cliente              : '',
    cargoNoDeseadoArray       : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id                      = action.payload.id;
      state.id_tarjeta_bancaria     = action.payload.id_tarjeta_bancaria;
      state.fecha_transaccion       = action.payload.fecha_transaccion;
      state.valor                   = action.payload.valor;
      state.observacion             = action.payload.observacion;
      state.id_cliente              = action.payload.id_cliente;
    },
    listStore:(state, action) => {
      state.cargoNoDeseadoArray = action.payload.cargoNoDeseadoArray
    },
    resetFormularioStore:(state) => {
      state.id                      = '';
      state.id_tarjeta_bancaria     = '';
      state.fecha_transaccion       = '';
      state.observacion             = '';
      state.id_cliente              = '';
      state.valor                   = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = cargosNoRegistradostore.actions;