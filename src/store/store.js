import { configureStore } from '@reduxjs/toolkit'
import { counterSlice }   from './slices/couter/counterSlice';
import { authStore }      from './authStore/authStore';
import { globalStore }    from './globalStore/globalStore';
import { usersStore }     from './usersStore/usersStore';
import { clientesStore }  from './clientesStore/clientesStore';
import { cotizadorStore } from './cotizadorStore/cotizadorStore';
import { tramitesStore }  from './tramitesStore/tramitesStore';
import { logsTramitesStore }          from './logsTramitesStore/logsTramitesStore';
import { logsCotizadorStore }         from './logsCotizadorStore/logsCotizadorStore';
import { confirmacionPreciosStore }   from './confirmacionPreciosStore/confirmacionPreciosStore';
import { etiquetasStore }             from './etiquetasStore/etiquetasStore';
import { registroTarjetasStore }      from './registroTarjetasStore/registroTarjetasStore';
import {cuentasBancariasStore}        from './cuentasBancariasStore/cuentasBancariasStore';
import { recepcionPagoStore }         from './recepcionPagoStore/recepcionPagoStore';
import { devolucionesStore }          from './devolucionesStore/devolucionesStore';
import { ajustesSaldoStore }          from './ajustesSaldoStore/ajustesSaldoStore';
import { gastosStore }                from './gastosStore/gastosStore';
import { gastosGeneralesStore }       from './gastosGeneralesStore/gastosGeneralesStore';
import { utilidadOcacionalStore }     from './utilidadOcacionalStore/utilidadOcacionalStore';
import { fichaClienteStore }          from './fichaClienteStore/fichaClienteStore';
import { archivocotizacionesantiguasStore } from './archivocotizacionesantiguasStore/archivocotizacionesantiguasStore';
import { historialtramitesemitidosStore } from './historialtramitesemitidosStore/historialtramitesemitidosStore';
import { proveedoresStore }           from './proveedoresStore/proveedoresStore';
import { fichaProveedoresStore }      from './fichaProveedoresStore/fichaProveedoresStore';

export const store = configureStore({
  reducer: {
    counter               : counterSlice.reducer,
    authStore             : authStore.reducer,
    globalStore           : globalStore.reducer,
    usersStore            : usersStore.reducer,
    clientesStore         : clientesStore.reducer,
    tramitesStore         : tramitesStore.reducer,
    logsTramitesStore     : logsTramitesStore.reducer,
    cotizadorStore        : cotizadorStore.reducer,
    logsCotizadorStore    : logsCotizadorStore.reducer,
    confirmacionPreciosStore: confirmacionPreciosStore.reducer,
    etiquetasStore        : etiquetasStore.reducer,
    cuentasBancariasStore : cuentasBancariasStore.reducer,
    registroTarjetasStore : registroTarjetasStore.reducer,
    recepcionPagoStore    : recepcionPagoStore.reducer,
    devolucionesStore     : devolucionesStore.reducer,
    ajustesSaldoStore     : ajustesSaldoStore.reducer,
    gastosStore           : gastosStore.reducer,
    gastosGeneralesStore  : gastosGeneralesStore.reducer,
    utilidadOcacionalStore: utilidadOcacionalStore.reducer,
    fichaClienteStore     : fichaClienteStore.reducer,
    archivocotizacionesantiguasStore: archivocotizacionesantiguasStore.reducer,
    historialtramitesemitidosStore: historialtramitesemitidosStore.reducer,
    proveedoresStore      : proveedoresStore.reducer,
    fichaProveedoresStore : fichaProveedoresStore.reducer
  }
})
