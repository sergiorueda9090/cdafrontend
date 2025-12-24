
import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from 'react-redux';
import { Button, Box  } from '@mui/material';

import { getAllFilterDateThunks, getAllThunks, 
         getAllCotizadorTramitesThunks, 
         getAllCotizadorConfirmacionPreciosThunks, 
         getAllCotizadorPdfsThunks, getAllFilterDatePdfThunks }      from '../../store/cotizadorStore/cotizadorThunks';

import { getAllFilterDateThunks as getFilterTramitesThunks }              from '../../store/tramitesStore/tramitesThunks';
import { getAllFilterDateThunks as getAllCotizadorConfirmacionThunksFilter  } from "../../store/confirmacionPreciosStore/confirmacionPreciosThunks";

import { dashboard_obtener_datos_cuenta, 
         dashboard_obtener_datos_cuenta_dates, 
         getAllThunksFilter,
         getAllThunks as getAllThunksCuentasBancarias } from '../../store/cuentasBancariasStore/cuentasBancariasThunks';

import { getAllThunks as getAllFichaClienteThunksFilter  } from "../../store/fichaClienteStore/fichaClienteStoreThunks";

import { getAllThunksFilter as getAllThunksFilterUtilidadOcacional, 
         getAllThunks       as getAllThunksUtilidadOcacional  } from '../../store/utilidadOcacionalStore/utilidadOcacionalStoreThunks';

import { getAllThunksFilter as getAllThunksFilterGastosGenerales,
         getAllThunks       as getAllThunksGastosGenerales  } from '../../store/gastosGeneralesStore/gastosGeneralesStoreThunks';

import { startDateGlobalStore, endDateGlobalStore } from '../../store/globalStore/globalStore';

import { getAllThunksFilter as getAllThunksFilterGastos,
         getAllThunks       as getAllThunksGastos } from '../../store/gastosStore/gastosStoreThunks';

import { getAllThunksFilter as getAllThunksFilterAjustesSaldo, 
         getAllThunks as getAllThunksAjusteSaldo } from '../../store/ajustesSaldoStore/ajustesSaldoStoreThunks';

import { getAllThunksFilter as getAllThunksFilterDevoluciones, 
         getAllThunks as getAllThunksDevoluciones } from '../../store/devolucionesStore/devolucionesStoreThunks';

import { getAllThunksFilter as getAllThunksFilterRecepcionPago,
         getAllThunks as getAllThunksRecepcionPago } from '../../store/recepcionPagoStore/recepcionPagoStoreThunks';

import { getAllThunks as getAllThunksArchivo } from '../../store/archivocotizacionesantiguasStore/archivocotizacionesantiguasStoreThunks';
import { getAllThunks as getAllThunksHistorial } from '../../store/historialtramitesemitidosStore/historialtramitesemitidosStoreThunks';

import { getFichaProveedorByIdThunk } from '../../store/fichaProveedoresStore/fichaProveedoresThunks';
import { getAllThunks as getAllThunksBalanceGeneral, getObtenerTotalTarjetas, getPatrimonioNeto, getUtilidadNominal, getUtilidadReal, getGastoTotalesDelPeriodo } from '../../store/balancegeneralStore/balancegeneralStoreThunks';
import { getAllThunks as getAllThunksUtilidadFilter }       from "../../store/utilidadStore/utilidadStoreThunks";

import dayjs from "dayjs";



