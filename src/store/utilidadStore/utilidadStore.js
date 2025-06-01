import { colors } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'

export const utilidadStore = createSlice({
  name: 'utilidadStore',
  initialState: {
    id          : '',
    utilidades  : [],
  },
  reducers: {
    listStore:(state, action) => {
      state.utilidades = action.payload.utilidades
    },
    resetFormularioStore:(state) => {
      state.id           = '';
      state.utilidades   = '';
    },
  }
})

// Action creators are generated for each case reducer function
export const { listStore, resetFormularioStore } = utilidadStore.actions;