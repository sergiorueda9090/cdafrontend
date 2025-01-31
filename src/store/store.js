import { configureStore } from '@reduxjs/toolkit'
import { counterSlice }   from './slices/couter/counterSlice';
import { authStore }      from './authStore/authStore';
import { globalStore }    from './globalStore/globalStore';
import { usersStore }     from './usersStore/usersStore';
import { clientesStore }  from './clientesStore/clientesStore';
import { cotizadorStore } from './cotizadorStore/cotizadorStore';
import { tramitesStore }  from './tramitesStore/tramitesStore';
import { logsTramitesStore }  from './logsTramitesStore/logsTramitesStore';
import { logsCotizadorStore } from './logsCotizadorStore/logsCotizadorStore';
import { confirmacionPreciosStore } from './confirmacionPreciosStore/confirmacionPreciosStore';


export const store = configureStore({
  reducer: {
    counter           : counterSlice.reducer,
    authStore         : authStore.reducer,
    globalStore       : globalStore.reducer,
    usersStore        : usersStore.reducer,
    clientesStore     : clientesStore.reducer,
    tramitesStore     : tramitesStore.reducer,
    logsTramitesStore : logsTramitesStore.reducer,
    cotizadorStore    : cotizadorStore.reducer,
    logsCotizadorStore: logsCotizadorStore.reducer,
    confirmacionPreciosStore: confirmacionPreciosStore.reducer,
  }
})
