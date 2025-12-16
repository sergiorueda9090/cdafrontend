import React, {useEffect} from "react";
import {
  Grid,
  Card,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useSelector, useDispatch } from "react-redux";
import { getAllThunks } from '../../store/balancegeneralStore/balancegeneralStoreThunks';


export function CardClientes() {
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllThunks());
    },[])
    
    let { totalSaldoClientes, clientes } = useSelector(state => state.balancegeneralStore);

  return (
    <Grid item xs={12}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
          backgroundColor: "#d2b0f5ff",
          height: "100%"
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <AttachMoneyIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: "#0088fe" }} />
        </Box>

        {/* TOTAL GENERAL */}
        <Box mt={{ xs: 1, sm: 2 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Total saldo clientes
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
          >
            ${new Intl.NumberFormat("es-CO").format(totalSaldoClientes)}
          </Typography>
        </Box>

        {/* LISTADO DE CLIENTES */}
        <Box mt={{ xs: 1, sm: 2 }}>
          <Box sx={{ maxHeight: { xs: 150, sm: 180, md: 200 }, overflowY: "auto" }}>
            <List dense>
              {clientes.map((cliente, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: { xs: 0.5, sm: 1 }
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <ListItemText
                      primary={cliente.nombre}
                      primaryTypographyProps={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    ${new Intl.NumberFormat("es-CO").format(cliente.valor)}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
}
