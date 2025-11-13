import { createSlice } from '@reduxjs/toolkit'

export const fichaClienteGrupoStore = createSlice({
  name: 'fichaClienteGrupoStore',
  initialState: {
    fichasClienteGrupo: [],
  },
  reducers: {
    listStore:(state, action) => {
      state.fichasClienteGrupo = action.payload.fichasClienteGrupo
    },
  }
})

// Action creators are generated for each case reducer function
export const { listStore } = fichaClienteGrupoStore.actions;