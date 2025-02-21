import { createSlice } from '@reduxjs/toolkit'

export const gastosStore = createSlice({
  name: 'gastosStore',
  initialState: {
    id          : '',
    name        : '',
    observacion : '',
    gastos     : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id          = action.payload.id;
      state.name        = action.payload.name;
      state.observacion = action.payload.observacion;
    },
    listStore:(state, action) => {
      state.gastos = action.payload.gastos
    },
    resetFormularioStore:(state) => {
      state.id          = '';
      state.name        = '';
      state.observacion = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = gastosStore.actions;