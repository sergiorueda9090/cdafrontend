import { createSlice } from '@reduxjs/toolkit'

export const cotizadorStore = createSlice({
  name: 'cotizadorStore',
  initialState: {
    id              : '',
    idUsuario       : '',
    idCliente       : '',
    image_usuario   : '',
    nombre_usuario  : '',
    nombre_cliente  : '',
    etiquetaUno     : '',
    idEtiqueta      : '',
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
    archivo         : '',
    clientes        : [],
    tiposDocumentos : [],
    cotizadores     : [],
    tramitesArray   : [],
    cotizadorModulo : '0',
    tramiteModulo   : '0',
    confirmacionPreciosModulo: '0',
    pdfsModulo      : '0',
    
    idBanco         : '',

    dateFilter      : false,  // false puede editar, true no puede editar
    disableBtn      : false,
  },
  reducers: {
    showStore:(state,action) => {
      state.id              = action.payload.id;
      state.idUsuario       = action.payload.idUsuario;
      state.idCliente       = action.payload.idCliente;

      state.image_usuario   = action.payload.image_usuario;
      state.nombre_usuario  = action.payload.nombre_usuario;
      state.nombre_cliente  = action.payload.nombre_cliente;

      state.etiquetaUno     = action.payload.etiquetaUno;

      state.idEtiqueta      = action.payload.idEtiqueta;
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
      state.archivo           = action.payload.archivo;

      state.cotizadorModulo = action.payload.cotizadorModulo;
      state.confirmacionPreciosModulo= action.payload.confirmacionPreciosModulo;
      state.pdfsModulo      = action.payload.pdfsModulo;
      state.tramiteModulo   = action.payload.tramiteModulo;

      let requiredFields = [
        "modelo",
        "idCliente",
        "etiquetaDos",
        "placa",
        "cilindraje",
        "chasis",
        "tipoDocumento",
        "numeroDocumento",
        "nombreCompleto",
    ];

    
    let allFieldsFilled = requiredFields.every(field => state[field] && state[field].toString().trim() !== "");
    state.disableBtn = allFieldsFilled;

    state.idBanco = action.payload.idBanco;
    },
    listStore:(state, action) => {
      state.cotizadores = action.payload.cotizadores

      if(action.payload.dateFilter){
        state.dateFilter =  action.payload.dateFilter
      }else{
        state.dateFilter =  action.payload.dateFilter
      }
      
    },
    listStoreUpdate:(state, action) => {
      const updated = action.payload.cotizadores; // tu objeto actualizado (data)
      const index = state.cotizadores.findIndex(c => c.id === updated.id);

      if (index !== -1) {
        state.cotizadores[index] = {
          ...state.cotizadores[index],
          ...updated
        };
      }
    },
    listTramitesStore:(state, action) => {
      state.tramitesArray = action.payload.cotizadores

      if(action.payload.dateFilter){
        state.dateFilter =  action.payload.dateFilter
      }else{
        state.dateFilter =  action.payload.dateFilter
      }
      
    },
    listRemoveStore:(state, action) => {
      console.log('Eliminar cotizador con ID:', action.payload.id);
      state.cotizadores = state.cotizadores.filter((cotizador) => cotizador.id !== action.payload.id);
    },

    listAddStore: (state, action) => {
      console.log('Agregar cotizador:', action.payload);

      // Verificar si ya existe antes de agregar
      const exists = state.cotizadores.some(c => c.id === action.payload.id);
      console.log("exists ",exists)
      if (!exists) {
        state.cotizadores.push(action.payload);
      }
    },

    resetFormularioStore:(state) => {
      state.id              = '';
      state.idUsuario       = '';
      state.idCliente       = '';
      state.image_usuario   = '';
      state.nombre_usuario  = '';
      state.nombre_cliente  = '';
      state.etiquetaUno     = '';
      state.idEtiqueta      = '';
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
      state.archivo         = '';
      state.clientes        = [];
      state.tiposDocumentos = [];
      //state.cotizadores        = [];

      state.idBanco         = '';

      state.dateFilter      = false; 
      state.disableBtn      = false;
    },
    handleFormStore: (state, action) => {
      const { name, value } = action.payload; // Obtener el nombre y el valor
      state[name] = value; // Actualizar dinámicamente la propiedad en el estado
  
      let requiredFields = [
          "modelo",
          "idCliente",
          "etiquetaDos",
          "placa",
          "cilindraje",
          "chasis",
          "tipoDocumento",
          "numeroDocumento",
          "nombreCompleto",
      ];
  
      // Verificar si todos los campos están llenos
      let allFieldsFilled = requiredFields.every(field => state[field] && state[field].toString().trim() !== "");
  
      // Verificar si "etiquetaDos" tiene un valor permitido
      let validEtiquetaDos = ["LINK DE PAGO", "AMALFI", "AURA", "CENTRO"].includes(state.etiquetaDos);
  
      // Habilitar el botón solo si ambas condiciones se cumplen
      state.disableBtn = allFieldsFilled && validEtiquetaDos;
    },
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listTramitesStore, listStore, resetFormularioStore, handleFormStore, listStoreUpdate, listRemoveStore, listAddStore } = cotizadorStore.actions;