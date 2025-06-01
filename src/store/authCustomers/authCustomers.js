import { createSlice } from '@reduxjs/toolkit'

const cliente_data = JSON.parse(localStorage.getItem("cliente_data")) || {};

export const authCustomerStore = createSlice({
  name: 'authCustomerStore',
  initialState: {
    token     : "",
    nombre    : "",
    telefono  : "",
    isLogin   : cliente_data.isLogin === true,
    data      : [],
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token     = action.payload.token;
      state.nombre    = action.payload.nombre;
      state.telefono  = action.payload.telefono;
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
    }
  }
}); 
// Action creators are generated for each case reducer function
export const {loginSuccess,  loginFail } = authCustomerStore.actions;