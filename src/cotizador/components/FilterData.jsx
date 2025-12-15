import React, { useState } from "react";
import {
    Paper,
    InputBase,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
    Box,
    TextField,
    InputAdornment
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
    search_cotizadores, getAllThunks, getAllCotizadorTramitesThunks,
    getAllCotizadorConfirmacionPreciosThunks, getAllCotizadorPdfsThunks,
    getAllFilterDateThunks, getAllFilterDatePdfThunks
} from "../../store/cotizadorStore/cotizadorThunks";

import { getAllFilterDateThunks as getFilterTramitesThunks } from '../../store/tramitesStore/tramitesThunks';
import { getAllFilterDateThunks as getAllCotizadorConfirmacionThunksFilter } from "../../store/confirmacionPreciosStore/confirmacionPreciosThunks";
import { getAllThunks as getAllFichaClienteThunksFilter } from "../../store/fichaClienteStore/fichaClienteStoreThunks";
import { getAllThunks as getAllThunksArchivo } from '../../store/archivocotizacionesantiguasStore/archivocotizacionesantiguasStoreThunks';
import { getAllThunks as getAllThunksHistorial } from '../../store/historialtramitesemitidosStore/historialtramitesemitidosStoreThunks';
import { getFichaProveedorByIdThunk } from "../../store/fichaProveedoresStore/fichaProveedoresThunks";
import { getAllThunks as getAllThunksUtilidadFilter } from "../../store/utilidadStore/utilidadStoreThunks";
import { searchClientesThunks, getAllThunks as getAllThunksClientes } from "../../store/clientesStore/clientesThunks";
import { getAllThunks as getAllThunksEtiquetas } from "../../store/etiquetasStore/etiquetasThunks";


export const FilterData = ({ cotizador, id = '' }) => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    let { startDate, endDate } = useSelector(state => state.globalStore);

    const [searchQuery, setSearchQuery] = useState("");


    const handleSearch = () => {
        if (!searchQuery) {
            return;
        }

        if (cotizador == "fichaproveedor") {

            dispatch(getFichaProveedorByIdThunk(parseInt(id), startDate, endDate, searchQuery));

        } else if (cotizador == "utilidad") {

            dispatch(getAllThunksUtilidadFilter("", startDate, endDate, searchQuery));

        } else if (cotizador == "cotizador") {

            dispatch(search_cotizadores(searchQuery))

        } else if (cotizador == "tramite") {

            dispatch(getFilterTramitesThunks(startDate, endDate, searchQuery));

        } else if (cotizador == "confirmacionprecios") {

            dispatch(getAllCotizadorConfirmacionThunksFilter(startDate, endDate, searchQuery));

        } else if (cotizador == "pdfs") {

            dispatch(getAllFilterDatePdfThunks(startDate, endDate, searchQuery));

        } else if (cotizador == "fichacliente") {

            dispatch(getAllFichaClienteThunksFilter(startDate, endDate, searchQuery));

        } else if (cotizador == "archivocotizacionesantiguasStore") {

            dispatch(getAllThunksArchivo(startDate, endDate, searchQuery));

        } else if (cotizador == "historialtramitesemitidos") {

            dispatch(getAllThunksHistorial(startDate, endDate, searchQuery));

        } else if (cotizador == "clientes") {

            dispatch(searchClientesThunks(searchQuery));

        } else if (cotizador == "etiquetas") {

            dispatch(getAllThunksEtiquetas());

        } else {

            dispatch(getAllFilterDateThunks(startDate, endDate));

        }


    };

    const handleClear = () => {

        setSearchQuery("");

        if (cotizador == "cotizador") {

            dispatch(getAllThunks());

        } else if (cotizador == "tramite") {

            dispatch(getAllCotizadorTramitesThunks());

        } else if (cotizador == "confirmacionprecios") {

            dispatch(getAllCotizadorConfirmacionPreciosThunks());

        } else if (cotizador == "pdfs") {

            dispatch(getAllFilterDatePdfThunks());

        } else if (cotizador == "cuentasbancarias") {

            return;

        } else if (cotizador == "fichacliente") {

            dispatch(getAllFichaClienteThunksFilter());

        } else if (cotizador == "archivocotizacionesantiguasStore") {

            dispatch(getAllThunksArchivo());

        } else if (cotizador == "historialtramitesemitidos") {

            dispatch(getAllThunksHistorial());

        } else if (cotizador == "utilidad") {

            dispatch(getAllThunksUtilidadFilter());

        } else if (cotizador == "clientes") {

            dispatch(getAllThunksClientes());

        } else if (cotizador == "etiquetas") {

            dispatch(getAllThunksEtiquetas());

        } else {

            dispatch(getAllThunks());

        }

    };

    // Placeholder dinámico según el tipo de cotizador
    const getPlaceholder = () => {
        switch (cotizador) {
            case "clientes":
                return "Buscar cliente...";
            case "cotizador":
                return "Buscar cotización...";
            case "tramite":
                return "Buscar trámite...";
            case "utilidad":
                return "Buscar utilidad...";
            case "fichacliente":
                return "Buscar ficha...";
            case "etiquetas":
                return "Buscar etiqueta...";
            default:
                return "Buscar...";
        }
    };

    return (
        <>
            {isMobile ? (
                // Vista móvil: TextField completo
                <TextField
                    fullWidth
                    size="small"
                    placeholder={getPlaceholder()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    edge="end"
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'background.paper'
                        }
                    }}
                />
            ) : (
                // Vista tablet/escritorio: Paper con botones separados
                <Paper
                    component="form"
                    sx={{
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        width: { sm: 300, md: 400 },
                        borderRadius: 2,
                        boxShadow: 1,
                        '&:hover': {
                            boxShadow: 2
                        },
                        transition: 'box-shadow 0.2s'
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                        placeholder={getPlaceholder()}
                        inputProps={{ "aria-label": "buscar" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Botón de Búsqueda */}
                    <IconButton
                        type="button"
                        sx={{
                            p: "8px",
                            '&:hover': {
                                backgroundColor: 'primary.lighter',
                                color: 'primary.main'
                            }
                        }}
                        aria-label="search"
                        onClick={handleSearch}
                    >
                        <SearchIcon />
                    </IconButton>

                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                    {/* Botón para Limpiar la Búsqueda */}
                    <IconButton
                        type="button"
                        sx={{
                            p: "8px",
                            '&:hover': {
                                backgroundColor: 'error.lighter',
                                color: 'error.main'
                            }
                        }}
                        aria-label="clear"
                        onClick={handleClear}
                    >
                        <ClearIcon />
                    </IconButton>
                </Paper>
            )}
        </>
    );
};
