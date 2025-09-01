import { createSlice } from '@reduxjs/toolkit'

export const registroTarjetasStore = createSlice({
  name: 'registroTarjetasStore',
  initialState: {
    id                : '',
    idTarTranMoney    : '',
    transMoneyState   : false,
    numero_cuenta     : '',
    nombre_cuenta     : '',
    descripcion       : '',
    saldo             : 0,
    imagen            : '',
    banco             : '',
    is_daviplata      : false,
    tarjetasBancarias : [],
    getTotalTarjetas  : [],
    soldoTransferencia: 0,
  },
  reducers: {
    showStore:(state,action) => {
      state.id            = action.payload.id;
      state.numero_cuenta = action.payload.numero_cuenta;
      state.nombre_cuenta = action.payload.nombre_cuenta;
      state.descripcion   = action.payload.descripcion;
      state.saldo         = action.payload.saldo;
      state.imagen        = action.payload.imagen;
      state.banco         = action.payload.banco;
      state.transMoneyState = action.payload.transMoneyState;
      state.is_daviplata  = action.payload.is_daviplata;
    },
    listStore:(state, action) => {
      state.tarjetasBancarias = action.payload.tarjetasBancarias
    },
    listTotalStore:(state, action) => {
      state.getTotalTarjetas  = action.payload.getTotalTarjetas
    },
    resetFormularioStore:(state) => {
      state.id            = '';
      state.idTarTranMoney= '';
      state.numero_cuenta = '';
      state.nombre_cuenta = '';
      state.descripcion   = '';
      state.saldo         = '';
      state.imagen        = '';
      state.banco         = '';
      state.soldoTransferencia  = 0;
      state.transMoneyState = false;
      state.is_daviplata  = false;
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      console.log( "name ", name )
      console.log(" value ",value)
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore, listTotalStore } = registroTarjetasStore.actions;