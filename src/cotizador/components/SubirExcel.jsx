import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { createExcelThunks, createTramiteExcelThunks } from "../../store/cotizadorStore/cotizadorThunks";
import { useDispatch } from "react-redux";

export const ExcelUploader = ({modulo}) => {
console.log("=== ExcelUploader modulo ==== ",modulo)
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const tiposDocumentoPermitidos = [
    "Cedula",
    "Pasaporte",
    "Tarjeta de Identidad",
    "Número de Identificación Tributaria",
    "Cédula de Extranjería",
    "Permiso por Protección Temporal",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const validatedData = jsonData.map((row, index) => {
        let errors = [];

        let tipoDocumento = row["tipo documento"]?.trim();
        let modelo = parseInt(row.modelo);
        let cilindraje = parseInt(row.cilindraje);
        let numeroDocumento = row["numero documento"]?.toString().trim();
        let chasis = row.chasis?.toString().toUpperCase();
        let telefono = row["telefono"]?.toString().trim() || row["teléfono"]?.toString().trim() || "";

        // Validaciones
        if (!tiposDocumentoPermitidos.includes(tipoDocumento)) {
          errors.push("Tipo de documento no válido");
        }

        if (isNaN(modelo) || modelo < 1960) {
          errors.push("Año de modelo inválido (mínimo 1960)");
        }

        if (isNaN(cilindraje) || cilindraje < 80 || cilindraje > 22000) {
          errors.push("Cilindraje inválido (80 - 22000)");
        }

        if (!numeroDocumento || numeroDocumento.length < 5) {
          errors.push("Número de documento demasiado corto");
        }

        if (telefono && !/^[0-9+\s()-]{7,15}$/.test(telefono)) {
          errors.push("Teléfono inválido");
        }

        return {
          index: index + 2,
          nombre_cliente: row["nombre cliente"] || "",
          etiqueta: row.etiqueta || "",
          placa: row.placa?.toString().toUpperCase() || "",
          cilindraje,
          modelo,
          chasis,
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
          nombre_completo: row["nombre completo"] || "",
          telefono,
          errors,
        };
      });

      setData(validatedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleClear = () => {
    setData([]);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const allValid = data.length > 0 && data.every((row) => row.errors.length === 0);

  const handleSave = async () => {
    if (!allValid) return;
    setLoading(true);
    try {

      if(modulo == "tramites"){
         dispatch(createTramiteExcelThunks(data));
      }else{
         dispatch(createExcelThunks(data));
      }
     
    } catch (error) {
      alert("⚠️ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      {/* Botones */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          Subir Excel de Clientes
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </Button>

        {data.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
          >
            Eliminar archivo
          </Button>
        )}
      </Stack>

      {fileName && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Archivo cargado: <b>{fileName}</b>
        </Typography>
      )}

      {/* Tabla */}
      {data.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Fila</b></TableCell>
                <TableCell><b>Nombre Cliente</b></TableCell>
                <TableCell><b>Etiqueta</b></TableCell>
                <TableCell><b>Placa</b></TableCell>
                <TableCell><b>Cilindraje</b></TableCell>
                <TableCell><b>Modelo</b></TableCell>
                <TableCell><b>Chasis</b></TableCell>
                <TableCell><b>Tipo Documento</b></TableCell>
                <TableCell><b>Número Documento</b></TableCell>
                <TableCell><b>Nombre Completo</b></TableCell>
                <TableCell><b>Teléfono</b></TableCell>
                <TableCell><b>Estado</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    backgroundColor:
                      row.errors.length > 0 ? "#ffe5e5" : "#e6ffe6",
                  }}
                >
                  <TableCell>{row.index}</TableCell>
                  <TableCell>{row.nombre_cliente}</TableCell>
                  <TableCell>{row.etiqueta}</TableCell>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.cilindraje}</TableCell>
                  <TableCell>{row.modelo}</TableCell>
                  <TableCell>{row.chasis}</TableCell>
                  <TableCell>{row.tipo_documento}</TableCell>
                  <TableCell>{row.numero_documento}</TableCell>
                  <TableCell>{row.nombre_completo}</TableCell>
                  <TableCell>{row.telefono}</TableCell>
                  <TableCell>
                    {row.errors.length > 0 ? (
                      row.errors.map((err, i) => (
                        <Chip
                          key={i}
                          label={err}
                          color="error"
                          variant="outlined"
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))
                    ) : (
                      <Chip
                        label="✔ Válido"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Botón Guardar */}
      {data.length > 0 && (
        <Box mt={3}>
          <Button
            variant="contained"
            color="success"
            disabled={!allValid || loading}
            onClick={handleSave}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          {!allValid && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              ⚠️ Corrige los errores antes de poder guardar.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
