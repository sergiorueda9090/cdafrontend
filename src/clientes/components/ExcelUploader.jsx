import React, { useState, useRef, useEffect } from "react";
import { Grid, TextField, Button, IconButton, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import DeleteIcon from "@mui/icons-material/Delete"; // Icono para eliminar

import { addPreciosLeyThunks } from "../../store/clientesStore/clientesThunks";
import { useDispatch, useSelector } from "react-redux";

const ExcelUploader = () => {
  
  const { preciosLey: percio_ley } = useSelector((state) => state.clientesStore);
  
  const dispatch = useDispatch()
  
  const [preciosLey, setPreciosLey] = useState(percio_ley);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Referencia para limpiar el input file


  useEffect(() => {
    dispatch(addPreciosLeyThunks(preciosLey))
  },[preciosLey])

  //Función para formatear valores como moneda colombiana
  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\./g, ""); // Elimina puntos existentes
    return new Intl.NumberFormat("es-CO").format(number); // Aplica formato de moneda
  };

  //Función para actualizar valores en la lista con formato de moneda
  const handlePrecioLeyChange = (index, field, value) => {
    const formattedValue = field !== "descripcion" ? formatCurrency(value) : value;
    const updatedPreciosLey = preciosLey.map((precio, i) =>
      i === index ? { ...precio, [field]: formattedValue } : precio
    );
    setPreciosLey(updatedPreciosLey);
  };

  //Función para manejar la subida del archivo Excel
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

  //Función para eliminar el archivo seleccionado
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreciosLey([]); // Opcional: Elimina los datos cargados al remover el archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Resetea el input file
    }
  };

  //Función para agregar un nuevo precio manualmente
  const handleAddPrecioLey = () => {
    setPreciosLey([
      ...preciosLey,
      { descripcion: "", precio_ley: "", comision: "" },
    ]);
  };

  //Función para eliminar un precio de la lista
  const removePrecioLey = (index) => {
    setPreciosLey(preciosLey.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Botón para subir Excel */}
   
        <Grid item>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            ref={fileInputRef} // Asigna la referencia al input
          />
        </Grid>

        {/* Muestra el nombre del archivo y el botón de eliminar */}
        {selectedFile && (
          <Grid item>
            <Typography variant="body1">
              📂 {selectedFile}
              <IconButton color="error" onClick={handleRemoveFile}>
                <DeleteIcon />
              </IconButton>
            </Typography>
          </Grid>
        )}
      

      {/* Botón para agregar un precio manualmente */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPrecioLey}
          sx={{ marginTop: 2 }}
        >
          ➕ Agregar Precio de Ley
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
              🗑 Eliminar
            </Button>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default ExcelUploader;
