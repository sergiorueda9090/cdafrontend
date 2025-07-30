import React, { useEffect, useState } from 'react';
import { Grid, TextField, FormControl, Autocomplete, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateThunks } from '../../store/cotizadorStore/cotizadorThunks';

export const EtapaTres = () => {

  const dispatch = useDispatch();

  // Obtener los precios de ley y el idCliente desde el store
  const { preciosLey } = useSelector((state) => state.clientesStore);
  const { id, precioDeLey, comisionPrecioLey, total } = useSelector((state) => state.cotizadorStore);

  console.log(" === preciosLey === ", preciosLey)

  // Estados locales para manejar los valores seleccionados
  const [precioLey, setPrecioLey]         = useState(precioDeLey); // Precio de ley seleccionado
  const [comision, setComision]           = useState(comisionPrecioLey); // Comisión manual
  const [totalComision, setTotalComision] = useState(total); // Total calculado
  const [errors, setErrors]               = useState({}); // Estado para errores de validación
 
  // Manejar selección del precio de ley
  const handlePrecioLeyChange = (event, value) => {
    if (value) {
      setPrecioLey(value.precio_ley);
      setComision(value.comision);
      const precioLeyNumerico = Number(value.precio_ley.replace(/\./g, '').replace(/,/g, '.'));
      const comisionNumerica = Number(value.comision.replace(/\./g, '').replace(/,/g, '.'));
      setTotalComision(precioLeyNumerico + comisionNumerica);
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
        id                : id,
        precioDeLey       : precioLey,
        comisionPrecioLey : comision,
        total             : totalComision,
        estado            : 'Ejecución'
      };

      dispatch(updateThunks(formData, 'confirmarprecio'));

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Precio de ley */}
        <Grid item xs={12}>
          <FormControl fullWidth>
          <Autocomplete
              disablePortal
              options={preciosLey}
              value={preciosLey.find((option) => option.descripcion === precioLey) || null} // Encuentra el objeto correspondiente
              onChange={handlePrecioLeyChange}
              getOptionLabel={(option) => option.descripcion || ''} // Muestra el precio de ley como texto
              renderOption={(props, option) => (
                <li {...props}>
                  {option.descripcion} {/* Si quieres mostrar más datos */}
                </li>
              )}
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
            value={comision}
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
          🧾 Total: {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalComision)}
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
