
import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from 'react-redux';
import { Button, Box  } from '@mui/material';
import { getAllFilterDateThunks, getAllThunks, getAllCotizadorTramitesThunks, getAllCotizadorConfirmacionPreciosThunks, getAllCotizadorPdfsThunks } from '../../store/cotizadorStore/cotizadorThunks';
import dayjs from "dayjs";

export const DateRange = ({cotizador}) => {

    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate]     = useState(null);

    const handleFilter = () => {
        if (!startDate || !endDate) {
            alert("Debes seleccionar ambas fechas para filtrar.");
            return;
        }

        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

        dispatch(getAllFilterDateThunks(formattedStartDate, formattedEndDate));
    };

    const handleClearDates = () => {
        setStartDate(null);
        setEndDate(null);

        if(cotizador == "cotizador"){

            dispatch(getAllThunks());

        }else if(cotizador == "tramite"){

            dispatch(getAllCotizadorTramitesThunks());

        }else if(cotizador == "confirmacionprecios"){

            dispatch(getAllCotizadorConfirmacionPreciosThunks());

        }else if(cotizador == "pdfs"){

            dispatch(getAllCotizadorPdfsThunks());

        }else if(cotizador == "cuentasbancarias"){
            
            alert("EN PROCESO DE DESARROLLO....");
            return;

        }else if(cotizador == "fichacliente"){
            
            alert("EN PROCESO DE DESARROLLO....");
            return;

        }else{
        
            dispatch(getAllThunks());
                    
        }
        
    };

    return (

        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" gap={1} marginBottom={2} alignItems="center">
                    <DatePicker
                        label="Fecha inicio"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{ textField: { size: "small" } }} // Hace el input más pequeño
                    />
                    <DatePicker
                        label="Fecha fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ textField: { size: "small" } }} // Hace el input más pequeño
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleFilter} 
                        disabled={!startDate || !endDate} 
                        size="small" 
                        sx={{ minWidth: "auto", px: 2 }} // Reduce ancho del botón
                    >
                        Buscar
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleClearDates} 
                        size="small" 
                        sx={{ minWidth: "auto", px: 2 }} // Reduce ancho del botón
                    >
                        Limpiar
                    </Button>
                </Box>
            </LocalizationProvider>
        </>

    )

}