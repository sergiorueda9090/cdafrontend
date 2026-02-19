import { Grid, Typography } from '@mui/material';
import { ShowView } from './ShowView';
import { SimpleBackdrop } from '../../components/Backdrop/BackDrop';

export const SelectViews = () => {

  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb: { xs: 0.5, sm: 1 } }} alignItems='center'>

        <Grid item xs={12}>
            <Typography fontSize={{ xs: 24, sm: 32, md: 39 }} fontWeight="light"> </Typography>
        </Grid>

        <Grid container sx={{ mt: { xs: 1, sm: 2 }, width: "100%" }}>
            <ShowView />
        </Grid>

        <SimpleBackdrop />

    </Grid>
  )
}
