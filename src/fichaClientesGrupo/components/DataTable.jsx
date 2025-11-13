import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  TextField,
  Pagination,
  Stack,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";

import { useSelector } from "react-redux";

export function DataTable() {
  const { fichasClienteGrupo } = useSelector(
    (state) => state.fichaClienteGrupoStore
  );

  // =========================================
  // 🔎 Buscador principal
  // =========================================
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search.trim()) return fichasClienteGrupo;

    return fichasClienteGrupo.filter((c) =>
      c.cliente.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, fichasClienteGrupo]);

  // =========================================
  // 📄 Paginación principal
  // =========================================
  const pageOptions = [5, 10, 25, 50, "ALL"];
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const paginatedData = useMemo(() => {
    if (rowsPerPage === "ALL") return filteredData;
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredData]);

  // =========================================
  // 🔽 Expandir filas
  // =========================================
  const [expandedRow, setExpandedRow] = useState(null);

  const handleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Fichas de Clientes Agrupado
      </Typography>

      {/* BUSCADOR PRINCIPAL */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <SearchIcon sx={{ mr: 1, color: "gray" }} />
        <TextField
          label="Buscar cliente..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Box>

      {/* SELECT DE FILAS + CONTADOR DE REGISTROS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2">
          {rowsPerPage === "ALL"
            ? `Mostrando ${filteredData.length} de ${filteredData.length} clientes`
            : `Mostrando ${paginatedData.length} de ${filteredData.length} clientes`}
        </Typography>

        <TextField
          select
          size="small"
          label="Filas por página"
          SelectProps={{ native: true }}
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(e.target.value);
            setPage(1);
          }}
          sx={{ width: 160 }}
        >
          {pageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "ALL" ? "Todos" : opt}
            </option>
          ))}
        </TextField>
      </Box>

      {/* TABLA PRINCIPAL */}
      <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell />
              <TableCell>
                <strong>Cliente</strong>
              </TableCell>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <React.Fragment key={index}>
                {/* FILA PRINCIPAL */}
                <TableRow hover>
                  <TableCell width={60}>
                    <IconButton onClick={() => handleExpand(index)}>
                      {expandedRow === index ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>

                  <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                    {row.cliente}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: row.total < 0 ? "red" : "green",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(row.total)}
                  </TableCell>
                </TableRow>

                {/* FILA EXPANDIDA */}
                <TableRow>
                  <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
                    <Collapse
                      in={expandedRow === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <SubTables row={row} />
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN PRINCIPAL */}
      {rowsPerPage !== "ALL" && (
        <Stack direction="row" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
}

// =======================================================
// ⭐ SUBTABLAS: Movimientos + Cotizadores
// =======================================================
function SubTables({ row }) {
  const [activeTab, setActiveTab] = useState("movimientos");
  const pageOptions = [5, 10, 25, 50, "ALL"];

  // =======================================================
  // 🔎 MOVIMIENTOS
  // =======================================================
  const [searchMov, setSearchMov] = useState("");

  const filteredMov = useMemo(() => {
    return row.movimientos.filter(
      (m) =>
        m.tipo.toLowerCase().includes(searchMov.toLowerCase()) ||
        m.origen.toLowerCase().includes(searchMov.toLowerCase()) ||
        (m.observacion || "")
          .toLowerCase()
          .includes(searchMov.toLowerCase())
    );
  }, [searchMov, row.movimientos]);

  const [movPage, setMovPage] = useState(1);
  const [movPerPage, setMovPerPage] = useState(5);

  const paginatedMov = useMemo(() => {
    if (movPerPage === "ALL") return filteredMov;
    const start = (movPage - 1) * movPerPage;
    return filteredMov.slice(start, start + movPerPage);
  }, [filteredMov, movPage, movPerPage]);

  // =======================================================
  // 🔎 COTIZADORES
  // =======================================================
  const [searchCot, setSearchCot] = useState("");

  const filteredCot = useMemo(() => {
    return row.cotizador.filter((c) =>
      c.id.toString().includes(searchCot.trim())
    );
  }, [searchCot, row.cotizador]);

  const [cotPage, setCotPage] = useState(1);
  const [cotPerPage, setCotPerPage] = useState(5);

  const paginatedCot = useMemo(() => {
    if (cotPerPage === "ALL") return filteredCot;
    const start = (cotPage - 1) * cotPerPage;
    return filteredCot.slice(start, start + cotPerPage);
  }, [filteredCot, cotPage, cotPerPage]);

  return (
    <Card sx={{ m: 1 }}>
      <CardContent>
        {/* TABS */}
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ mb: 2 }}
        >
          <Tab label="Movimientos" value="movimientos" />
          <Tab label="Cotizadores" value="cotizador" />
        </Tabs>

        {/* ===================================================== */}
        {/* TAB: MOVIMIENTOS */}
        {/* ===================================================== */}
        {activeTab === "movimientos" && (
          <>
            {/* BUSCADOR + SELECT + CONTADOR */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                size="small"
                fullWidth
                label="Buscar movimiento..."
                value={searchMov}
                onChange={(e) => {
                  setSearchMov(e.target.value);
                  setMovPage(1);
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 260,
                  justifyContent: "flex-end",
                }}
              >
                <Typography variant="body2">
                  {movPerPage === "ALL"
                    ? `Movimientos: ${filteredMov.length}`
                    : `Mostrando ${paginatedMov.length} de ${filteredMov.length} movimientos`}
                </Typography>

                <TextField
                  select
                  size="small"
                  label="Filas"
                  SelectProps={{ native: true }}
                  value={movPerPage}
                  sx={{ width: 120 }}
                  onChange={(e) => {
                    setMovPerPage(e.target.value);
                    setMovPage(1);
                  }}
                >
                  {pageOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "ALL" ? "Todos" : o}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* TABLA MOVIMIENTOS */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Origen</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Observación</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Valor</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedMov.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: "16px" }}>{m.tipo}</TableCell>
                    <TableCell sx={{ fontSize: "16px" }}>{m.origen}</TableCell>
                    <TableCell sx={{ fontSize: "16px" }}>
                      {m.observacion}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: m.valor.includes("-") ? "red" : "green",
                      }}
                    >
                      {m.valor}
                    </TableCell>
                    <TableCell sx={{ fontSize: "16px" }}>
                      {(m.fecha ||
                        m.fecha_ingreso ||
                        m.fecha_transaccion ||
                        "")
                        .slice(0, 16)
                        .replace("T", " ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINACIÓN MOVIMIENTOS */}
            {movPerPage !== "ALL" && (
              <Stack direction="row" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(filteredMov.length / movPerPage)}
                  page={movPage}
                  onChange={(e, v) => setMovPage(v)}
                  color="primary"
                  size="large"
                />
              </Stack>
            )}
          </>
        )}

        {/* ===================================================== */}
        {/* TAB: COTIZADORES */}
        {/* ===================================================== */}
        {activeTab === "cotizador" && (
          <>
            {/* BUSCADOR + SELECT + CONTADOR */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                size="small"
                fullWidth
                label="Buscar cotizador..."
                value={searchCot}
                onChange={(e) => {
                  setSearchCot(e.target.value);
                  setCotPage(1);
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 260,
                  justifyContent: "flex-end",
                }}
              >
                <Typography variant="body2">
                  {cotPerPage === "ALL"
                    ? `Cotizadores: ${filteredCot.length}`
                    : `Mostrando ${paginatedCot.length} de ${filteredCot.length} cotizadores`}
                </Typography>

                <TextField
                  select
                  size="small"
                  label="Filas"
                  SelectProps={{ native: true }}
                  value={cotPerPage}
                  sx={{ width: 120 }}
                  onChange={(e) => {
                    setCotPerPage(e.target.value);
                    setCotPage(1);
                  }}
                >
                  {pageOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "ALL" ? "Todos" : o}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* TABLA COTIZADORES */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Precio Ley</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha Trámite</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCot.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: "16px" }}>{c.id}</TableCell>
                    <TableCell sx={{ fontSize: "16px" }}>
                      {c.precioDeLey}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "green",
                      }}
                    >
                      {c.total}
                    </TableCell>
                    <TableCell sx={{ fontSize: "16px" }}>
                      {c.fechaTramite?.slice(0, 16).replace("T", " ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINACIÓN COTIZADORES */}
            {cotPerPage !== "ALL" && (
              <Stack direction="row" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(filteredCot.length / cotPerPage)}
                  page={cotPage}
                  onChange={(e, v) => setCotPage(v)}
                  color="primary"
                  size="large"
                />
              </Stack>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
