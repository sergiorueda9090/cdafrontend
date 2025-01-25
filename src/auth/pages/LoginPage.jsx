import { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';

import { useDispatch } from 'react-redux'
import { getAuth }     from '../../store/authStore/authThunks';
import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";


export const LoginPage = () => {
  
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [errors,    setErrors]    = useState({ email: '', password: '' });

  const dispatch = useDispatch()
  
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
    
    </AuthLayout>
  )
}