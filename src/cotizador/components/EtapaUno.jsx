import React, { useState } from 'react';
import { Grid, TextField, MenuItem, FormControl, InputLabel, Button, Autocomplete, ButtonGroup, Alert, Box, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { showThunk }                                        from '../../store/clientesStore/clientesThunks';
import { createThunks, updateThunks, handleFormStoreThunk, getAllThunks } from '../../store/cotizadorStore/cotizadorThunks';
import { closeModalShared } from '../../store/globalStore/globalStore';
import ContentCopyIcon  from "@mui/icons-material/ContentCopy";
import ReplayIcon       from '@mui/icons-material/Replay';
import { UsersSelect } from '../../users/components/UsersSelect';
import { useNavigate }  from 'react-router-dom';

export const EtapaUno = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Obtener valores del store
  const formValues = useSelector((state) => state.cotizadorStore);

  const { id, idCliente, precioDeLey, comisionPrecioLey, etiquetaDosArray, idEtiqueta, etiquetaDos, placa, cilindraje,modelo, chasis, 
          telefono,nombreCompleto,numeroDocumento,tipoDocumento,correo, direccion, total, dateFilter, disableBtn } = formValues;
  
  const { clientes }    = useSelector(state => state.clientesStore);
  const { preciosLey }  = useSelector((state) => state.clientesStore);
  const { etiquetas }   = useSelector((state)  => state.etiquetasStore);
    
  console.log("preciosLey ",preciosLey);

  const tipoDocumentoOptions    = ['Cedula', 'Pasaporte', 'Tarjeta de Identidad', 'Número de Identificación Tributaria', 'Cédula de Extranjería', 'Permiso por Protección Temporal'];
  const prefijos                = ['319', '314', '313', '300', '301', '321', '322'];
  const etiquetaDosCondiciones  = ["LINK DE PAGO","AMALFI","AURA","CENTRO",]

  // Estado para los errores
  const [errors, setErrors]       = useState({});

  const handlePriceClieen = (value) => {
    dispatch(showThunk(value.value))
    dispatch(handleFormStoreThunk({ name: 'idCliente', value:value.value }));
  };

  const validarEntrada = (valor, tipo) => {
    let nuevoValor = valor
      .replace(/[`!\[\]]/g, "") // Elimina acento grave, exclamación, punto y corchetes
      .replace(/^\s+/, ""); // Elimina espacios iniciales
    
    if (tipo === "placa") {
      nuevoValor = nuevoValor.replace(/\s+/g, ""); // Elimina todos los espacios
    }
    
    return nuevoValor;
  };

  // Generar número aleatorio
  const generarNumeroAleatorio = () => {
    const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
    const numeroAleatorio = `${prefijo}${Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, '0')}`;
    dispatch(handleFormStoreThunk({ name: 'telefono', value: numeroAleatorio }));
  };

  // Generar dirección aleatoria
  const generarDireccionAleatoria = () => {
    const calles = ['Calle', 'Carrera', 'Diagonal', 'Transversal'];
    const letras = ['A', 'B', 'C', 'D', 'E'];
    const numeros = Math.floor(Math.random() * 100) + 1;
    const letra = letras[Math.floor(Math.random() * letras.length)];
    const complemento = Math.floor(Math.random() * 100);
    const direccionAleatoria = `${calles[Math.floor(Math.random() * calles.length)]} ${numeros}${letra} # ${complemento} - ${Math.floor(
      Math.random() * 100
    )}`;
    dispatch(handleFormStoreThunk({ name: 'direccion', value: direccionAleatoria }));
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    //dispatch(handleFormStoreThunk({ name, value }));
    dispatch(handleFormStoreThunk({ name, value: validarEntrada(value, name) }));
  };

  // Manejar selección de clientes
  const handleTypeDocumentChange = (value) => {
    dispatch(handleFormStoreThunk({ name: 'tipoDocumento', value: value}));
  };

  const handleEtiquetaDosChange = (value) => {
    dispatch(handleFormStoreThunk({ name: 'etiquetaDos',  value: value.nombre}));
    dispatch(handleFormStoreThunk({ name: 'idEtiqueta',   value: value.id}));
  };

  // Manejar selección de precios de ley
  const handlePrecioLeyChange = (e, value) => {
    if (value) {
      dispatch(handleFormStoreThunk({ name: 'precioDeLey',        value: value.precio_ley }));
      dispatch(handleFormStoreThunk({ name: 'comisionPrecioLey',  value: value.comision }));
      const precioLeyNumerico = Number(value.precio_ley.replace(/\./g, '').replace(/,/g, '.'));
      const comisionNumerica = Number(value.comision.replace(/\./g, '').replace(/,/g, '.'));
      const total = precioLeyNumerico + comisionNumerica;
      dispatch(handleFormStoreThunk({ name: 'total', value: total}));
    } else {
      dispatch(handleFormStoreThunk({ name: 'precioDeLey', value: '' }));
      dispatch(handleFormStoreThunk({ name: 'comisionPrecioLey', value: '' }));
      dispatch(handleFormStoreThunk({ name: 'total', value: '0' }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const currentYear = new Date().getFullYear(); // Año actual
    const nextYear = currentYear + 1; // Año máximo permitido
  
    // Validar campos requeridos
    const newErrors = {};
    if (!idCliente)   newErrors.idCliente   = "Debe seleccionar un cliente.";
    if (!placa)       newErrors.placa       = "Este campo es obligatorio.";
    if (!cilindraje) {
      newErrors.cilindraje = "Este campo es obligatorio.";
    } else if (isNaN(cilindraje)) {
      newErrors.cilindraje = "El cilindraje debe ser un número válido.";
    } else if (cilindraje < 80) {
      newErrors.cilindraje = "El cilindraje no puede ser menor a 80 cc.";
    } else if (cilindraje > 22000) {
      newErrors.cilindraje = "El cilindraje no puede ser mayor a 22.000 cc.";
    }
    
    // Validar el campo modelo
    if (!modelo) {
      newErrors.modelo = "Este campo es obligatorio.";
    } else if (isNaN(modelo)) {
      newErrors.modelo = "El modelo debe ser un año válido.";
    } else if (modelo < 1960) {
      newErrors.modelo = "El modelo no puede ser menor a 1960.";
    } else if (modelo > nextYear) {
      newErrors.modelo = `El modelo no puede ser mayor a ${nextYear}.`;
    }
  
    if (!chasis) {
      newErrors.chasis = "Este campo es obligatorio.";
    } else {
      const chasisUpper = chasis.toUpperCase();  // ✅ NO reasigna const original

      const alfanumericoRegex = /^[A-Z0-9]+$/;
      if (!alfanumericoRegex.test(chasisUpper)) {
        newErrors.chasis = "El chasis solo puede contener letras o números (sin espacios ni símbolos).";
      }
    }

    if (!tipoDocumento) newErrors.tipoDocumento = "Este campo es obligatorio.";
    if (!numeroDocumento) {
      newErrors.numeroDocumento = "Este campo es obligatorio.";
    } else if (numeroDocumento.length < 5) {
      newErrors.numeroDocumento = "El documento debe tener al menos 5 caracteres.";
    }
    if (!nombreCompleto) newErrors.nombreCompleto = "Este campo es obligatorio.";
  
    if (!nombreCompleto) newErrors.nombreCompleto = "Este campo es obligatorio.";

    //if (!precioDeLey) newErrors.precioDeLey = "El precio de ley es obligatorio.";
    //if (!comisionPrecioLey) newErrors.comisionPrecioLey = "La comisión es obligatoria.";
    //if (!total || total <= 0) newErrors.total = "El total debe ser mayor a 0.";

    if (!etiquetaDos) newErrors.etiquetaDos = 'Seleccione una opción para Etiqueta Dos.';

    setErrors(newErrors);
  
    // Si no hay errores, procede con la lógica de guardado
    if (Object.keys(newErrors).length === 0) {
      // Aquí puedes enviar los datos al backend o realizar alguna acción
      if (id) {
        // Actualizar trámite existente
        dispatch(updateThunks(formValues, "cotizador"));
      } else {
        // Crear nuevo trámite
        dispatch(createThunks(formValues));
      }
    }
  };


    const handleCopy = () => {
      const texto = `Hola, el seguro (SOAT) para el vehículo ${placa} tiene un costo de ${precioDeLey} + una comisión por gestión de ${comisionPrecioLey}, para un total a consignar de ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(total)}.`;
  
      navigator.clipboard.writeText(texto)
        .then(() => {
          //alert("Texto copiado al portapapeles");
        })
        .catch(err => {
          console.error("Error al copiar el texto: ", err);
        });
    };

    const [showSelectUser, setShowSelectUser] = useState(false);

    const handleShowUserSelect = () => {

        if(id){

          let data = {id, cotizadorModulo:0, tramiteModulo:1, confirmacionPreciosModulo:0, pdfsModulo:0}
          
          dispatch(updateThunks(data, "cotizador"));

        }else{

            let data = { 
                          idCliente, 
                          precioDeLey, 
                          comisionPrecioLey, 
                          etiquetaDos,
                          idEtiqueta,
                          placa, 
                          cilindraje,
                          modelo, 
                          chasis, 
                          telefono, 
                          nombreCompleto,
                          numeroDocumento,
                          tipoDocumento,
                          correo, 
                          direccion,
                          total,
                          cotizadorModulo:0,
                          tramiteModulo:1,
                          confirmacionPreciosModulo:0,
                          pdfsModulo:0,
            }
            
            dispatch(createThunks(data, "cotizador"));
        
        }

        //dispatch(getAllThunks())
        //navigate(`/tramites`);
    
      }

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
                    clientes.find((cliente) => cliente.value === idCliente) || null
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
                value={preciosLey.find((option) => option.precio_ley === precioDeLey) || null} // Encuentra el objeto correspondiente
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
                    label="Descripción"
                    placeholder="Seleccione Descripción"
                    error={!!errors.precioDeLey}
                    helperText={errors.precioDeLey}
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
              name="comisionPrecioLey"
              value={comisionPrecioLey}
              onChange={handleChange}
              placeholder="Ingrese la comisión manual"
              disabled
              error={!!errors.comisionPrecioLey}
              helperText={errors.comisionPrecioLey}
            />
          </Grid>
          
          {/* Seleccionar Etiqueta Dos */}
          <Grid item xs={4}>
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={etiquetas}
                value={etiquetas.find(e => e.id === idEtiqueta) || null} // Asegura que el valor seleccionado sea un objeto
                onChange={(event, value) => handleEtiquetaDosChange(value)} // Solo enviamos el nombre
                getOptionLabel={(option) => option.nombre} // Muestra solo el nombre en la lista
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ETIQUETA"
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
              value={placa.trimStart().toUpperCase()}
              onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              onChange={handleChange}
              error={!!errors.placa}
              helperText={errors.placa}
              autoComplete="off"
            />
          </Grid>
  
          {/* Cilindraje */}
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="🔧 Cilindraje"
              name="cilindraje"
              variant="outlined"
              value={cilindraje.trimStart()}
              onChange={handleChange}
              error={!!errors.cilindraje}
              helperText={errors.cilindraje}
              type='number'
              autoComplete="off"
            />
          </Grid>

          
          {/* Modelo */}
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="📅 Modelo"
              name="modelo"
              variant="outlined"
              value={modelo.trimStart()}
              onChange={handleChange}
              error={!!errors.modelo}
              helperText={errors.modelo}
              type='number'
              autoComplete="off"
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
                value={chasis.trimStart()}
                onChange={handleChange}
                error={!!errors.chasis}
                helperText={errors.chasis}
                autoComplete="off"
              />
          </Grid>

          {/* Tipo de documento */}
          <Grid item xs={6}>
            <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  options={tipoDocumentoOptions}
                  value={tipoDocumento} // Establecer el valor seleccionado del store
                  onChange={(event, value) => handleTypeDocumentChange(value)} // Pasar el valor seleccionado
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
              value={numeroDocumento.trimStart()}
              onChange={handleChange}
              error={!!errors.numeroDocumento}
              helperText={errors.numeroDocumento}
              autoComplete="off"
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          {/* Nombre completo */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="👤 Nombre completo"
              name="nombreCompleto"
              variant="outlined"
              value={nombreCompleto.trimStart().toUpperCase()}
              onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              onChange={handleChange}
              error={!!errors.nombreCompleto}
              helperText={errors.nombreCompleto}
              autoComplete="off"
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
                value={telefono.trimStart()}
                onChange={handleChange}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
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
              value={correo.trimStart()}
              onChange={handleChange}
              autoComplete="off"
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
                value={direccion}
                onChange={handleChange}
                autoComplete="off"
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

        <Grid item xs={12}>
            <Alert severity="success" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                {`Hola, el seguro (SOAT) para el vehículo `}
                <b>{placa}</b>
                {` tiene un costo de `}
                <b>{precioDeLey}</b>
                {` + una comisión por gestión de `}
                <b>{comisionPrecioLey}</b>
                {`, para un total a consignar de `}
                <b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(total)}</b>.
              <IconButton color="inherit" onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Alert>
        </Grid>
            <Grid item xs={12}>
              {
                formValues.id != "" ? (<Button disabled={dateFilter} variant="contained" color="primary" fullWidth type="submit">Editar</Button>) : (<Button variant="contained" color="primary" fullWidth type="submit">Guardar</Button>)
              }
            </Grid>
            {/*<Grid item xs={6}>
              <Button disabled={!disableBtn} variant="contained" color="warning" fullWidth type="button" onClick={handleShowUserSelect}>PASAR A EMISION</Button>
            </Grid>*/}

              {/* NOTIFICACION WHATSAPP USUARIOS */}
              {showSelectUser ? <UsersSelect/> : ""}
              

        </Grid>
    </form>
    );
  };