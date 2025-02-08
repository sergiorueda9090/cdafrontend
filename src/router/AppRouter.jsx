import { Route, Routes, Navigate }          from 'react-router-dom';
import { AuthRoutes }                   from '../auth/routes/AuthRoutes';
import { JournalRoutes }                from '../journal/routes/JournalRoutes';
import { UsersPage }                    from '../users/pages/UsersPage';  
import { PageMain as ClientePage }      from '../clientes/pages/PageMain';
import { PageMain as EtiquetaPage }     from '../etiquetas/pages/PageMain';
import { PageMain as TramitePage }      from '../tramites/pages/PageMain';
import { PageMain as Verify }           from '../CodeVerification/pages/PageMain';
import { useSelector  }                 from 'react-redux';
import { RoutesTramites }               from '../tramites/routes/Routes';
import { RoutesCotizador }              from '../cotizador/routes/Routes';
import { RoutesConfirmacionPrecios }    from '../confirmacionPrecios/routes/Routes';
import { RoutesPdfs }                   from '../cargarPdfs/routes/Routes';
import { PageMain as BancosMain }       from '../bancos/pages/PageMain';
import { PageMain as FichaCliente }     from '../fichaClientes/pages/PageMain';

export const AppRouter = () => {
 
  const data = useSelector(state => state.authStore);
  
  return (
    <Routes>
            {data.isLogin ? (
              <>
                <Route path="/*"                      element={ <JournalRoutes /> } />
                <Route path="/users"                  element={ <UsersPage /> } />
                <Route path="/clientes"               element={ <ClientePage /> } />
                <Route path="/etiquetas"              element={ <EtiquetaPage /> } />
                <Route path="/tramites/*"             element={ <RoutesTramites />} />
                <Route path="/cotizador/*"            element={ <RoutesCotizador />} />
                <Route path="/confirmacionprecios/*"  element={ <RoutesConfirmacionPrecios />} />
                <Route path="/cargarpdfs/*"           element={ <RoutesPdfs />} />
                <Route path="/bancos"                 element={ <BancosMain /> } />
                <Route path="/fichaCliente"           element={ <FichaCliente /> } />
                <Route path="/verify"                 element={ <Verify /> }    />
              </>
              ) : (
                <>
                  <Route path="/auth/*"       element={ <AuthRoutes /> } />
                  <Route path="*"             element={<Navigate to="/auth" replace />} />
                </>
            )
          
        }
      </Routes>
  )
}