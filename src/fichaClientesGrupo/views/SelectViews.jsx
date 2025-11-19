import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { DataTable } from '../components/DataTable';
import { resetFormularioStore } from '../../store/clientesStore/clientesStore';
import { openModalShared, clearAlert } from '../../store/globalStore/globalStore';
import { FormDialogUser } from '../components/Modal';

import { useSelector, useDispatch } from 'react-redux';

import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { getAllThunks } from '../../store/fichaClienteGrupoStore/fichaClienteStoreThunks.js';

import { ToastContainer, toast } from 'react-toastify';
import { CardClientes } from '../components/CardClientes';   // 👈 AÑADIDO

export const SelectViews = () => {

  const dispatch = useDispatch();
  const { alert }  = useSelector( state => state.globalStore );

  useEffect(() => {
    if (alert) {
      if (alert.type === 'success') toast.success(alert.message, { position: 'top-center' });
      if (alert.type === 'error') toast.error(alert.message, { position: 'top-center' });

      dispatch(clearAlert());
    }
  }, [alert]);

  useEffect(() => {
    dispatch(getAllThunks());
  },[]);

  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb: 1 }} alignItems='center'>

      <Grid item>
        <Typography fontSize={39} fontWeight="light"></Typography>
      </Grid>

      {/* ================================
              GRID 7 COLUMNAS + 5 COLUMNAS
         ================================= */}
      <Grid container sx={{ mt: 2, width: "100%" }}>
        
        <Grid item xs={4}>
          <CardClientes />
        </Grid>


        <Grid item xs={8}>
            <DataTable />
        </Grid>

      </Grid>

      <ToastContainer />
    </Grid>
  );
};
