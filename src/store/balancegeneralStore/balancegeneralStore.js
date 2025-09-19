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
    patrimonioBruto:0,
    sumaTotal:0,
    utilidades:0,
    tarjetas:[],
    clientes:[],
    patrimonioNeto:0,
    utilidadnominal:0,
    utilidadreal:0,
    totaldiferencia:0,
    gastos_totales_de_periodo:0,
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
      state.clientes = action.payload.clientes || [];
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
    getObtenerTotalTarjetasStore: (state, action) => {
      state.patrimonioBruto = action.payload.patrimonioBruto;
    },
    getPatrimonioNetoStore: (state, action) => {
      state.patrimonioNeto = action.payload.patrimonioNeto;
    },
    getGastosTotalesDelPeriodoStore: (state, action) => {
      state.gastos_totales_de_periodo = action.payload.gastos_totales_de_periodo;
    },
    getUtilidadNominalStore: (state, action) => {
      state.utilidadnominal = action.payload.utilidadnominal;
    },
    getUtilidadRealStore: (state, action) => {
      state.utilidadreal = action.payload.utilidadreal;
    },
    getTotalDiferenciaStore: (state, action) => {
      state.totaldiferencia = action.payload.totaldiferencia;
    },

  }
})

// Action creators are generated for each case reducer function
export const { listStore, resetFormularioStore, getObtenerTotalTarjetasStore, getPatrimonioNetoStore, 
            getUtilidadNominalStore, getUtilidadRealStore, getTotalDiferenciaStore, getGastosTotalesDelPeriodoStore} = balancegeneralStore.actions;