export const DateRange = ({cotizador,id=''}) => {

    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate,   setEndDate]   = useState(null);


    const handleFilter = () => {

        if (!startDate || !endDate) {
            alert("Debes seleccionar ambas fechas para filtrar.");
            return;
        }

        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEndDate   = dayjs(endDate).format("YYYY-MM-DD");
        console.log("formattedStartDate ",formattedStartDate)
        console.log("formattedEndDate ",formattedEndDate)
        console.log(" === cotizador === ",cotizador)

        if(cotizador == "dashBoard"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) )
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) )
            dispatch(dashboard_obtener_datos_cuenta_dates(id, formattedStartDate, formattedEndDate));

        }else if(cotizador == "tramite"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) )
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) )
            dispatch( getFilterTramitesThunks(formattedStartDate, formattedEndDate) );

        }else if(cotizador == "confirmacionprecios"){
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) )
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) )
            dispatch( getAllCotizadorConfirmacionThunksFilter(formattedStartDate, formattedEndDate) );
                
        }else if(cotizador == "pdfs"){
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) )
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) )
            dispatch( getAllFilterDatePdfThunks(formattedStartDate, formattedEndDate) );
                
        }else if(cotizador == "cuentasbancarias"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) )
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) )
            dispatch(  getAllThunksFilter(formattedStartDate, formattedEndDate) );

        }else if(cotizador == "fichacliente"){
                
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllFichaClienteThunksFilter(formattedStartDate, formattedEndDate)) ;
                    
        }else if(cotizador == "utilidadOcacional"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksFilterUtilidadOcacional(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "gastosGenerales"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksFilterGastosGenerales(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "gastos"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksFilterGastos(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "ajustesdesaldo"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksFilterAjustesSaldo(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "devoluciones"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksFilterDevoluciones(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "recepcionPago"){

            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksFilterRecepcionPago(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "archivocotizacionesantiguasStore"){
    
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksArchivo(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "historialtramitesemitidos"){
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksHistorial(formattedStartDate, formattedEndDate)) ;

        }else if(cotizador == "fichaproveedor"){
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch(getFichaProveedorByIdThunk(parseInt(id), formattedStartDate, formattedEndDate));

        }else if(cotizador == "utilidad"){
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch(getAllThunksUtilidadFilter("", formattedStartDate, formattedEndDate));

        }else if(cotizador == "balancegeneral"){
            
            dispatch( startDateGlobalStore({'startDate':formattedStartDate}) );
            dispatch( endDateGlobalStore({'endDate':formattedEndDate}) );
            dispatch( getAllThunksBalanceGeneral(formattedStartDate, formattedEndDate) );
            dispatch( getGastoTotalesDelPeriodo(formattedStartDate, formattedEndDate) );

            //dispatch(getObtenerTotalTarjetas());
            dispatch(getPatrimonioNeto(formattedStartDate, formattedEndDate));
            dispatch(getUtilidadNominal(formattedStartDate, formattedEndDate));
            dispatch(getUtilidadReal(formattedStartDate, formattedEndDate));

        }else{

            dispatch(getAllFilterDateThunks(formattedStartDate, formattedEndDate));
            
        }
    };

    const handleClearDates = () => {
        setStartDate(null);
        setEndDate(null);
        
        dispatch( startDateGlobalStore({'startDate':''}) )
        dispatch( endDateGlobalStore({'endDate':''}) )

        if(cotizador == "cotizador"){

            dispatch(getAllThunks());

        }else if(cotizador == "tramite"){

            dispatch(getAllCotizadorTramitesThunks());

        }else if(cotizador == "confirmacionprecios"){

            dispatch(getAllCotizadorConfirmacionThunksFilter());

        }else if(cotizador == "pdfs"){

            dispatch(getAllFilterDatePdfThunks());

        }else if(cotizador == "cuentasbancarias"){
            
            dispatch(getAllThunksCuentasBancarias());
     
        }else if(cotizador == "fichacliente"){
                
            dispatch( getAllFichaClienteThunksFilter()) ;
                    
        }else if(cotizador == "dashBoard"){

            dispatch(dashboard_obtener_datos_cuenta(id));
            return;

        }else if(cotizador == "utilidadOcacional"){

            dispatch(getAllThunksUtilidadOcacional());
            return;

        }else if(cotizador == "gastosGenerales"){

            dispatch(getAllThunksGastosGenerales());
            return;
            
        }else if(cotizador == "gastos"){

            dispatch(getAllThunksGastos());
            return;

        }else if(cotizador == "ajustesdesaldo"){

            dispatch(getAllThunksAjusteSaldo());
            return;
  
        }else if(cotizador == "devoluciones"){

            dispatch(getAllThunksDevoluciones());
            return;

        }else if(cotizador == "recepcionPago"){

            dispatch(getAllThunksRecepcionPago());
            return;

        }else if(cotizador == "archivocotizacionesantiguasStore"){
            

            dispatch( getAllThunksArchivo()) ;
            return;

        }else if(cotizador == "historialtramitesemitidos"){
            
            dispatch( getAllThunksHistorial()) ;

        }else if(cotizador == "fichaproveedor"){
            
            dispatch( getAllThunksHistorial()) ;

        }else if(cotizador == "balancegeneral"){
            
            dispatch(getAllThunksBalanceGeneral());

        }else if(cotizador == "utilidad"){
            
            dispatch(getAllThunksUtilidadFilter());

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