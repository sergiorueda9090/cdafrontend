import { useState, useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { clearAlert }  from '../../store/globalStore/globalStore';
import { useDispatch } from 'react-redux'
import { getAuth }     from '../../store/authStore/authThunks';
import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";

export const LoginPage = () => {
  const { alert }  = useSelector( state => state.globalStore );
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [errors,    setErrors]    = useState({ email: '', password: '' });

  const dispatch = useDispatch()

    useEffect(() => {
        if (alert) {
          // Muestra la alerta según el tipo
          if (alert.type === 'success') toast.success(alert.message, { position: 'top-center' });
          if (alert.type === 'error') toast.error(alert.message, { position: 'top-center' });
    
          // Limpia la alerta después de mostrarla
          dispatch(clearAlert());
        }
    }, [alert]);
  
  const validate = () => {
    let tempErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      tempErrors.email = 'El correo es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'El correo no es válido';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (validate()) {
  
      await dispatch( getAuth(email, password) );
  
    }
  
  };

  return (
    <AuthLayout title="Login">

      <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Correo" 
                type="email" 
                placeholder='correo@google.com' 
                fullWidth                
                error={Boolean(errors.email)}
                helperText={errors.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Contraseña" 
                type="password" 
                placeholder='Contraseña' 
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            
            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 } sm={ 12 }>
                <Button type="submit" variant="contained" fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>

          </Grid>
        </form>

      <SimpleBackdrop />

      
        {/* START ALERT */}
        <ToastContainer
            position="top-center" // Posición predeterminada
            autoClose={1000} // Tiempo de cierre automático
            hideProgressBar={false} // Mostrar barra de progreso
            newestOnTop={true} // Notificaciones más recientes arriba
            closeOnClick // Cierre al hacer clic
            draggable // Arrastrar para cerrar
            pauseOnHover // Pausar al pasar el ratón
            theme="colored" // Tema colorido
        />
        {/* END ALERT */}
    
    </AuthLayout>
  )
}