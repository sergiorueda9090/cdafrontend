import { colors } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'

export const fichaProveedoresStore = createSlice({
  name: 'fichaProveedoresStore',
  initialState: {
    id          : '',
    nombre      : '',
    etiqueta    : '',
    firchaproveedores : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id          = action.payload.id;
      state.nombre      = action.payload.nombre;
      state.etiqueta    = action.payload.etiqueta;
    },
    listStore:(state, action) => {
      state.firchaproveedores = action.payload.firchaproveedores
    },
    resetFormularioStore:(state) => {
      state.id            = '';
      state.nombre        = '';
      state.proveedores   = '';
      state.etiqueta      = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      console.log( name, value )
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = fichaProveedoresStore.actions;