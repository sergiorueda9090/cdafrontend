

import React, { useState } from "react";
import { Paper, InputBase, IconButton, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { search_cotizadores, getAllThunks, getAllCotizadorTramitesThunks, 
        getAllCotizadorConfirmacionPreciosThunks, getAllCotizadorPdfsThunks, 
        getAllFilterDateThunks, getAllFilterDatePdfThunks} from "../../store/cotizadorStore/cotizadorThunks";

import { getAllFilterDateThunks as getFilterTramitesThunks }                    from '../../store/tramitesStore/tramitesThunks';
import { getAllFilterDateThunks as getAllCotizadorConfirmacionThunksFilter  }   from "../../store/confirmacionPreciosStore/confirmacionPreciosThunks";
import { getAllThunks as getAllFichaClienteThunksFilter  }  from "../../store/fichaClienteStore/fichaClienteStoreThunks";
import { getAllThunks as getAllThunksArchivo }              from '../../store/archivocotizacionesantiguasStore/archivocotizacionesantiguasStoreThunks';
import { getAllThunks as getAllThunksHistorial }            from '../../store/historialtramitesemitidosStore/historialtramitesemitidosStoreThunks';
import { getFichaProveedorByIdThunk }                       from "../../store/fichaProveedoresStore/fichaProveedoresThunks";
import { getAllThunks as getAllThunksUtilidadFilter }       from "../../store/utilidadStore/utilidadStoreThunks";
import { searchClientesThunks,  getAllThunks as getAllThunksClientes } from "../../store/clientesStore/clientesThunks";


export const FilterData = ({cotizador, id=''}) => {
    
    const dispatch = useDispatch();
    let { startDate, endDate }    = useSelector(state => state.globalStore);

    const [searchQuery, setSearchQuery] = useState("");
    

    const handleSearch = () => {
        if(!searchQuery){
            alert("Debes escribir algo en el buscador para buscar.");        
            return;
        }

        if(cotizador == "fichaproveedor"){
            
            dispatch(getFichaProveedorByIdThunk(parseInt(id), startDate, endDate, searchQuery));

        }else if (cotizador == "utilidad"){

            dispatch(getAllThunksUtilidadFilter("", startDate, endDate, searchQuery));

        }else if (cotizador == "cotizador"){

            dispatch(search_cotizadores(searchQuery))

        }else if(cotizador == "tramite"){
        
            dispatch( getFilterTramitesThunks(startDate, endDate, searchQuery) );
        
        }else if(cotizador == "confirmacionprecios"){
        
            dispatch( getAllCotizadorConfirmacionThunksFilter(startDate, endDate, searchQuery) );
        
        }else if(cotizador == "pdfs"){
        
            dispatch( getAllFilterDatePdfThunks(startDate, endDate, searchQuery) );
            
        }else if(cotizador == "fichacliente"){
        
            dispatch( getAllFichaClienteThunksFilter(startDate, endDate, searchQuery) );
            
        }else if(cotizador == "archivocotizacionesantiguasStore"){
   
            dispatch( getAllThunksArchivo(startDate, endDate, searchQuery)) ;
        
        }else if(cotizador == "historialtramitesemitidos"){
            
            dispatch( getAllThunksHistorial(startDate, endDate, searchQuery)) ;
        
        }else if(cotizador == "clientes"){
            
            dispatch( searchClientesThunks(searchQuery)) ;
        
        }else{

            dispatch(getAllFilterDateThunks(startDate, endDate));
            
        }

       
    };

    const handleClear = () => {

        setSearchQuery("");

        if(cotizador == "cotizador"){

            dispatch(getAllThunks());

        }else if(cotizador == "tramite"){

            dispatch(getAllCotizadorTramitesThunks());

        }else if(cotizador == "confirmacionprecios"){
        
            dispatch(getAllCotizadorConfirmacionPreciosThunks());
        
        }else if(cotizador == "pdfs"){

            dispatch(getAllFilterDatePdfThunks());

        }else if(cotizador == "cuentasbancarias"){
            
            alert("Ceutnas bancarias EN PROCESO DE DESARROLLO....");
            return;

        }else if(cotizador == "fichacliente"){
        
            dispatch( getAllFichaClienteThunksFilter() );
            
        }else if(cotizador == "archivocotizacionesantiguasStore"){
                    
            dispatch( getAllThunksArchivo()) ;
        
        }else if(cotizador == "historialtramitesemitidos"){
            
            dispatch( getAllThunksHistorial()) ;
        
        }else if (cotizador == "utilidad"){

            dispatch(getAllThunksUtilidadFilter());

        }else if(cotizador == "clientes"){
            
            dispatch( getAllThunksClientes() ) ;
        
        }else{

            dispatch(getAllThunks());
            
        }
        
    };

    return (
        <Paper
            component="form"
            sx={{ 
                p: "1px 3px", 
                display: "flex", 
                alignItems: "center", 
                width: 400 
            }}
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Buscar..."
                inputProps={{ "aria-label": "buscar" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Botón de Búsqueda */}
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearch}>
                <SearchIcon />
            </IconButton>

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

            {/* Botón para Limpiar la Búsqueda */}
            <IconButton type="button" sx={{ p: "10px" }} aria-label="clear" onClick={handleClear}>
                <ClearIcon />
            </IconButton>
        </Paper>
    );
};

