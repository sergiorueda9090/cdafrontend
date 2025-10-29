import { createSlice } from '@reduxjs/toolkit'

export const historialtramitesemitidosStore = createSlice({
  name: 'historialtramitesemitidosStore',
  initialState: {
    historial   : [],
    etiquetaDos   : "",
    idEtiqueta    : null,
    placa         : "",
    cilindraje    : "",
    modelo        : "",
    chasis        : "",
    tipoDocumento : "",
    numeroDocumento : "",
    nombreCompleto  : "",
    telefono        : "",
    correo          : "",
    direccion       : "",
    pagoInmediato   : "",
    linkPago        : "",
    precioDeLey     : "",
    comisionPrecioLey: "",
    total           : "",
    pdf             : "",
    archivo         : "",
    fechaCreacion   : "",
    cotizadorModulo : "",
    tramiteModulo   : "",
    confirmacionPreciosModulo: "",
    pdfsModulo    : "",
    idBanco       : null,
    nombre_usuario: "",
    image_usuario : "",
    nombre_cliente: "",
    color_cliente : "",
    color_etiqueta: "",
    count: 0
  },
  reducers: {
    listStore:(state,action) => {
      state.historial = action.payload.historial;
      state.count     = action.payload.count;
    },
    resetFormularioStore:(state) => {
      state.historial = [];
    },
    showStore:(state, action) => {
      state.etiquetaDos      = action.payload.etiquetaDos || "";
      state.idEtiqueta       = action.payload.idEtiqueta || "";
      state.placa            = action.payload.placa || "";
      state.cilindraje       = action.payload.cilindraje || "";
      state.modelo           = action.payload.modelo || "";
      state.chasis           = action.payload.chasis || "";
      state.tipoDocumento    = action.payload.tipoDocumento || "";
      state.numeroDocumento  = action.payload.numeroDocumento || "";
      state.nombreCompleto   = action.payload.nombreCompleto || "";
      state.telefono         = action.payload.telefono || "";
      state.correo           = action.payload.correo || "";
      state.direccion        = action.payload.direccion || "";
      state.pagoInmediato    = action.payload.pagoInmediato || "";
      state.linkPago         = action.payload.linkPago || "";
      state.precioDeLey      = action.payload.precioDeLey || "";
      state.comisionPrecioLey= action.payload.comisionPrecioLey || "";
      state.total            = action.payload.total || "";
      state.pdf              = action.payload.pdf || "";
      state.archivo          = action.payload.archivo || "";
      state.fechaCreacion    = action.payload.fechaCreacion || "";
      state.cotizadorModulo  = action.payload.cotizadorModulo || "";
      state.tramiteModulo    = action.payload.tramiteModulo || "";
      state.confirmacionPreciosModulo = action.payload.confirmacionPreciosModulo || "";
      state.pdfsModulo       = action.payload.pdfsModulo || "";
      state.idBanco          = action.payload.idBanco || "";
      state.nombre_usuario   = action.payload.nombre_usuario || "";
      state.image_usuario    = action.payload.image_usuario || "";
      state.nombre_cliente   = action.payload.nombre_cliente || "";
      state.color_cliente    = action.payload.color_cliente || "";
      state.color_etiqueta   = action.payload.color_etiqueta || "";
    }
  }
})

// Action creators are generated for each case reducer function
export const { listStore, resetFormularioStore, showStore } = historialtramitesemitidosStore.actions;