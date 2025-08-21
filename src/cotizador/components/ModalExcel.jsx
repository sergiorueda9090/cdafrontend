import React, { useEffect, useRef,useState } from "react";
import { Dialog, DialogTitle, Tabs, Tab, Box, Typography, Alert, DialogContent, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { closeModalExcel } from '../../store/globalStore/globalStore';
import { ExcelUploader } from "./SubirExcel";


export const ModalExcel = () => {

    const dispatch = useDispatch();

    // Estado global del modal y cliente actual
    const { openModalExcel } = useSelector((state) => state.globalStore);


    // Cerrar el modal
    const handleClose = () => {
      dispatch(closeModalExcel());
    };

  
    return (
          <Dialog open={openModalExcel} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>📂 Subir Documento Excel</DialogTitle>
            <DialogContent>
              <Box sx={{ padding: 2 }}>
                {/* Mensaje de advertencia */}
                <Alert severity="info" sx={{ mb: 2 }}>
                  El archivo debe estar en formato <strong>.xlsx</strong>.  
                  <br />
                  ⚠️ <strong>Importante:</strong> Para que la carga funcione correctamente,  
                  cada columna debe llamarse exactamente con los siguientes nombres:
                </Alert>

                {/* Lista de columnas obligatorias */}
                <Typography variant="h6" gutterBottom>
                  📑 Columnas obligatorias
                </Typography>
                <Box sx={{ pl: 2, mb: 2 }}>
                  <ul>
                    <li><Typography variant="body2">nombre cliente</Typography></li>
                    <li><Typography variant="body2">etiqueta</Typography></li>
                    <li><Typography variant="body2">placa</Typography></li>
                    <li><Typography variant="body2">cilindraje</Typography></li>
                    <li><Typography variant="body2">modelo</Typography></li>
                    <li><Typography variant="body2">chasis</Typography></li>
                    <li><Typography variant="body2">tipo documento</Typography></li>
                    <li><Typography variant="body2">numero documento</Typography></li>
                    <li><Typography variant="body2">nombre completo</Typography></li>
                  </ul>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Condiciones de validación */}
                <Typography variant="h6" gutterBottom>
                  ✅ Condiciones de validación
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <ul>
                    <li>
                      <Typography variant="body2">
                        <strong>tipo documento:</strong> Debe ser uno de los siguientes valores:  
                        <em> Cédula, Pasaporte, Tarjeta de Identidad, Número de Identificación Tributaria (NIT), 
                        Cédula de Extranjería, Permiso por Protección Temporal</em>.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>modelo:</strong> Año del vehículo, debe ser un número válido y mayor o igual a <em>1960</em>.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>cilindraje:</strong> Número válido entre <em>80 y 22000</em>.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>numero documento:</strong> No puede estar vacío y debe tener al menos <em>5 caracteres</em>.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>placa:</strong> Solo se permiten letras y números, no puede estar vacía.
                      </Typography>
                    </li>
                  </ul>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Uploader */}
                <ExcelUploader />
              </Box>
            </DialogContent>
          </Dialog>
    );
}