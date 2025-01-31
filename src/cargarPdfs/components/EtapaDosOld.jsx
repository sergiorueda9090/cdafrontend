import React, { useState } from 'react';
import { Grid, TextField, Autocomplete, FormControl, RadioGroup, FormControlLabel, Radio, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { createThunks, updateThunks } from '../../store/tramitesStore/tramitesThunks';

export const EtapaDos = () => {
  const dispatch = useDispatch();

  // Obtener datos iniciales del estado global
  const { etiquetaUno, etiquetaDos, linkPago, pagoInmediato, etiquetaUnoArray, etiquetaDosArray, id, estado } = useSelector((state) => state.tramitesStore);

  // Estados locales para los valores del formulario
  const [formValues, setFormValues] = useState({ etiquetaUno, etiquetaDos, linkPago, pagoInmediato, estado:'Validación' });
  const [errors, setErrors] = useState({});

  // Manejar cambios en los campos de texto y radio
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ 
                    ...formValues, 
                    [name]: value,  
                    ['estado']: 'Validación', 
                  });
  };  


  // Manejar cambios en los campos de selección
  const handleAutocompleteChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    if (name === 'etiquetaDos' && value !== 'LINK DE PAGO') {
      setFormValues((prev) => ({ ...prev, linkPago: '', pagoInmediato: 'si' })); // Reinicia si cambia la opción
    }
  };

  // Validar y manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validaciones
    if (!formValues.etiquetaUno) newErrors.etiquetaUno = 'Seleccione una opción para Etiqueta Uno.';
    if (!formValues.etiquetaDos) newErrors.etiquetaDos = 'Seleccione una opción para Etiqueta Dos.';

    // Validar link de pago si "LINK DE PAGO" está seleccionado
    if (formValues.etiquetaDos === 'LINK DE PAGO') {
      if (formValues.pagoInmediato === 'no' && !formValues.linkPago) {
        newErrors.linkPago = 'Debe ingresar un link si selecciona NO en Pago inmediato.';
      }
    }

    setErrors(newErrors);

    // Si no hay errores, procesar el formulario
    if (Object.keys(newErrors).length === 0) {
       
        console.log("formValues ",formValues)
      if (etiquetaUno) {
        // Si existe un ID, actualizar el trámite
        dispatch(updateThunks({ id, ...formValues }));
      } else {
        // Si no hay ID, crear un nuevo trámite
        dispatch(updateThunks({ id, ...formValues }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Seleccionar Etiqueta Uno */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options={etiquetaUnoArray}
              value={formValues.etiquetaUno}
              onChange={(e, value) => handleAutocompleteChange('etiquetaUno', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ETIQUETA UNO"
                  error={!!errors.etiquetaUno}
                  helperText={errors.etiquetaUno}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Seleccionar Etiqueta Dos */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options={etiquetaDosArray}
              value={formValues.etiquetaDos}
              onChange={(e, value) => handleAutocompleteChange('etiquetaDos', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ETIQUETA DOS"
                  error={!!errors.etiquetaDos}
                  helperText={errors.etiquetaDos}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Mostrar Link de Pago y Pago Inmediato si "LINK DE PAGO" está seleccionado */}
        {formValues.etiquetaDos === 'LINK DE PAGO' && (
          <>
            {/* Link de Pago */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">🌐 Link de Pago:</Typography>
              <TextField
                fullWidth
                name="linkPago"
                variant="outlined"
                value={formValues.linkPago}
                onChange={handleChange}
                error={!!errors.linkPago}
                helperText={errors.linkPago}
                placeholder="Ingrese el link aquí"
                disabled={formValues.pagoInmediato === 'si'} // Deshabilitar si "pagoInmediato" es "si"
              />
            </Grid>

            {/* ¿Pago inmediato? */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">💳 ¿Pago inmediato?</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="pagoInmediato"
                  value={formValues.pagoInmediato}
                  onChange={handleChange}
                >
                  <FormControlLabel value="si" control={<Radio />} label="SI (Confirmar como emitido)" />
                  <FormControlLabel value="no" control={<Radio />} label="NO (Guardar link)" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </>
        )}

        {/* Botón de guardar */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth type="submit">
            {etiquetaUno ? 'Actualizar' : 'Guardar'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
