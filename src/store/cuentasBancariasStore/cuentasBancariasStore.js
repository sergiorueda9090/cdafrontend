import { createSlice } from '@reduxjs/toolkit'

export const cuentasBancariasStore = createSlice({
  name: 'cuentasBancariasStore',
  initialState: {
    id                : '',
    idBanco           : '',
    fechaIngreso      : '',
    fechaTransaccion  : '',
    descripcion       : '',
    valor             : '',
    cilindraje        : '',
    placa             : '',
    nombreTitular     : '',
    image             : '',
    archivo           : '',
    cuentasBancarias : [],
  },
  reducers: {
    showStore:(state,action) => {
      state.id                = action.payload.id;
      state.idBanco           = action.payload.idBanco;
      state.fechaIngreso      = action.payload.fechaIngreso;
      state.fechaTransaccion  = action.payload.fechaTransaccion;
      state.descripcion       = action.payload.descripcion;
      state.valor             = action.payload.valor;
      state.cilindraje        = action.payload.cilindraje;
      state.placa             = action.payload.placa;
      state.nombreTitular     = action.payload.nombreTitular;
      state.image             = action.payload.image;
      state.archivo           = action.payload.archivo;
    },
    listStore:(state, action) => {
      state.cuentasBancarias = action.payload.cuentasBancarias
    },
    resetFormularioStore:(state) => {
      state.id              = '';
      state.idBanco         = '';
      state.fechaIngreso    = '';
      state.fechaTransaccion= '';
      state.descripcion     = '';
      state.valor           = '';
      state.cilindraje      = '';
      state.placa           = '';
      state.nombreTitular   = '';
      state.image           = '';
      state.archivo         = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      console.log( name, value )
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = cuentasBancariasStore.actions;