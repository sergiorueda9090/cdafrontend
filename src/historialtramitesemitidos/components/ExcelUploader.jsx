import React, { useState, useRef, useEffect } from "react";
import { Grid, TextField, Button, IconButton, Typography, useMediaQuery, useTheme, Box, Paper, Divider } from "@mui/material";
import * as XLSX from "xlsx";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

import { addPreciosLeyThunks } from "../../store/clientesStore/clientesThunks";
import { useDispatch } from "react-redux";

const ExcelUploader = () => {

  const dispatch = useDispatch()
  
  const [preciosLey, setPreciosLey] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Referencia para limpiar el input file

  console.log("preciosLey ",preciosLey);

  useEffect(() => {
    dispatch(addPreciosLeyThunks(preciosLey))
  },[preciosLey])

  // 📌 Función para formatear valores como moneda colombiana
  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\./g, ""); // Elimina puntos existentes
    return new Intl.NumberFormat("es-CO").format(number); // Aplica formato de moneda
  };

  // 📌 Función para actualizar valores en la lista con formato de moneda
  const handlePrecioLeyChange = (index, field, value) => {
    const formattedValue = field !== "descripcion" ? formatCurrency(value) : value;
    const updatedPreciosLey = preciosLey.map((precio, i) =>
      i === index ? { ...precio, [field]: formattedValue } : precio
    );
    setPreciosLey(updatedPreciosLey);
  };

  // 📌 Función para manejar la subida del archivo Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file.name); // Guarda el nombre del archivo seleccionado

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });

      const sheetName = workbook.SheetNames[0]; // Primera hoja del archivo
      const sheet = workbook.Sheets[sheetName];

      // Convertir Excel en JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Obtener filas de datos (omitimos la primera fila si tiene encabezados)
      const dataRows = jsonData.slice(1);

      // Mapear los datos correctamente
      const newPrecios = dataRows.map((row) => ({
        descripcion: row[0] || "", // Columna 1 - Descripción
        precio_ley: formatCurrency(row[1] || 0), // Columna 2 - Precio de Ley con formato
        comision: formatCurrency(row[2] || 0), // Columna 3 - Comisión con formato
      }));

      // Actualizar el estado con los nuevos datos
      setPreciosLey([...preciosLey, ...newPrecios]);
    };
  };

  // 📌 Función para eliminar el archivo seleccionado
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreciosLey([]); // Opcional: Elimina los datos cargados al remover el archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Resetea el input file
    }
  };

  // 📌 Función para agregar un nuevo precio manualmente
  const handleAddPrecioLey = () => {
    setPreciosLey([
      ...preciosLey,
      { descripcion: "", precio_ley: "", comision: "" },
    ]);
  };

  // 📌 Función para eliminar un precio de la lista
  const removePrecioLey = (index) => {
    setPreciosLey(preciosLey.filter((_, i) => i !== index));
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%', p: isMobile ? 1 : 2 }}>
      {/* Sección de carga de archivo */}
      <Paper
        elevation={2}
        sx={{
          p: isMobile ? 2 : 3,
          mb: 3,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
        >
          Cargar Precios desde Excel
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 2
        }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth={isMobile}
            size={isMobile ? "medium" : "large"}
            sx={{ minWidth: isMobile ? '100%' : '200px' }}
          >
            Subir Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              ref={fileInputRef}
              hidden
            />
          </Button>

          {selectedFile && (
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexGrow: 1,
                backgroundColor: 'white'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {selectedFile}
              </Typography>
              <IconButton color="error" onClick={handleRemoveFile} size="small">
                <DeleteIcon />
              </IconButton>
            </Paper>
          )}
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Botón para agregar precio manualmente */}
      <Box sx={{ mb: 3, textAlign: isMobile ? 'center' : 'left' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPrecioLey}
          startIcon={<AddIcon />}
          fullWidth={isMobile}
          size={isMobile ? "medium" : "large"}
        >
          Agregar Precio de Ley
        </Button>
      </Box>

      {/* Lista de precios */}
      {preciosLey.length > 0 && (
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Precios Agregados ({preciosLey.length})
        </Typography>
      )}

      {preciosLey.map((precio, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            p: isMobile ? 2 : 2.5,
            mb: 2,
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6
            }
          }}
        >
          <Grid container spacing={isMobile ? 1.5 : 2} alignItems="center">
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                fullWidth
                label="Descripción"
                value={precio.descripcion}
                onChange={(e) =>
                  handlePrecioLeyChange(index, "descripcion", e.target.value)
                }
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Precio de Ley"
                value={precio.precio_ley}
                onChange={(e) =>
                  handlePrecioLeyChange(index, "precio_ley", e.target.value)
                }
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Comisión"
                value={precio.comision}
                onChange={(e) =>
                  handlePrecioLeyChange(index, "comision", e.target.value)
                }
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removePrecioLey(index)}
                fullWidth
                startIcon={<DeleteIcon />}
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? 'Eliminar' : 'Eliminar'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {preciosLey.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No hay precios agregados. Sube un archivo Excel o agrégalos manualmente.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ExcelUploader;
