import { colors } from '@mui/material';
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
    color             : '#000000',
    preciosLey        : [],
    clientes          : [],
    clientesMain      : [],
    username          : '',
    email             : '',
    medio_contacto    : 'whatsapp',
  },
  reducers: {
    showStore:(state,action) => {
      state.id            = action.payload.id;
      state.nombre        = action.payload.nombre;
      state.apellidos     = action.payload.apellidos;
      state.telefono      = action.payload.telefono;
      state.color         = action.payload.color;
      state.direccion     = action.payload.direccion;
      state.fecha_creacion= action.payload.fecha_creacion;
      state.preciosLey    = action.payload.precios_ley;

      state.username            = action.payload.username;
      state.email               = action.payload.email;
      state.medio_contacto      = action.payload.medio_contacto;
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
      state.color         = '';
      state.direccion     = '';
      state.fecha_creacion= '';
      state.preciosLey    = [];
      state.username        = '';
      state.email           = '';
      state.medio_contacto  = 'whatsapp';
    },
    addPreciosLeyStore:(state, action) => {
      state.preciosLey = action.payload
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      console.log( name, value )
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, listStoreMain, addPreciosLeyStore, handleFormStore } = clientesStore.actions;