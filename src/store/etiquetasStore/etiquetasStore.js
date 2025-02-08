import { colors } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'

export const etiquetasStore = createSlice({
  name: 'etiquetasStore',
  initialState: {
    id        : '',
    nombre    : '',
    color     : '',
    etiquetas : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id       = action.payload.id;
      state.nombre   = action.payload.nombre;
      state.color    = action.payload.color;
    },
    listStore:(state, action) => {
      state.etiquetas = action.payload.etiquetas
    },
    resetFormularioStore:(state) => {
      state.id            = '';
      state.nombre        = '';
      state.etiquetas     = '';
      state.color         = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      console.log( name, value )
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = etiquetasStore.actions;