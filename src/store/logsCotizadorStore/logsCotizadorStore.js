import { createSlice } from '@reduxjs/toolkit'

export const logsCotizadorStore = createSlice({
  name: 'logsCotizadorStore',
  initialState: {
    logsCotizador : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.logsCotizador  = action.payload.logsCotizador;
    },
    listStore:(state, action) => {
      state.logsCotizador  = action.payload.logsCotizador;
    },
    resetFormularioStore:(state) => {
      state.logsCotizador  = [];
    },
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore } = logsCotizadorStore.actions;