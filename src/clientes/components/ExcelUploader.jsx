import React, { useState, useRef, useEffect } from "react";
import {
    Grid,
    TextField,
    Button,
    IconButton,
    Typography,
    Box,
    Card,
    CardContent,
    Stack,
    Chip,
    useTheme,
    useMediaQuery,
    Divider
} from "@mui/material";
import * as XLSX from "xlsx";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";

import { addPreciosLeyThunks } from "../../store/clientesStore/clientesThunks";
import { useDispatch, useSelector } from "react-redux";

const ExcelUploader = () => {
    const { preciosLey: percio_ley } = useSelector((state) => state.clientesStore);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [preciosLey, setPreciosLey] = useState(percio_ley);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(addPreciosLeyThunks(preciosLey))
    }, [preciosLey])

    // Función para formatear valores como moneda colombiana
    const formatCurrency = (value) => {
        if (!value) return "";
        const number = value.toString().replace(/\./g, "");
        return new Intl.NumberFormat("es-CO").format(number);
    };

    // Función para actualizar valores en la lista con formato de moneda
    const handlePrecioLeyChange = (index, field, value) => {
        const formattedValue = field !== "descripcion" ? formatCurrency(value) : value;
        const updatedPreciosLey = preciosLey.map((precio, i) =>
            i === index ? { ...precio, [field]: formattedValue } : precio
        );
        setPreciosLey(updatedPreciosLey);
    };

    // Función para manejar la subida del archivo Excel
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file.name);

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = (e) => {
            const binaryData = e.target.result;
            const workbook = XLSX.read(binaryData, { type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const dataRows = jsonData.slice(1);

            const newPrecios = dataRows.map((row) => ({
                descripcion: row[0] || "",
                precio_ley: formatCurrency(row[1] || 0),
                comision: formatCurrency(row[2] || 0),
            }));

            setPreciosLey([...preciosLey, ...newPrecios]);
        };
    };

    // Función para eliminar el archivo seleccionado
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreciosLey([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Función para agregar un nuevo precio manualmente
    const handleAddPrecioLey = () => {
        setPreciosLey([
            ...preciosLey,
            { descripcion: "", precio_ley: "", comision: "" },
        ]);
    };

    // Función para eliminar un precio de la lista
    const removePrecioLey = (index) => {
        setPreciosLey(preciosLey.filter((_, i) => i !== index));
    };

    return (
        <Box>
            {/* Sección de carga de archivo */}
            <Box sx={{ mb: 3 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        id="excel-upload-input"
                    />
                    <label htmlFor="excel-upload-input" style={{ flexGrow: isMobile ? 1 : 0 }}>
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadFileIcon />}
                            fullWidth={isMobile}
                            sx={{
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                py: 1.5
                            }}
                        >
                            {isMobile ? 'Subir Excel' : 'Subir archivo Excel'}
                        </Button>
                    </label>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddPrecioLey}
                        startIcon={<AddCircleOutlineIcon />}
                        fullWidth={isMobile}
                        sx={{ py: 1.5 }}
                    >
                        Agregar Precio Manual
                    </Button>
                </Stack>

                {/* Muestra el nombre del archivo */}
                {selectedFile && (
                    <Box sx={{ mt: 2 }}>
                        <Chip
                            icon={<UploadFileIcon />}
                            label={selectedFile}
                            onDelete={handleRemoveFile}
                            color="success"
                            variant="outlined"
                            sx={{ maxWidth: '100%' }}
                        />
                    </Box>
                )}
            </Box>

            {/* Lista de precios */}
            {preciosLey.length > 0 && (
                <Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Precios agregados: {preciosLey.length}
                    </Typography>
                    <Stack spacing={2}>
                        {preciosLey.map((precio, index) => (
                            isMobile ? (
                                // Vista de tarjeta para móvil
                                <Card
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        borderLeft: `4px solid ${theme.palette.primary.main}`
                                    }}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Chip
                                                    label={`#${index + 1}`}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => removePrecioLey(index)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            <TextField
                                                fullWidth
                                                label="Descripción"
                                                value={precio.descripcion}
                                                onChange={(e) =>
                                                    handlePrecioLeyChange(index, "descripcion", e.target.value)
                                                }
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />
                                                }}
                                            />

                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Precio de Ley"
                                                    value={precio.precio_ley}
                                                    onChange={(e) =>
                                                        handlePrecioLeyChange(index, "precio_ley", e.target.value)
                                                    }
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <AttachMoneyIcon sx={{ color: 'success.main' }} />
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Comisión"
                                                    value={precio.comision}
                                                    onChange={(e) =>
                                                        handlePrecioLeyChange(index, "comision", e.target.value)
                                                    }
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <AttachMoneyIcon sx={{ color: 'info.main' }} />
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ) : (
                                // Vista de Grid para tablet/escritorio
                                <Grid container spacing={2} key={index} alignItems="center">
                                    <Grid item xs={12} sm={0.5}>
                                        <Chip
                                            label={index + 1}
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Descripción"
                                            value={precio.descripcion}
                                            onChange={(e) =>
                                                handlePrecioLeyChange(index, "descripcion", e.target.value)
                                            }
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3.5}>
                                        <TextField
                                            fullWidth
                                            label="Precio de Ley"
                                            value={precio.precio_ley}
                                            onChange={(e) =>
                                                handlePrecioLeyChange(index, "precio_ley", e.target.value)
                                            }
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Comisión"
                                            value={precio.comision}
                                            onChange={(e) =>
                                                handlePrecioLeyChange(index, "comision", e.target.value)
                                            }
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <IconButton
                                            color="error"
                                            onClick={() => removePrecioLey(index)}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'error.lighter',
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            )
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Mensaje cuando no hay precios */}
            {preciosLey.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 4,
                        px: 2,
                        backgroundColor: 'action.hover',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'divider'
                    }}
                >
                    <DescriptionIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        No hay precios agregados. Sube un archivo Excel o agrega manualmente.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ExcelUploader;
