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
    <Grid container direction="row" justifyContent="space-between" sx={{ mb: { xs: 0.5, sm: 1 } }} alignItems='center'>

      <Grid item xs={12}>
        <Typography fontSize={{ xs: 24, sm: 32, md: 39 }} fontWeight="light"></Typography>
      </Grid>

      {/* ================================
              GRID RESPONSIVE
         ================================= */}
      <Grid container sx={{ mt: { xs: 1, sm: 2 }, width: "100%" }} spacing={{ xs: 1, sm: 2 }}>

        {/* CardClientes: En móvil ocupa 100%, en tablet+ ocupa 4 columnas */}
        <Grid item xs={12} md={4}>
          <CardClientes />
        </Grid>

        {/* DataTable: En móvil ocupa 100%, en tablet+ ocupa 8 columnas */}
        <Grid item xs={12} md={8}>
            <DataTable />
        </Grid>

      </Grid>

      <ToastContainer />
    </Grid>
  );
};
