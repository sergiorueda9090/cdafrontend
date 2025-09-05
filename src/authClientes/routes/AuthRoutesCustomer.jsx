import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, ProfilePage } from '../pages';
import { useSelector } from 'react-redux';

export const AuthRoutesCustomer = () => {
  const { isLogin } = useSelector(state => state.authCustomerStore);

  return (
    <Routes>
      {/* Ruta pública: /customer */}
      <Route
        path="/"
        element={
          !isLogin
            ? <LoginPage />
            : <Navigate to="profile" replace /> // ✅ relativo: /customer/profile
        }
      />

      {/* Ruta privada: /customer/profile */}
      <Route
        path="profile"
        element={
          isLogin
            ? <ProfilePage />
            : <Navigate to="/" replace /> // ✅ vuelve al login
        }
      />

      {/* Rutas desconocidas redirigen al login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
