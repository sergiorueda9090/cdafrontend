import React, { useEffect, useState } from 'react';
import { Grid, TextField, FormControl, Button, Autocomplete } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks } from '../../store/usersStore/usersThunks';
import { createThunks, updateThunks } from '../../store/cotizadorStore/cotizadorThunks';

import { useNavigate }  from 'react-router-dom';

export const UsersSelect = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllThunks());
  },[])

  const { users } = useSelector( state => state.usersStore);
  const { id, idCliente, precioDeLey, comisionPrecioLey,  etiquetaDos, placa, cilindraje,modelo, chasis, 
         telefono, nombreCompleto,numeroDocumento,tipoDocumento,correo, direccion, total, tramiteModulo } = useSelector((state) => state.cotizadorStore);


  const handleUsers = (value) => {
    alert("SELECT USER");
  }

  const handleSendNotification = () => {
    
    let data = {
                  id, 
                  idCliente, 
                  precioDeLey, 
                  comisionPrecioLey, 
                  etiquetaDos, 
                  placa, 
                  cilindraje,
                  modelo, 
                  chasis, 
                  telefono, 
                  nombreCompleto,
                  numeroDocumento,
                  tipoDocumento,
                  correo, 
                  direccion,
                  total,
                  tramiteModulo:1
    }
    
    alert("envio de notificacion whatsapp");
    console.log("handleSendNotification data ",data);

    dispatch(createThunks(data));

    navigate(`/tramites`);

  }


  return (
    <>
      <Grid item xs={6}>
          <FormControl fullWidth>
            <Autocomplete
                disablePortal
                options={users}
                getOptionLabel={(option) => option.username || ""}
                onChange={(e, value) => handleUsers(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Usuarios"
                  />
                )}
              />
          </FormControl>
        </Grid>

           <Grid item xs={6} fullWidth>
              <Button variant="contained" color="success" fullWidth type="button" onClick={handleSendNotification}>Enviar Notificacion</Button>
            </Grid>
    </>
  );
}