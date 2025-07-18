import { createSlice } from '@reduxjs/toolkit'

export const balancegeneralStore = createSlice({
  name: 'balancegeneralStore',
  initialState: {
    id: '',
    balanceGeneral: [],
    totalSaldoClientes: 0,
    totalGastosGenerales: 0,
    totalComisionesProveedores: 0,
    totalTarjetas: 0,
    sumaTotal:0,
    utilidades:0,
    tarjetas:[],
  },
  reducers: {
    listStore: (state, action) => {
      state.balanceGeneral = action.payload.balanceGeneral;
      state.totalSaldoClientes = action.payload.totalSaldoClientes || 0;
      state.totalGastosGenerales = action.payload.totalGastosGenerales || 0;
      state.totalComisionesProveedores = action.payload.totalComisionesProveedores || 0;
      state.totalTarjetas = action.payload.totalTarjetas || 0;
      state.sumaTotal = action.payload.sumaTotal || 0;
      state.utilidades = action.payload.utilidades || 0;
      state.tarjetas = action.payload.tarjetas || [];
    },
    resetFormularioStore: (state) => {
      state.id = '';
      state.balanceGeneral = [];
      state.totalSaldoClientes = 0;
      state.totalGastosGenerales = 0;
      state.totalComisionesProveedores = 0;
      state.totalTarjetas = 0;
      state.sumaTotal = 0;
      state.utilidades = 0;
      state.tarjetas = [];
    },
  }
})

// Action creators are generated for each case reducer function
export const { listStore, resetFormularioStore} = balancegeneralStore.actions;