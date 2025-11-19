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
          p: 2,
          backgroundColor: "#d2b0f5ff",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <AttachMoneyIcon sx={{ fontSize: 40, color: "#0088fe" }} />
        </Box>

        {/* TOTAL GENERAL */}
        <Box mt={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Total saldo clientes
          </Typography>
          <Typography variant="h3">
            $
            {new Intl.NumberFormat("es-CO").format(totalSaldoClientes)}
          </Typography>
        </Box>

        {/* LISTADO DE CLIENTES */}
        <Box>
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            <List dense>
              {clientes.map((cliente, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <ListItemText primary={cliente.nombre} />
                  </Box>

                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    $
                    {new Intl.NumberFormat("es-CO").format(cliente.valor)}
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
