import { Route, Routes }          from 'react-router-dom';
import { AuthRoutes }             from '../auth/routes/AuthRoutes';
import { JournalRoutes }          from '../journal/routes/JournalRoutes';
import { UsersPage }              from '../users/pages/UsersPage';  
import { PageMain as ClientePage } from '../clientes/pages/PageMain';
import { PageMain as TramitePage } from '../tramites/pages/PageMain';
import { useSelector  }           from 'react-redux';
import { RoutesTramites }         from '../tramites/routes/Routes';

export const AppRouter = () => {
 
  const data = useSelector(state => state.authStore);

  return (
    <Routes>
            {data.isLogin ? (
              <>
                <Route path="/*"            element={ <JournalRoutes /> } />
                <Route path="/users"        element={ <UsersPage /> } />
                <Route path="/clientes"     element={ <ClientePage /> } />
                {/*<Route path="/tramites"   element={ <TramitePage /> } />*/}
                <Route path="/tramites/*"     element={<RoutesTramites />} />
              </>
              ) : (
                <Route path="/auth/*" element={ <AuthRoutes /> } />
            )
          
        }
      </Routes>
  )
}