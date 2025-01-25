import { createSlice } from '@reduxjs/toolkit'

export const usersStore = createSlice({
  name: 'usersStore',
  initialState: {
    idUser      : null,
    username    : '',
    name        : '',
    email       : '',
    first_name  : '',
    last_name   : '',
    password    : '',
    repetirPassword:'',
    imageUser   :false,
    users       : [],
    statesUser  :[
        {
          value: false,
          label: 'Inactivo',
        },
        {
          value: true,
          label: 'Activo',
        },
      ]
  },
  reducers: {
    showUserStore:(state,action) => {
      state.idUser      = action.payload.id;
      state.username    = action.payload.username;
      state.name        = action.payload.name;
      state.email       = action.payload.email;
      state.first_name  = action.payload.first_name;
      state.last_name   = action.payload.last_name;
      state.password    = action.payload.password;
      state.repetirPassword = action.payload.repetirPassword;
      state.imageUser   = false;
      state.statesUser  = [
          {
            value: false,
            label: 'Inactivo',
          },
          {
            value: true,
            label: 'Activo',
          },
        ]
    },
    listUsuersStore:(state, action) => {
      state.users = action.payload.users
    },
    resetFormularioStore:(state) => {
      state.idUser      = null;
      state.username    = '';
      state.name        = '';
      state.email       = '';
      state.first_name  = '';
      state.last_name   = '';
      state.password    = '';
      state.repetirPassword= '';
      state.imageUser   = false;
      state.statesUser  = [
          {
            value: false,
            label: 'Inactivo',
          },
          {
            value: true,
            label: 'Activo',
          },
        ]
    },
  }
})

// Action creators are generated for each case reducer function
export const { showUserStore, listUsuersStore, resetFormularioStore } = usersStore.actions;