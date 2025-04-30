import { Grid, Typography } from '@mui/material';
import { ShowView } from './ShowView';

export const SelectViews = () => {

  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid item>
            <Typography fontSize={39} fontWeight="light"> </Typography>
        </Grid>


        <Grid container sx={{ mt:2, width:"99.99%" }}>
            <ShowView />
        </Grid>

    </Grid>
  )
}
