import { createSlice } from '@reduxjs/toolkit'

export const logsTramitesStore = createSlice({
  name: 'logsTramitesStore',
  initialState: {
    logsTramites : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.logsTramites  = action.payload.logsTramites;
    },
    listStore:(state, action) => {
      state.logsTramites  = action.payload.logsTramites;
    },
    resetFormularioStore:(state) => {
      state.logsTramites  = [];
    },
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore } = logsTramitesStore.actions;