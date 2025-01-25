import { createSlice } from '@reduxjs/toolkit'

export const globalStore = createSlice({
  name: 'globalStore',
  initialState: {
    openBackDropStore:false,
    openModalStore:false,
    openLinearProgress:false,
    alert: null,
  },
  reducers: {
    showBackDropStore:(state) => {
      state.openBackDropStore = true
    },
    hideBackDropStore:(state) => {
      state.openBackDropStore = false
    },
    openModalShared:(state, action) => {
        state.openModalStore = true;
    },
    closeModalShared:(state, action) => {
        state.openModalStore    = false;
    },
    showLinearProgress:(state, action) => {
      state.openLinearProgress = true;
    },
    hideLinearProgress:(state, action) => {
      state.openLinearProgress = false;
    },
    setAlert: (state, action) => {
      state.alert = action.payload; // Guarda el mensaje de alerta
    },
    clearAlert: (state) => {
      state.alert = null; // Limpia el mensaje de alerta
    },
  }
})

// Action creators are generated for each case reducer function
export const { showBackDropStore, hideBackDropStore, openModalShared, closeModalShared, showLinearProgress, hideLinearProgress, setAlert, clearAlert } = globalStore.actions;