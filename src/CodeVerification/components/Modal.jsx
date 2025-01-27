import React, { useEffect, useRef,useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { closeModalShared } from '../../store/globalStore/globalStore';
import { createThunks, updateThunks }     from '../../store/clientesStore/clientesThunks';

export const FormDialogUser = () => {
  const dispatch = useDispatch();

  const { openModalStore } = useSelector((state) => state.globalStore);
  const clientesStore = useSelector((state) => state.clientesStore);

  const [formValues, setFormValues] = useState({
    nombre: "",
    preciosLey: [],
  });
  const [preciosLey, setPreciosLey] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValues(clientesStore);
    setPreciosLey(clientesStore?.preciosLey || []);
  }, [clientesStore]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Formateador de moneda
  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.replace(/\./g, ""); // Elimina puntos
    return new Intl.NumberFormat("es-CO").format(number); // Formatea como moneda colombiana
  };

  const handlePrecioLeyChange = (index, field, value) => {
    const formattedValue = field !== "descripcion" ? formatCurrency(value) : value;
    const updatedPreciosLey = preciosLey.map((precio, i) =>
      i === index ? { ...precio, [field]: formattedValue } : precio
    );
    setPreciosLey(updatedPreciosLey);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPrecioLey = () => {
    setPreciosLey([...preciosLey, { descripcion: "", precio_ley: "", comision: "" }]);
  };

  const removePrecioLey = (index) => {
    setPreciosLey(preciosLey.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = { ...formValues, preciosLey };
    if (!formValues.id) {
      const dataSend = {
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        direccion: payload.direccion,
        telefono: payload.telefono,
        precios_ley: JSON.stringify(payload.preciosLey),
      };
      dispatch(createThunks(dataSend));
    } else {
      const dataSend = {
        id: payload.id,
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        direccion: payload.direccion,
        telefono: payload.telefono,
        precios_ley: JSON.stringify(payload.preciosLey),
      };
      dispatch(updateThunks(dataSend));
    }
    dispatch(closeModalShared());
  };

  const handleClose = () => {
    dispatch(closeModalShared());
  };

  return (
    <Dialog open={openModalStore} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>{formValues.id ? "Editar Cliente" : "Crear Cliente"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del cliente y agrega sus precios de ley si es necesario.
          </DialogContentText>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="nombre"
                label="👤 Nombre"
                value={formValues.nombre}
                onChange={handleInputChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="apellidos"
                label="👤 Apellidos"
                value={formValues.apellidos}
                onChange={handleInputChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="telefono"
                label="📞 Teléfono"
                value={formValues.telefono}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="direccion"
                label="🏠 Dirección"
                value={formValues.direccion}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={addPrecioLey}>
                Agregar Precio de Ley
              </Button>
            </Grid>
            {preciosLey.map((precio, index) => (
              <Grid container spacing={2} key={index} sx={{ marginTop: 1 }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="📝 Descripción"
                    value={precio.descripcion}
                    onChange={(e) =>
                      handlePrecioLeyChange(index, "descripcion", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="💰 Precio de Ley"
                    value={precio.precio_ley}
                    onChange={(e) =>
                      handlePrecioLeyChange(index, "precio_ley", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="📊 Comisión"
                    value={precio.comision}
                    onChange={(e) =>
                      handlePrecioLeyChange(index, "comision", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removePrecioLey(index)}
                  >
                    Eliminar
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {formValues.id ? "Editar Cliente" : "Crear Cliente"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};