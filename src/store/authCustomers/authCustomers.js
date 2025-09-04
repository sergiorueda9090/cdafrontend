import { createSlice } from '@reduxjs/toolkit'

const cliente_data = JSON.parse(localStorage.getItem("cliente_data")) || {};

export const authCustomerStore = createSlice({
  name: 'authCustomerStore',
  initialState: {
    token     : "",
    username  : "",
    nombre    : "",
    telefono  : "",
    isLogin   : cliente_data.isLogin === true,
    data      : [],
    recepcionPagoArray: [],
    total: 0,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token     = action.payload.token;
      state.nombre    = action.payload.nombre;
      state.telefono  = action.payload.telefono;
      state.username  = action.payload.username;
      state.isLogin   = action.payload.islogin !== false;
      state.data      = action.payload.data
    },
    loginFail: (state, action) => {
      localStorage.removeItem("cliente_data");
      state.isLogin   = false;
      state.token     = "";
      state.nombre    = "";
      state.telefono  = "";
      state.data      = [];
      state.username  = "";
    },
    showStoreRecepcionPago: (state, action) => {
      state.recepcionPagoArray = action.payload.data;
      state.total = action.payload.total;
    },
  }
}); 
// Action creators are generated for each case reducer function
export const {loginSuccess,  loginFail, showStoreRecepcionPago } = authCustomerStore.actions;