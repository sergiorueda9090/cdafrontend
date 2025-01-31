import React, { useState } from 'react';
import { Grid, TextField, MenuItem, FormControl, InputLabel, Button, Autocomplete, ButtonGroup, Alert, Box, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { createThunks, updateThunks } from '../../store/tramitesStore/tramitesThunks';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from '@mui/icons-material/Replay';
import { showThunk } from '../../store/clientesStore/clientesThunks';
import { handleFormStoreThunk } from '../../store/cotizadorStore/cotizadorThunks';

export const EtapaUno = () => {

  const dispatch = useDispatch();
  
  const { clientes } = useSelector(state => state.clientesStore);
  
  const tramites = useSelector( state => state.tramitesStore);
  
  // Estado para los campos
  const [formValues, setFormValues] = useState(tramites);
    
   // Estado para los errores
   const [errors, setErrors] = useState({});

   // Opciones para tipo de documento
   const tipoDocumentoOptions = ["Cedula", "Pasaporte", "Licencia"];

   // Lista de prefijos válidos
   const prefijos = ["319", "314", "313", "300", "301", "321", "322"];

     // Función para generar un número aleatorio
  const generarNumeroAleatorio = () => {
    const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)]; // Selecciona un prefijo aleatorio
    const numeroAleatorio = `${prefijo}${Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, "0")}`; // Genera los 7 dígitos restantes
    setFormValues((prev) => ({
      ...prev,
      telefono: numeroAleatorio,
    }));
  };

    // Función para generar una dirección ficticia
    const generarDireccionAleatoria = () => {
      const calles = ["Calle", "Carrera", "Diagonal", "Transversal"];
      const letras = ["A", "B", "C", "D", "E"];
      const numeros = Math.floor(Math.random() * 100) + 1; // Número de calle/carrera
      const letra = letras[Math.floor(Math.random() * letras.length)];
      const complemento = Math.floor(Math.random() * 100); // Número de complemento
      const direccionAleatoria = `${calles[Math.floor(Math.random() * calles.length)]} ${numeros}${letra} # ${complemento} - ${Math.floor(
        Math.random() * 100
      )}`;
      setFormValues((prev) => ({
        ...prev,
        direccion: direccionAleatoria,
      }));
    };

    // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk(e.target));
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  /* =======================================================
     ================== PRECIO DE LEY ======================
     ======================================================= */
  const { precioDeLey, comisionPrecioLey, total, etiquetaDosArray } = useSelector((state) => state.tramitesStore);

  // Obtener los precios de ley y el idCliente desde el store
  const { preciosLey } = useSelector((state) => state.clientesStore);

  // Estados locales para manejar los valores seleccionados
  const [precioLey, setPrecioLey]         = useState(precioDeLey); // Precio de ley seleccionado
  const [comision, setComision]           = useState(comisionPrecioLey); // Comisión manual
  const [totalComision, setTotalComision] = useState(total); // Total calculado

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
  /* =======================================================
     ================== END PRECIO DE LEY ==================
     ======================================================= */

  /* =======================================================
     ================== ETIQUETA DOS ======================
     ======================================================= */
    const handleAutocompleteChange = (name, value) => {
      setFormValues({ ...formValues, [name]: value });
    }
  /* =====================================================
    ================== END ETIQUETA DOS ===================
    ======================================================= */

  /* =======================================================
     ================== SOATAlert ======================
     ======================================================= */
      const handleCopy = () => {
        const text = `Hola, el seguro (SOAT) para el vehículo ${formValues.placa} tiene un costo de ${new Intl.NumberFormat(
          "es-CO",
          { style: "currency", currency: "COP" }
        ).format(precioLey)} + una comisión por gestión de ${new Intl.NumberFormat(
          "es-CO",
          { style: "currency", currency: "COP" }
        ).format(comision)}, para un total a consignar de ${new Intl.NumberFormat(
          "es-CO",
          { style: "currency", currency: "COP" }
        ).format(totalComision)}`;
      };
     /* =======================================================
     ================== end SOATAlert ======================
     ======================================================= */
     const handlePriceClieen = (value) => {
      dispatch(showThunk(value.value))
      setFormValues((prevValues) => ({
        ...prevValues,
        idCliente: value ? value.value : "",
      }));
    };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const currentYear = new Date().getFullYear(); // Año actual
    const nextYear = currentYear + 1; // Año máximo permitido
  
    // Validar campos requeridos
    const newErrors = {};
    if (!formValues.idCliente) newErrors.idCliente = "Debe seleccionar un cliente.";
    if (!formValues.placa) newErrors.placa = "Este campo es obligatorio.";
    if (!formValues.cilindraje) newErrors.cilindraje = "Este campo es obligatorio.";
    
    // Validar el campo modelo
    if (!formValues.modelo) {
      newErrors.modelo = "Este campo es obligatorio.";
    } else if (isNaN(formValues.modelo)) {
      newErrors.modelo = "El modelo debe ser un año válido.";
    } else if (formValues.modelo > nextYear) {
      // Restringir años mayores al siguiente año
      newErrors.modelo = `El modelo no puede ser mayor a ${nextYear}.`;
    }
  
    if (!formValues.chasis) newErrors.chasis = "Este campo es obligatorio.";
    if (!formValues.tipoDocumento) newErrors.tipoDocumento = "Este campo es obligatorio.";
    if (!formValues.numeroDocumento) newErrors.numeroDocumento = "Este campo es obligatorio.";
    if (!formValues.nombreCompleto) newErrors.nombreCompleto = "Este campo es obligatorio.";
  
    if (!formValues.nombreCompleto) newErrors.nombreCompleto = "Este campo es obligatorio.";

    if (!precioLey) newErrors.precioLey = "El precio de ley es obligatorio.";
    if (!comision) newErrors.comision = "La comisión es obligatoria.";
    if (!totalComision || totalComision <= 0) newErrors.totalComision = "El total debe ser mayor a 0.";

    if (!formValues.etiquetaDos) newErrors.etiquetaDos = 'Seleccione una opción para Etiqueta Dos.';

    setErrors(newErrors);
  
    // Si no hay errores, procede con la lógica de guardado
    if (Object.keys(newErrors).length === 0) {
      // Aquí puedes enviar los datos al backend o realizar alguna acción
      if (formValues.id) {
        // Actualizar trámite existente
        dispatch(updateThunks(formValues));
      } else {
        // Crear nuevo trámite
        dispatch(createThunks(formValues));
      }
    }
  };


    return (
      <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Seleccionar cliente */}
    
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
                disablePortal
                options={clientes}
                getOptionLabel={(option) => option.label || ""}
                onChange={(e, value) => handlePriceClieen(value)}
                value={
                  clientes.find((cliente) => cliente.value === formValues.idCliente) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Clientes"
                    error={!!errors.idCliente}
                    helperText={errors.idCliente}
                  />
                )}
              />
          </FormControl>
        </Grid>

        {/* Precio de ley */}
        <Grid item xs={4}>
          <FormControl fullWidth>
          <Autocomplete
              disablePortal
              options={preciosLey}
              value={preciosLey.find((option) => option.precio_ley === precioLey) || null} // Encuentra el objeto correspondiente
              onChange={handlePrecioLeyChange}
              getOptionLabel={(option) => option.precio_ley || ''} // Muestra el precio de ley como texto
              renderOption={(props, option) => (
                <li {...props}>
                  {option.precio_ley} {/* Si quieres mostrar más datos */}
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
        <Grid item xs={4}>
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

        {/* Seleccionar Etiqueta Dos */}
        <Grid item xs={4}>
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

        {/* Placa */}
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="🚗 Placa (Clave Única)"
            name="placa"
            variant="outlined"
            value={formValues.placa.toUpperCase()}
            onChange={handleChange}
            error={!!errors.placa}
            helperText={errors.placa}
          />
        </Grid>

        {/* Cilindraje */}
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="🔧 Cilindraje"
            name="cilindraje"
            variant="outlined"
            value={formValues.cilindraje}
            onChange={handleChange}
            error={!!errors.cilindraje}
            helperText={errors.cilindraje}
          />
        </Grid>

        {/* Modelo */}
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="📅 Modelo"
            name="modelo"
            variant="outlined"
            value={formValues.modelo}
            onChange={handleChange}
            error={!!errors.modelo}
            helperText={errors.modelo}
          />
        </Grid>

        {/* Chasis */}
        <Grid item xs={3}>
            <TextField
              fullWidth
              label="🔩 Chasis (Máximo 17 caracteres)"
              name="chasis"
              variant="outlined"
              inputProps={{ maxLength: 17 }}
              value={formValues.chasis}
              onChange={handleChange}
              error={!!errors.chasis}
              helperText={errors.chasis}
            />
        </Grid>

        {/* Tipo de documento */}
        <Grid item xs={6}>
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={tipoDocumentoOptions}
                value={formValues.tipoDocumento} // Establecer valor por defecto
                onChange={(e, value) =>
                  setFormValues({ ...formValues, tipoDocumento: value || "" })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de documento"
                    error={!!errors.tipoDocumento}
                    helperText={errors.tipoDocumento}
                  />
                )}
              />
            </FormControl>
        </Grid>

        {/* Número de documento */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="👤 Número de documento"
            name="numeroDocumento"
            variant="outlined"
            value={formValues.numeroDocumento}
            onChange={handleChange}
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento}
          />
        </Grid>

        {/* Nombre completo */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="👤 Nombre completo"
            name="nombreCompleto"
            variant="outlined"
            value={formValues.nombreCompleto.toUpperCase()}
            onChange={handleChange}
            error={!!errors.nombreCompleto}
            helperText={errors.nombreCompleto}
          />
        </Grid>

        {/* Teléfono */}
        <Grid item xs={6}>
          <div style={{ display: "flex", width: "100%", gap: "10px" }}>
            <TextField
              fullWidth
              label="📞 Teléfono"
              name="telefono"
              variant="outlined"
              value={formValues.telefono}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generarNumeroAleatorio}
            >
              <ReplayIcon />
            </Button>
          </div>
        </Grid>

        {/* Correo */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="📧 Correo"
            name="correo"
            variant="outlined"
            value={formValues.correo}
            onChange={handleChange}
          />
        </Grid>

        {/* Dirección */}
        <Grid item xs={6}>
          <div style={{ display: "flex", width: "100%", gap: "10px" }}>
            <TextField
              fullWidth
              label="🏠 Dirección"
              name="direccion"
              variant="outlined"
              value={formValues.direccion}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generarDireccionAleatoria}
            >
              <ReplayIcon />
            </Button>
          </div>
        </Grid>

        {/* Botón de guardar */}
        <Grid item xs={12}>
            <Alert severity="success" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                {`Hola, el seguro (SOAT) para el vehículo `}
                <b>{formValues.placa}</b>
                {` tiene un costo de `}
                <b>{precioLey}</b>
                {` + una comisión por gestión de `}
                <b>{comision}</b>
                {`, para un total a consignar de `}
                <b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(totalComision)}</b>.
              <IconButton color="inherit" onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Alert>
        </Grid>

        <Grid item xs={6}>
          {
            formValues.id != "" ? (<Button variant="contained" color="primary" fullWidth type="submit">Editar</Button>) : (<Button variant="contained" color="primary" fullWidth type="submit">Guardar</Button>)
          }
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="warning" fullWidth type="submit">PASAR A EMISION</Button>
        </Grid>
      </Grid>
    </form>
    );
  };