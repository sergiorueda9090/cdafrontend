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
    Divider,
    Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, dashboard_obtener_datos_cuenta } from '../../store/cuentasBancariasStore/cuentasBancariasThunks';
import { toast } from 'react-toastify';
import emptyDataTable from "../../assets/images/emptyDataTable.png"
import { DateRange } from '../../cotizador/components/DateRange';
import { v4 as uuidv4 } from 'uuid';

export function DataTable() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const navigate = useNavigate();

    let { cuentasBancarias } = useSelector(state => state.cuentasBancariasStore);

    // Función para obtener color según origen
    const getOrigenColor = (origen) => {
        const colores = {
            "Tramite": "#E6F4EA",
            "Recepcion Pago": "#FFF4DE",
            "Devoluciones": "#F8D7DA",
            "Gastos generales": "#D1ECF1",
            "Utilidad ocacional": "#D6D8DB",
            "Cargos no registrados": "#a9f3efff"
        };
        return colores[origen] || "transparent";
    };

    const NoRowsOverlay = () => (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            py: 4
        }}>
            <Box
                component="img"
                src={emptyDataTable}
                alt="No hay datos disponibles"
                sx={{ width: 150, opacity: 0.7, mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary">
                No hay datos disponibles
            </Typography>
        </Box>
    );

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
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
            field: 'fi',
            headerName: 'Fecha de Ingreso',
            width: 130,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params) => {
                if (!params) return '';
                const date = new Date(params);
                return date.toLocaleString('es-CO', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }).replace(',', '');
            },
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {params.formattedValue}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'ft',
            headerName: 'Fecha Transacción',
            width: 130,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'desc_alias',
            headerName: 'Descripción',
            width: 230,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => {
                const { origen, desc_alias, placa, cliente_nombre } = params.row;
                let descripcion = desc_alias;

                if (origen === "Tramite") {
                    descripcion += ` - SOAT ${placa}`;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                {descripcion}
                            </Typography>
                        </Box>
                    );
                } else {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                {cliente_nombre}
                            </Typography>
                        </Box>
                    );
                }
            }
        },
        {
            field: 'valor_alias',
            headerName: 'Valor',
            width: 199,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => {
                const valor = params.value || 0;
                const color = valor < 0 ? 'red' : 'green';
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography variant="h6" sx={{ color, fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('es-CO').format(valor)}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'cuatro_por_mil',
            headerName: 'Cuatro por Mil',
            width: 199,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => {
                const valor = params.value || 0;
                const valorNegativo = -Math.abs(valor);
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('es-CO').format(valorNegativo)}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'total',
            headerName: 'Total',
            width: 199,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => {
                const valor = params.value || 0;
                const color = valor < 0 ? 'red' : 'green';
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography variant="h6" sx={{ color, fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('es-CO').format(valor)}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'cilindraje',
            headerName: 'Cilindraje',
            width: 130,
            hide: isTablet,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'placa',
            headerName: 'Placa',
            width: 130,
            hide: isTablet,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const { origen, placa } = params.row;
                let descripcion = "";
                if (origen === "Tramite") {
                    descripcion = `Debito - SOAT ${placa}`;
                }
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            {descripcion}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: "origen",
            headerName: "Origen",
            width: 199,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const origen = params.value;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Chip
                            label={origen}
                            sx={{
                                backgroundColor: getOrigenColor(origen),
                                fontWeight: 'bold',
                                width: '100%',
                                maxWidth: 180
                            }}
                        />
                    </Box>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Stack direction="row" spacing={0.5}>
                        {params.row.archivo && (
                            <Tooltip title="Ver Registro">
                                <IconButton
                                    onClick={() => handleEdit(params.row.idCuentaBancaria)}
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
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Ver Tarjeta">
                            <IconButton
                                onClick={() => handleShow(params.row.id_tarjeta)}
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
                                <CreditCardIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            ),
        },
    ];

    const handleEdit = async (id_cotizador) => {
        await dispatch(showThunk(id_cotizador));
    };

    const handleShow = async (id) => {
        await dispatch(dashboard_obtener_datos_cuenta(id));
        navigate(`/bancos/PageShow/${id}`);
    };

    const paginationModel = { page: 0, pageSize: 15 };

    const enhancedDashboardData = cuentasBancarias.map(row => ({
        ...row,
        idCuentaBancaria: row.id,
        id: uuidv4()
    }));

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
            {enhancedDashboardData.length === 0 ? (
                <NoRowsOverlay />
            ) : (
                enhancedDashboardData.map((cuenta) => (
                    <Card
                        key={cuenta.id}
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
                            {/* Header con Origen y Acciones */}
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Chip
                                    label={cuenta.origen}
                                    sx={{
                                        backgroundColor: getOrigenColor(cuenta.origen),
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem'
                                    }}
                                />
                                <Stack direction="row" spacing={0.5}>
                                    {cuenta.archivo && (
                                        <IconButton
                                            onClick={() => handleEdit(cuenta.idCuentaBancaria)}
                                            color="primary"
                                            size="small"
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        onClick={() => handleShow(cuenta.id_tarjeta)}
                                        color="primary"
                                        size="small"
                                    >
                                        <CreditCardIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>

                            {/* Descripción */}
                            <Box sx={{ mb: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                    <DescriptionIcon fontSize="small" color="action" />
                                    <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
                                        {cuenta.origen === "Tramite"
                                            ? `${cuenta.desc_alias} - SOAT ${cuenta.placa}`
                                            : cuenta.cliente_nombre}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            {/* Información */}
                            <Stack spacing={1.5}>
                                {/* Fechas */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarTodayIcon fontSize="small" color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Ingreso: {new Date(cuenta.fi).toLocaleDateString('es-CO')}
                                        </Typography>
                                        {cuenta.ft && (
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Transacción: {cuenta.ft}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>

                                {/* Valores */}
                                <Box sx={{
                                    p: 1.5,
                                    backgroundColor: 'action.hover',
                                    borderRadius: 1
                                }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Valor:</Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                                sx={{ color: cuenta.valor_alias < 0 ? 'error.main' : 'success.main' }}
                                            >
                                                ${new Intl.NumberFormat('es-CO').format(cuenta.valor_alias || 0)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">4x1000:</Typography>
                                            <Typography variant="body2" fontWeight="bold" color="error.main">
                                                ${new Intl.NumberFormat('es-CO').format(-Math.abs(cuenta.cuatro_por_mil || 0))}
                                            </Typography>
                                        </Stack>
                                        <Divider />
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" fontWeight="600">Total:</Typography>
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{ color: cuenta.total < 0 ? 'error.main' : 'success.main' }}
                                            >
                                                ${new Intl.NumberFormat('es-CO').format(cuenta.total || 0)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Información adicional */}
                                {(cuenta.cilindraje || cuenta.placa) && (
                                    <Stack direction="row" spacing={2} sx={{ fontSize: '0.75rem' }}>
                                        {cuenta.cilindraje && (
                                            <Typography variant="caption" color="text.secondary">
                                                Cilindraje: {cuenta.cilindraje}
                                            </Typography>
                                        )}
                                    </Stack>
                                )}
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
            {/* DateRange - Responsive */}
            <Box sx={{
                mb: 2,
                px: { xs: 2, sm: 0 },
                pt: { xs: 2, sm: 0 }
            }}>
                <DateRange cotizador="cuentasbancarias" />
            </Box>

            {/* Vista condicional: Tarjetas en móvil, Tabla en tablet/escritorio */}
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                {isMobile ? (
                    <MobileCardView />
                ) : (
                    <DataGrid
                        rows={enhancedDashboardData}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 25, 50]}
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
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
                        }
                        slots={{
                            noRowsOverlay: NoRowsOverlay,
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
