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
    cuentasBancarias  : [],
    dashboardData     : [],
    total_cuenta_bancaria     : 0,
    total_devoluciones        : 0,
    total_gastos_generales    : 0,
    total_utilidad_ocacional  : 0,
    total_recepcionDePagos    : 0,
    total                     : 0,
    total_cuatro_por_mil      : 0,
    cuatro_por_mil            : 0,
    total_meno_cuatro_por_mil : 0,
    nombre_cuenta             : '',
    descripcion_cuenta        : '',
    numero_cuenta             : '',
    banco                     : '',
    cuatro_por_mil_data       : [],
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
    listDashboard:(state, action) => {
      console.log(action.payload)
      state.dashboardData             = action.payload.dashboardData;
      state.total_cuenta_bancaria     = action.payload.total_cuenta_bancaria;
      state.total_devoluciones        = action.payload.total_devoluciones;
      state.total_gastos_generales    = action.payload.total_gastos_generales;
      state.total_utilidad_ocacional  = action.payload.total_utilidad_ocacional;
      state.total_recepcionDePagos    = action.payload.total_recepcionDePagos;
       state.total_cuatro_por_mil     = action.payload.total_cuatro_por_mil;
      state.total                     = action.payload.total;
      state.cuatro_por_mil            = action.payload.cuatro_por_mil;
      state.total_meno_cuatro_por_mil = action.payload.total_meno_cuatro_por_mil;
      state.nombre_cuenta             = action.payload.nombre_cuenta;
      state.descripcion_cuenta        = action.payload.descripcion;
      state.numero_cuenta             = action.payload.numero_cuenta;
      state.banco                     = action.payload.banco;
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
export const { showStore, listStore, resetFormularioStore, handleFormStore, listDashboard } = cuentasBancariasStore.actions;