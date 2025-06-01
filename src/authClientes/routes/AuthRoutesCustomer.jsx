import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, ProfilePage } from '../pages';
import { useSelector } from 'react-redux';

export const AuthRoutesCustomer = () => {

  const { isLogin } = useSelector(state => state.authCustomerStore);

  return (
    <Routes>
      {/* Ruta pública */}
      <Route
        path="/customer"
        element={
          !isLogin
            ? <LoginPage />
            : <Navigate to="profile" replace />  // ✅ Ruta relativa dentro de /customer
        }
      />

      {/* Ruta privada */}
      <Route
        path="customer/profile"
        element={
          isLogin
            ? <ProfilePage />
            : <Navigate to="/customer" replace />  // ✅ vuelve al login dentro de /customer
        }
      />

      {/* Cualquier ruta desconocida redirige al login de /customer */}
      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
};