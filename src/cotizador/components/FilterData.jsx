

import React, { useState } from "react";
import { Paper, InputBase, IconButton, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { search_cotizadores, getAllThunks, getAllCotizadorTramitesThunks, getAllCotizadorConfirmacionPreciosThunks, getAllCotizadorPdfsThunks } from "../../store/cotizadorStore/cotizadorThunks";

export const FilterData = ({cotizador}) => {
    
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
       dispatch(search_cotizadores(searchQuery))
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

            dispatch(getAllCotizadorPdfsThunks());

        }else if(cotizador == "cuentasbancarias"){
            
            alert("Ceutnas bancarias EN PROCESO DE DESARROLLO....");
            return;

        }else if(cotizador == "fichacliente"){
            
            alert("Ficha de los Clientes EN PROCESO DE DESARROLLO....");
            return;

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

