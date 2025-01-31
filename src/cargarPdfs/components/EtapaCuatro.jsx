import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateThunks } from '../../store/tramitesStore/tramitesThunks';

export const EtapaCuatro = () => {
  
  const dispatch = useDispatch();
  
  const { id, pdf } = useSelector((state) => state.tramitesStore);
  console.log("pdf ",pdf)
  const [pdfFile, setPdfFile] = useState(null); // PDF cargado
  const [pdfPreview, setPdfPreview] = useState(null); // Vista previa del PDF

  // Si ya hay un PDF en el estado global, configurarlo como vista previa
  useEffect(() => {
    if (pdf) {
      setPdfPreview(pdf); // Asumimos que `pdf` es la URL del archivo existente
    }
  }, [pdf]);
  
  // Manejar la carga de archivos
  const handlePdfUpload = (event) => {

    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
    
      setPdfFile(file);
    
      const fileURL = URL.createObjectURL(file);
    
      setPdfPreview(fileURL);
   
    } else {

      alert('Por favor, suba un archivo PDF válido.');
    }
  };

  // Manejar guardar
  const handleSave = () => {

    if (!pdfFile && !pdf) {
      alert('Por favor, suba un archivo PDF antes de guardar.');
      return;
    }

    // Aquí puedes enviar el archivo al servidor
    if (pdfFile) {
      dispatch(updateThunks({'pdf':pdfFile, 'id':id, 'estado':'Finalización'}))
      alert(`Archivo "${pdfFile.name}" guardado exitosamente.`);
    } else {
      alert('Archivo guardado exitosamente con el PDF existente.');
    }
  };

  // Eliminar archivo cargado
  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfPreview(null);
  };

  return (
    <Grid container spacing={2}>
      {/* Subir archivo PDF */}
      <Grid item xs={12}>
        <Button variant="contained" component="label">
          Subir PDF
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handlePdfUpload}
          />
        </Button>
      </Grid>

      {/* Vista previa del archivo PDF */}
      {pdfPreview && (
        <Grid item xs={12}>
          <Typography variant="subtitle1">Vista previa del archivo PDF:</Typography>
          <Box
            sx={{
              border: '1px solid #ccc',
              padding: 2,
              borderRadius: 1,
              marginTop: 2,
              maxHeight: '500px',
              overflow: 'auto',
            }}
          >
            <iframe
              src={pdfPreview}
              title="Vista previa del PDF"
              style={{ width: '100%', height: '500px' }}
            ></iframe>
          </Box>
        </Grid>
      )}

      {/* Botones de acción */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!pdfFile && !pdf} // Deshabilitar si no hay archivo cargado ni existente
        >
          Guardar
        </Button>

        {(pdfFile || pdfPreview) && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemovePdf}
            sx={{ marginLeft: 2 }}
          >
            Eliminar PDF
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
