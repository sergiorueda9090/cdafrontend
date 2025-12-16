import React, { useState, useRef, useEffect } from "react";
import { Grid, TextField, Button, IconButton, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import DeleteIcon from "@mui/icons-material/Delete"; // Icono para eliminar

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

  return (
    <>
      {/* Botón para subir Excel */}
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ marginBottom: { xs: 1, sm: 2 } }}>
        <Grid item xs={12} sm="auto">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{
              padding: '8px',
              fontSize: window.innerWidth < 600 ? '0.875rem' : '1rem'
            }}
          />
        </Grid>

        {/* Muestra el nombre del archivo y el botón de eliminar */}
        {selectedFile && (
          <Grid item xs={12} sm="auto">
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                wordBreak: 'break-word'
              }}
            >
              📂 {selectedFile}
              <IconButton
                color="error"
                onClick={handleRemoveFile}
                size={window.innerWidth < 600 ? "small" : "medium"}
              >
                <DeleteIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
              </IconButton>
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Botón para agregar un precio manualmente */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPrecioLey}
          fullWidth={window.innerWidth < 600}
          size={window.innerWidth < 600 ? "small" : "medium"}
          sx={{
            marginTop: { xs: 1, sm: 2 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          ➕ Agregar Precio de Ley
        </Button>
      </Grid>

      {preciosLey.map((precio, index) => (
        <Grid
          container
          spacing={{ xs: 1, sm: 2 }}
          key={index}
          sx={{ marginTop: { xs: 0.5, sm: 1 } }}
        >
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              fullWidth
              label="📝 Descripción"
              value={precio.descripcion}
              onChange={(e) =>
                handlePrecioLeyChange(index, "descripcion", e.target.value)
              }
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="💰 Precio de Ley"
              value={precio.precio_ley}
              onChange={(e) =>
                handlePrecioLeyChange(index, "precio_ley", e.target.value)
              }
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="📊 Comisión"
              value={precio.comision}
              onChange={(e) =>
                handlePrecioLeyChange(index, "comision", e.target.value)
              }
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => removePrecioLey(index)}
              fullWidth
              size={window.innerWidth < 600 ? "small" : "medium"}
              sx={{
                height: { xs: '40px', sm: '56px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              🗑 Eliminar
            </Button>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default ExcelUploader;
