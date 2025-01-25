import { Grid, Typography } from '@mui/material';
import { StarOutline } from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../store/slices/couter/counterSlice'

export const NothingSelectedView = () => {

  const {counter} = useSelector(state => state.counter)

  const dispatch = useDispatch()


  return (
    <Grid
      container
      spacing={ 0 }
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: 'calc(100vh - 110px)', backgroundColor: 'primary.main', borderRadius: 3 }}
    >
        <Grid item xs={ 12 }>
            <StarOutline sx={{ fontSize: 100, color: 'white' }} />
        </Grid>
        <Grid item xs={ 12 }>
            <Typography color="white" variant='h5'>Selecciona o crea una entrada</Typography>
        </Grid>


        <div>
            <div>
              <button
                aria-label="Increment value"
                onClick={() => dispatch(increment(1))}
              >
                Increment {counter}
              </button>
              <span>1</span>
              <button
                aria-label="Decrement value"
                onClick={() => dispatch(decrement(1))}
              >
                Decrement {counter}
              </button>
            </div>
        </div>
    </Grid>
  )
}
