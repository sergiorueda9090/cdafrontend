import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    IconButton,
    Card,
    CardContent,
    Typography,
    Chip,
    useTheme,
    useMediaQuery,
    Stack,
    Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/etiquetasStore/etiquetasThunks';
import { toast } from 'react-toastify';
import { FilterData } from '../../cotizador/components/FilterData';

export function DataTable() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    let { etiquetas } = useSelector(state => state.etiquetasStore);

    // Columnas para DataGrid
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            hide: isTablet,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: "color",
            headerName: "Color",
            width: 90,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const colorFondo = params.value || "#ddd";
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Chip
                            sx={{
                                backgroundColor: colorFondo,
                                width: 50,
                                height: 28,
                                borderRadius: 1
                            }}
                        />
                    </Box>
                );
            },
        },
        {
            field: 'nombre',
            headerName: 'Nombre',
            flex: 1,
            minWidth: 200,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(params.row)}
                            color="primary"
                            size="small"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.lighter',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                            size="small"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'error.lighter',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            ),
        },
    ];

    // Función para manejar la eliminación
    const handleDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <Box>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        ¿Estás seguro de que deseas eliminar esta etiqueta?
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                            onClick={() => confirmDelete(id, closeToast)}
                            sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                px: 2,
                                borderRadius: 1,
                                '&:hover': { bgcolor: 'error.dark' }
                            }}
                        >
                            Sí, eliminar
                        </IconButton>
                        <IconButton
                            onClick={closeToast}
                            sx={{
                                bgcolor: 'grey.500',
                                color: 'white',
                                px: 2,
                                borderRadius: 1,
                                '&:hover': { bgcolor: 'grey.600' }
                            }}
                        >
                            Cancelar
                        </IconButton>
                    </Stack>
                </Box>
            ),
            { autoClose: false }
        );
    };

    const confirmDelete = async (id, closeToast) => {
        await dispatch(deleteThunk(id));
        closeToast();
    };

    const handleEdit = async (row) => {
        await dispatch(showThunk(row.id));
    };

    const paginationModel = { page: 0, pageSize: 10 };

    // Vista de tarjetas para móvil
    const MobileCardView = () => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
            height: '100%',
            overflowY: 'auto'
        }}>
            {etiquetas.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    minHeight: 200
                }}>
                    <Typography variant="body1" color="text.secondary">
                        No se encontraron etiquetas
                    </Typography>
                </Box>
            ) : (
                etiquetas.map((etiqueta) => (
                    <Card
                        key={etiqueta.id}
                        elevation={2}
                        sx={{
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-4px)'
                            }
                        }}
                    >
                        <CardContent sx={{ p: 2 }}>
                            {/* Header con color y acciones */}
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            backgroundColor: etiqueta.color || "#ddd",
                                            borderRadius: 1,
                                            border: '2px solid',
                                            borderColor: 'divider'
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
                                            {etiqueta.nombre}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: {etiqueta.id}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={0.5}>
                                    <IconButton
                                        onClick={() => handleEdit(etiqueta)}
                                        color="primary"
                                        size="small"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(etiqueta.id)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 0, sm: 2 }
        }}>
            {/* Barra de búsqueda responsive */}
            <Box sx={{ mb: 2, px: { xs: 2, sm: 0 }, pt: { xs: 2, sm: 0 } }}>
                <FilterData cotizador="etiquetas" />
            </Box>

            {/* Vista condicional: Tarjetas en móvil, Tabla en tablet/escritorio */}
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                {isMobile ? (
                    <MobileCardView />
                ) : (
                    <DataGrid
                        rows={etiquetas}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        disableRowSelectionOnClick
                        rowHeight={64}
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-cell': {
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                py: 0,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'primary.lighter',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                borderRadius: 0,
                                minHeight: '56px !important',
                                maxHeight: '56px !important',
                                lineHeight: '56px !important'
                            },
                            '& .MuiDataGrid-columnHeader': {
                                '&:focus': { outline: 'none' },
                                '&:focus-within': { outline: 'none' }
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            },
                            '& .MuiDataGrid-row': {
                                minHeight: '64px !important',
                                maxHeight: '64px !important',
                                '&:nth-of-type(even)': {
                                    backgroundColor: 'action.hover',
                                },
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                    transition: 'background-color 0.2s'
                                }
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: '2px solid',
                                borderColor: 'divider',
                                backgroundColor: 'background.default',
                                minHeight: '56px'
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                marginTop: '56px !important'
                            },
                            '& .MuiDataGrid-cell:focus': { outline: 'none' },
                            '& .MuiDataGrid-cell:focus-within': { outline: 'none' }
                        }}
                        localeText={{
                            noRowsLabel: 'No hay etiquetas para mostrar',
                            MuiTablePagination: {
                                labelRowsPerPage: isTablet ? 'Filas:' : 'Filas por página:',
                            }
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
