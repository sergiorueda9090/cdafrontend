import { createSlice } from '@reduxjs/toolkit'

export const clientesStore = createSlice({
  name: 'clientesStore',
  initialState: {
    id                : '',
    nombre            : '',
    apellidos         : '',
    telefono          : '',
    direccion         : '',
    fecha_creacion    : '',
    preciosLey        : [],
    clientes          : [],
    clientesMain      : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id            = action.payload.id;
      state.nombre        = action.payload.nombre;
      state.apellidos     = action.payload.apellidos;
      state.telefono      = action.payload.telefono;
      state.direccion     = action.payload.direccion;
      state.fecha_creacion= action.payload.fecha_creacion;
      state.preciosLey    = action.payload.precios_ley;
    },
    listStoreMain:(state, action) => {
      state.clientesMain = action.payload.clientes
    },
    listStore:(state, action) => {
      state.clientes = action.payload.clientes
    },
    resetFormularioStore:(state) => {
      state.id            = '';
      state.nombre        = '';
      state.apellidos     = '';
      state.telefono      = '';
      state.direccion     = '';
      state.fecha_creacion= '';
      state.preciosLey    = [];
      
    },
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, listStoreMain } = clientesStore.actions;