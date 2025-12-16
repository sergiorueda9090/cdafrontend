import { Grid, Typography, Paper  } from "@mui/material";
import { useSelector, useDispatch }   from "react-redux";

export const BalanceIntervalo = () => {

    let { patrimonioBruto, patrimonioNeto, utilidadnominal, utilidadreal, totaldiferencia, gastos_totales_de_periodo }    = useSelector(state => state.balancegeneralStore);

    return (
        <>
            <Grid item xs={12} sm={6} md={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: { xs: 2, sm: 3 },
                        maxWidth: 600,
                        mx: 'auto',
                        backgroundColor: '#bbdefb',
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                        1. Patrimonio Bruto
                    </Typography>

                    <ul style={{ marginTop: "12px", paddingLeft: "20px", fontSize: "0.875rem" }}>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                             (+) Saldo actual cliente
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            (+) Saldo actual Tarjetas
                            </Typography>
                        </li>
                    </ul>
                    <Typography
                      variant="h4"
                      align="center"
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" }, mt: 1 }}
                    >
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(patrimonioBruto)}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Paper
                elevation={3}
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    mb: { xs: 2, sm: 3 },
                    maxWidth: 600,
                    mx: 'auto',
                    backgroundColor: '#c8e6c9',
                    borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                }}
                >
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                    2. Patrimonio Neto del periodo
                </Typography>
                <ul style={{ marginTop: "12px", paddingLeft: "20px", fontSize: "0.875rem" }}>
                    <li>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        (+) Patrimonio bruto
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        (-) 4*mil del periodo
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        (-) Gastos del periodo
                        </Typography>
                    </li>
                </ul>

                <Typography
                  variant="h4"
                  align="center"
                  color="primary"
                  sx={{ fontWeight: 'bold', fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" }, mt: 1 }}
                >
                    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(patrimonioNeto)}
                </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: { xs: 2, sm: 3 },
                        maxWidth: 600,
                        mx: 'auto',
                        backgroundColor: '#ffe0b2',
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                        3. Utilidad Nominal Del periodo
                    </Typography>

                    <ul style={{ marginTop: "12px", paddingLeft: "20px", fontSize: "0.875rem" }}>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            Utilidad generada en el periodo
                            </Typography>
                        </li>
                    </ul>
                    <Typography
                      variant="h4"
                      align="center"
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" }, mt: 1 }}
                    >
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(utilidadnominal)}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: { xs: 2, sm: 3 },
                        maxWidth: 600,
                        mx: 'auto',
                        backgroundColor: '#dcedc8',
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                        4. Gastos totales del periodo
                    </Typography>
                    <ul style={{ marginTop: "12px", paddingLeft: "20px", fontSize: "0.875rem" }}>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                             (-) 4xmil de periodo
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                             (-) Gastos generales del periodo
                            </Typography>
                        </li>
                    </ul>

                    <Typography
                      variant="h4"
                      align="center"
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" }, mt: 1 }}
                    >
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(gastos_totales_de_periodo)}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: { xs: 2, sm: 3 },
                        maxWidth: 600,
                        mx: 'auto',
                        backgroundColor: '#dcedc8',
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
                    }}
                    >
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                        5. Utilidad real del periodo
                    </Typography>
                    <ul style={{ marginTop: "12px", paddingLeft: "20px", fontSize: "0.875rem" }}>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                             (+) Utilidad nominal del periodo
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                             (-) Gastos totales del periodo
                            </Typography>
                        </li>
                    </ul>

                    <Typography
                      variant="h4"
                      align="center"
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" }, mt: 1 }}
                    >
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(utilidadreal)}
                    </Typography>
                </Paper>
            </Grid>

            {/*<Grid item xs={6}>
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
            </Grid>*/}
        </>
    )

}