import { colors } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'

export const utilidadStore = createSlice({
  name: 'utilidadStore',
  initialState: {
    id          : '',
    utilidades  : [],
    total       : 0,
    count       : 0,
    page        : 1,
    pageSize    : 50,
    search      : '',
    fechaInicio : '',
    fechaFin    : '',
  },
  reducers: {
    listStore:(state, action) => {
      state.utilidades  = action.payload.utilidades
      state.total       = action.payload.total
      state.count       = action.payload.count       ?? 0
      state.page        = action.payload.page        ?? 1
      state.pageSize    = action.payload.pageSize    ?? 50
      state.search      = action.payload.search      ?? ''
      state.fechaInicio = action.payload.fechaInicio ?? ''
      state.fechaFin    = action.payload.fechaFin    ?? ''
    },
    resetFormularioStore:(state) => {
      state.id           = '';
      state.utilidades   = '';
      state.total        = '';
      state.count        = 0;
      state.page         = 1;
      state.pageSize     = 50;
      state.search       = '';
      state.fechaInicio  = '';
      state.fechaFin     = '';
    },
  }
})

// Action creators are generated for each case reducer function
export const { listStore, resetFormularioStore } = utilidadStore.actions;