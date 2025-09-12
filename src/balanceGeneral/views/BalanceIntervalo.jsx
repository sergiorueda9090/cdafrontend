import { Grid, Typography, Paper  } from "@mui/material";
import { useSelector, useDispatch }   from "react-redux";

export const BalanceIntervalo = () => {

    let { patrimonioBruto, patrimonioNeto, utilidadnominal, utilidadreal, totaldiferencia }    = useSelector(state => state.balancegeneralStore);

    return (
        <>
            <Grid item xs={4}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        maxWidth: 600, 
                        mx: 'auto', 
                        backgroundColor: '#bbdefb', 
                        borderRadius: 2, 
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography variant="subtitle1" align="center" color="textSecondary">
                        Patrimonio Bruto
                    </Typography>
                    <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(patrimonioBruto)}
                    </Typography>
                    </Paper>
            </Grid>

            <Grid item xs={4}>
                <Paper 
                elevation={3} 
                sx={{ 
                    p: 2, 
                    mb: 3, 
                    maxWidth: 600, 
                    mx: 'auto', 
                    backgroundColor: '#c8e6c9', 
                    borderRadius: 2, 
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                }}
                >
                <Typography variant="subtitle1" align="center" color="textSecondary">
                    Patrimonio Neto
                </Typography>
                <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(patrimonioNeto)}
                </Typography>
                </Paper>
            </Grid>

            <Grid item xs={4}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        maxWidth: 600, 
                        mx: 'auto', 
                        backgroundColor: '#ffe0b2', 
                        borderRadius: 2, 
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography variant="subtitle1" align="center" color="textSecondary">
                        Utilidad Nominal
                    </Typography>
                    <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(utilidadnominal)}
                    </Typography>
                </Paper>
            </Grid>


            <Grid item xs={6}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        maxWidth: 600, 
                        mx: 'auto', 
                        backgroundColor: '#dcedc8', 
                        borderRadius: 2, 
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography variant="subtitle1" align="center" color="textSecondary">
                        Utilidad Real
                    </Typography>
                    <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(utilidadreal)}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={6}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                    p: 2, 
                    mb: 3, 
                    maxWidth: 600, 
                    mx: 'auto', 
                    backgroundColor: '#ffcdd2', 
                    borderRadius: 2, 
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                >
                    <Typography variant="subtitle1" align="center" color="textSecondary">
                    Diferencia Utilidad Real - Utilidad Diferencial
                    </Typography>
                    <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: totaldiferencia < 0 ? "red" : "green"
                    }}
                    >
                    {new Intl.NumberFormat("es-CO", { 
                        style: "currency", 
                        currency: "COP" 
                    }).format(totaldiferencia)}
                    </Typography>
                </Paper>
            </Grid>
        </>
    )

}