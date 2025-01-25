import React, { useEffect, useState } from 'react';
import { Grid, TextField, FormControl, Autocomplete, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk } from '../../store/clientesStore/clientesThunks';
import { updateThunks } from '../../store/tramitesStore/tramitesThunks';

export const EtapaTres = () => {
  const dispatch = useDispatch();

  // Obtener los precios de ley y el idCliente desde el store
  const { preciosLey } = useSelector((state) => state.clientesStore);
  const { id, idCliente, precioDeLey, comisionPrecioLey, total, estado } = useSelector((state) => state.tramitesStore);

  // Estados locales para manejar los valores seleccionados
  const [precioLey, setPrecioLey] = useState(precioDeLey); // Precio de ley seleccionado
  const [comision, setComision] = useState(comisionPrecioLey); // Comisión manual
  const [totalComision, setTotalComision] = useState(total); // Total calculado
  const [errors, setErrors] = useState({}); // Estado para errores de validación

  console.log("precioLey ",precioLey)
  // Cargar los precios de ley cuando se monte el componente
  useEffect(() => {
    if (idCliente) {
      dispatch(showThunk(idCliente));
      setPrecioLey(precioDeLey)
    }
  }, [dispatch, idCliente]);

  // Manejar selección del precio de ley
  const handlePrecioLeyChange = (event, value) => {
    if (value) {
      setPrecioLey(value.precio_ley);
      setComision(value.comision);
      setTotalComision(parseFloat(value.precio_ley) + parseFloat(value.comision));
      setErrors((prevErrors) => ({ ...prevErrors, precioLey: undefined })); // Limpiar error
    } else {
      setPrecioLey("");
      setComision("");
      setTotalComision(0);
    }
  };

  // Manejar cambios en la comisión manual
  const handleComisionChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Solo permitir números
    setComision(value);

    const precio = parseFloat(precioLey) || 0;
    const comisionValue = parseFloat(value) || 0;
    setTotalComision(precio + comisionValue);

    setErrors((prevErrors) => ({ ...prevErrors, comision: undefined })); // Limpiar error
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos requeridos
    const newErrors = {};
    if (!precioLey) newErrors.precioLey = "El precio de ley es obligatorio.";
    if (!comision) newErrors.comision = "La comisión es obligatoria.";
    if (!totalComision || totalComision <= 0) newErrors.totalComision = "El total debe ser mayor a 0.";

    setErrors(newErrors);

    // Si no hay errores, enviar los datos al backend
    if (Object.keys(newErrors).length === 0) {

      const formData = {
        id:id,
        precioDeLey: precioLey,
        comisionPrecioLey: comision,
        total: totalComision,
        estado: 'Ejecución'
      };

      dispatch(updateThunks(formData));

      console.log("Formulario enviado:", formData);
      // Aquí podrías despachar una acción de Redux o hacer una petición HTTP al backend
    }
  };
  console.log("preciosLey ",preciosLey)
  console.log("precioLey ",precioLey)
  
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Precio de ley */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options = {preciosLey}
              value = {precioLey}
              getOptionLabel={(option) => option.precio_ley}
              onChange={handlePrecioLeyChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Precio de Ley"
                  placeholder="Seleccione un precio de ley"
                  error={!!errors.precioLey}
                  helperText={errors.precioLey}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Comisión */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="💵 Comisión"
            variant="outlined"
            value={parseFloat(comision).toLocaleString('es-CO')}
            onChange={handleComisionChange}
            placeholder="Ingrese la comisión manual"
            error={!!errors.comision}
            helperText={errors.comision}
            disabled
          />
        </Grid>

        {/* Total */}
        <Grid item xs={12}>
          <Typography variant="h6">
            🧾 Total: {totalComision.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
          </Typography>
          {errors.totalComision && <Typography color="error">{errors.totalComision}</Typography>}
        </Grid>

        {/* Botón de guardar */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth type="submit">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
