import { createSlice } from '@reduxjs/toolkit'

export const tramitesStore = createSlice({
  name: 'tramitesStore',
  initialState: {
    id              : '',
    idUsuario       : '',
    idCliente       : '',
    nombre_usuario  : '',
    image_usuario   : '',
    nombre_cliente  : '',
    etiquetaUno     : '',
    etiquetaDos     : '',
    placa           : '',
    cilindraje      : '',
    modelo          : '',
    chasis          : '',
    tipoDocumento   : 'Cedula',
    numeroDocumento : '',
    nombreCompleto  : '',
    telefono        : '',
    correo          : '',
    direccion       : '',
    etiquetaUnoArray: ['LUZ VERDE', 'ESPERAR CONFIRMACION'],//etapa dos
    etiquetaDosArray: [
                        "LINK DE PAGO",
                        "AMALFI",
                        "AURA",
                        "CENTRO",
                        "NO PREV",
                        "NO EST",
                        "NO R5",
                        "NO MUNDIAL",
                        "NO PREV-EST",
                        "NO PREV-R5",
                        "NO PREV-MUNDIAL",
                        "NO ESTADO-R5",
                        "SI PREV",
                        "SI ESTADO",
                        "SI R5",
                        "SI MUNDIAL",
                        "ERROR DE CARGA",
                        "ERROR DE PASAJEROS",
                        "ERROR DE MOTOR/CHASIS",
                        "SIN PREASIGNAR",
                      ],//etapa dos
    linkPago        : '',//etapa dos
    pagoInmediato   : 'si',//etapa dos //true SI (Confirmar como emitido), false NO (Guardar link)
    preciosLeyArray : [],  //etapa tres
    precioDeLey      : '',
    comisionPrecioLey: '', //etapa tres
    total           : '', //etapa tres
    pdf             : '', //etapa cuatro
    clientes        : [],
    tiposDocumentos : [],
    tramites        : [],
    etiqueta        : '',
  },
  reducers: {
    showStore:(state,action) => {
      console.log("action.payload ",action.payload)
      state.id              = action.payload.id;
      state.idUsuario       = action.payload.idUsuario;
      state.idCliente       = action.payload.idCliente;

      state.nombre_usuario  = action.payload.nombre_usuario;
      state.image_usuario   = action.payload.image_usuario;
      state.nombre_cliente  = action.payload.nombre_cliente;

      state.etiquetaUno     = action.payload.etiquetaUno;
      state.etiquetaDos     = action.payload.etiquetaDos;
      state.placa           = action.payload.placa;
      state.cilindraje      = action.payload.cilindraje;
      state.modelo          = action.payload.modelo;
      state.chasis          = action.payload.chasis;
      state.tipoDocumento   = action.payload.tipoDocumento;
      state.numeroDocumento = action.payload.numeroDocumento;
      state.nombreCompleto  = action.payload.nombreCompleto;
      state.telefono        = action.payload.telefono;
      state.correo          = action.payload.correo;
      state.direccion       = action.payload.direccion;

      state.linkPago        = action.payload.linkPago;
      state.pagoInmediato   = action.payload.pagoInmediato;

      state.precioDeLey       = action.payload.precioDeLey;
      state.comisionPrecioLey = action.payload.comisionPrecioLey;
      state.total             = action.payload.total;

      state.pdf               = action.payload.pdf;


    },
    listStore:(state, action) => {
      state.tramites = action.payload.tramites
    },
    resetFormularioStore:(state) => {
      state.id              = '';
      state.idUsuario       = '';
      state.idCliente       = '';
      state.nombre_usuario  = '';
      state.image_usuario   = '';
      state.nombre_cliente  = '';
      state.etiquetaUno     = '';
      state.etiquetaDos     = '';
      state.placa           = '';
      state.cilindraje      = '';
      state.modelo          = '';
      state.chasis          = '';
      state.tipoDocumento   = 'Cedula';
      state.numeroDocumento = '';
      state.nombreCompleto  = '';
      state.telefono        = '';
      state.correo          = '';
      state.direccion       = '';
      state.etiquetaUnoArray= ["LUZ VERDE", "ESPERAR CONFIRMACION"];//etapa dos
      state.etiquetaDosArray= [
                                "LINK DE PAGO",
                                "AMALFI",
                                "AURA",
                                "CENTRO",
                                "NO PREV",
                                "NO EST",
                                "NO R5",
                                "NO MUNDIAL",
                                "NO PREV-EST",
                                "NO PREV-R5",
                                "NO PREV-MUNDIAL",
                                "NO ESTADO-R5",
                                "SI PREV",
                                "SI ESTADO",
                                "SI R5",
                                "SI MUNDIAL",
                                "ERROR DE CARGA",
                                "ERROR DE PASAJEROS",
                                "ERROR DE MOTOR/CHASIS",
                                "SIN PREASIGNAR",
                              ];//etapa dos
      state.linkPago        = '';//etapa dos
      state.pagoInmediato   = 'si';//etapa dos //true SI (Confirmar como emitido); false NO (Guardar link)
      state.preciosLeyArray = [];  //etapa tres
      state.precioDeLey     = '';
      state.comisionPrecioLey= ''; //etapa tres
      state.total           = ''; //etapa tres
      state.pdf             = ''; //etapa cuatro
      state.clientes        = [];
      state.tiposDocumentos = [];
      //state.tramites        = [];
      state.etiqueta        = '';
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      console.log( name, value )
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore,handleFormStore } = tramitesStore.actions;