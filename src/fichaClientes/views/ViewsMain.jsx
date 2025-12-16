import { useEffect }                from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { Button, Grid, TextField, Typography } from '@mui/material';

export const views = () => {

  return (
    <Grid container direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: { xs: 0.5, sm: 1 } }}>
        <Grid item xs={12}>
            <Typography fontSize={{ xs: 24, sm: 32, md: 39 }} fontWeight='light'>28 de agosto, 2023</Typography>
        </Grid>
        {/*<Grid item xs={12} sm="auto">
            <Button
              color="primary"
              sx={{
                padding: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.875rem", sm: "1rem" }
              }}
              fullWidth={{ xs: true, sm: false }}
            >
                <SaveOutlined sx={{ fontSize: { xs: 24, sm: 28, md: 30 }, mr: 1 }} />
                Guardar
            </Button>
        </Grid>*/}

        <Grid container spacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12}>
                <TextField
                    type="text"
                    variant="filled"
                    fullWidth
                    placeholder="Ingrese un título"
                    label="Título"
                    sx={{
                      border: 'none',
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    type="text"
                    variant="filled"
                    fullWidth
                    multiline
                    placeholder="¿Qué sucedió en el día de hoy?"
                    minRows={{ xs: 3, sm: 4, md: 5 }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                />
            </Grid>
        </Grid>

        {/* Image gallery */}

    </Grid>
  )
}
