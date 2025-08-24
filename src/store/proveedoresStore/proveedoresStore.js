import { colors } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'

export const proveedoresStore = createSlice({
  name: 'proveedoresStore',
  initialState: {
    id          : '',
    idProveedor : '',
    nombre      : '',
    etiqueta    : '',
    proveedores : [],
    defaultProv : {},
    columnsConfirmacionPrecios: [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id          = action.payload.id;
      state.nombre      = action.payload.nombre;
      state.etiqueta    = action.payload.etiqueta;
    },
    listStore:(state, action) => {
      state.proveedores = action.payload.proveedores;
    },
    listStoreDefaulProv:(state, action) => {
      state.defaultProv = action.payload.defaultProv;
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
    },
    handleFormColumnsConfirmacionPrecioStore: (state, action) => {
      const { name, value } = action.payload; 

      const index = state[name].findIndex(item => item.id_row === value.id_row);

      if (index !== -1) {
        state[name][index] = {
          ...state[name][index],
          ...value,
        };
      } else {
        state[name].push(value);
      }
    }

  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore, listStoreDefaulProv, handleFormColumnsConfirmacionPrecioStore } = proveedoresStore.actions;