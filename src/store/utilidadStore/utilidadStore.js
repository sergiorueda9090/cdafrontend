import { colors } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'

export const utilidadStore = createSlice({
  name: 'utilidadStore',
  initialState: {
    id          : '',
    utilidades  : [],
    total       : 0,
  },
  reducers: {
    listStore:(state, action) => {
      state.utilidades = action.payload.utilidades
      state.total      = action.payload.total
    },
    resetFormularioStore:(state) => {
      state.id           = '';
      state.utilidades   = '';
      state.total        = '';
    },
  }
})

// Action creators are generated for each case reducer function
export const { listStore, resetFormularioStore } = utilidadStore.actions;