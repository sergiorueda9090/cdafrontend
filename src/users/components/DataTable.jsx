import * as React from 'react';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    IconButton,
    Avatar,
    Card,
    CardContent,
    Typography,
    Chip,
    useTheme,
    useMediaQuery,
    Stack,
    Divider,
    TextField,
    InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk } from '../../store/usersStore/usersThunks';
import { toast } from 'react-toastify';
import { URL } from '../../constants.js/constantGlogal';

export function DataTable() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [searchText, setSearchText] = useState('');

    let { users } = useSelector(state => state.usersStore);

    // Función para obtener el nombre del rol
    const getRoleName = (idRol) => {
        switch (idRol) {
            case 1: return "SuperAdmin";
            case 2: return "Admin";
            case 3: return "Auxiliar";
            case 4: return "Cliente";
            default: return "Desconocido";
        }
    };

    // Función para obtener el color del rol
    const getRoleColor = (idRol) => {
        switch (idRol) {
            case 1: return "error";
            case 2: return "primary";
            case 3: return "success";
            case 4: return "warning";
            default: return "default";
        }
    };

    // Filtrar usuarios según el texto de búsqueda
    const filteredUsers = users.filter((user) => {
        const searchLower = searchText.toLowerCase();
        return (
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower) ||
            user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower) ||
            getRoleName(user.idrol).toLowerCase().includes(searchLower)
        );
    });

    // Columnas para DataGrid
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            hide: isMobile || isTablet,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 500 }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: "image",
            headerName: "Avatar",
            width: 80,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const imageUrl = URL + params.row.image;
                const fullName = `${params.row.first_name || ""} ${params.row.last_name || ""}`.trim();
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Avatar
                            alt={fullName || "User Avatar"}
                            src={imageUrl || ""}
                            sx={{
                                width: { xs: 32, sm: 36, md: 40 },
                                height: { xs: 32, sm: 36, md: 40 },
                                fontSize: 14,
                                bgcolor: theme.palette.primary.main
                            }}
                        >
                            {!imageUrl && fullName ? fullName[0] : ""}
                        </Avatar>
                    </Box>
                );
            },
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 200,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'username',
            headerName: 'Usuario',
            flex: 0.8,
            minWidth: 150,
            hide: isMobile,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'first_name',
            headerName: 'Nombre',
            flex: 0.8,
            minWidth: 150,
            hide: isMobile || isTablet,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'last_name',
            headerName: 'Apellido',
            flex: 0.8,
            minWidth: 150,
            hide: isMobile || isTablet,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'idrol',
            headerName: 'Rol',
            width: 140,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Chip
                        label={getRoleName(params.value)}
                        color={getRoleColor(params.value)}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: 28
                        }}
                    />
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: isMobile ? 100 : 120,
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
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.lighter',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'error.lighter',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
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
                        ¿Estás seguro de que deseas eliminar este usuario?
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                            onClick={() => confirmDelete(id, closeToast)}
                            sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                px: 2,
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'error.dark',
                                }
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
                                '&:hover': {
                                    bgcolor: 'grey.600',
                                }
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

    // Lógica para confirmar la eliminación
    const confirmDelete = async (id, closeToast) => {
        await dispatch(deleteThunk(id));
        closeToast();
    };

    // Función para manejar la edición
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
            {filteredUsers.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    minHeight: 200
                }}>
                    <Typography variant="body1" color="text.secondary">
                        No se encontraron usuarios
                    </Typography>
                </Box>
            ) : (
                filteredUsers.map((user) => {
                    const imageUrl = URL + user.image;
                    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

                    return (
                        <Card
                            key={user.id}
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
                                {/* Header de la tarjeta con avatar y acciones */}
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            alt={fullName || "User Avatar"}
                                            src={imageUrl || ""}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: theme.palette.primary.main,
                                                fontSize: 24
                                            }}
                                        >
                                            {!imageUrl && fullName ? fullName[0] : ""}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
                                                {fullName || user.username}
                                            </Typography>
                                            <Chip
                                                label={getRoleName(user.idrol)}
                                                color={getRoleColor(user.idrol)}
                                                size="small"
                                                sx={{ mt: 0.5, fontSize: '0.7rem', height: 20 }}
                                            />
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton
                                            onClick={() => handleEdit(user)}
                                            color="primary"
                                            size="small"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(user.id)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ my: 1.5 }} />

                                {/* Información del usuario */}
                                <Stack spacing={1.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EmailIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                            {user.email}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PersonIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                            @{user.username}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <BadgeIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                            ID: {user.id}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })
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
            {/* Barra de búsqueda */}
            <Box sx={{ mb: 2, px: { xs: 2, sm: 0 }, pt: { xs: 2, sm: 0 } }}>
                <TextField
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    placeholder="Buscar por nombre, email, usuario o rol..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'background.paper'
                        }
                    }}
                />
            </Box>

            {/* Vista condicional: Tarjetas en móvil, Tabla en tablet/escritorio */}
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                {isMobile ? (
                    <MobileCardView />
                ) : (
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel },
                        }}
                        pageSizeOptions={[5, 10, 25, 50]}
                        disableRowSelectionOnClick
                        rowHeight={64}
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-cell': {
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                display: 'flex',
                                alignItems: 'center',
                                py: 0,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'primary.lighter',
                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                fontWeight: 700,
                                borderRadius: 0,
                                minHeight: '56px !important',
                                maxHeight: '56px !important',
                                lineHeight: '56px !important'
                            },
                            '& .MuiDataGrid-columnHeader': {
                                '&:focus': {
                                    outline: 'none'
                                },
                                '&:focus-within': {
                                    outline: 'none'
                                }
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 700,
                                fontSize: { xs: '0.8rem', sm: '0.9rem' }
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
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.lighter',
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    }
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
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none'
                            },
                            '& .MuiDataGrid-cell:focus-within': {
                                outline: 'none'
                            }
                        }}
                        localeText={{
                            noRowsLabel: 'No hay usuarios para mostrar',
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
