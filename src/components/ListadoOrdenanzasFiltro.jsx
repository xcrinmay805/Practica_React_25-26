/**
 * @fileoverview Componente para mostrar ordenanzas con filtros
 *
 * Permite filtrar ordenanzas por:
 * - Vigencia
 * - Fecha de aprobación
 * - Municipio (obtenido desde API)
 *
 * Muestra resultados en tabla con opciones de editar, eliminar y descargar PDF.
 */

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Fab,
  Box,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";

import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import api from "../api";
import ListadoOrdenanzasFiltroPDF from "./ListadoOrdenanzasFiltroPDF";

function ListadoOrdenanzasFiltro() {
  const [datos, setDatos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [error, setError] = useState(null);

  const [filtroVigente, setFiltroVigente] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroMunicipio, setFiltroMunicipio] = useState("");

  const navigate = useNavigate();

  /* =========================
     Carga inicial
  ========================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const respuestaOrdenanzas = await api.get("/ordenanzas/");
        const respuestaMunicipios = await api.get("/municipios/");

        setDatos(respuestaOrdenanzas.datos);
        setMunicipios(respuestaMunicipios.datos);
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchData();
  }, []);

  /* =========================
     Filtros con useMemo
  ========================= */
  const datosFiltrados = useMemo(() => {
    let resultados = datos;

    // Filtro por vigencia
    if (filtroVigente !== "") {
      const vigenteBool = filtroVigente === "true";
      resultados = resultados.filter(
        (ordenanza) => ordenanza.vigente === vigenteBool
      );
    }

    // Filtro por fecha de aprobación
    if (filtroFecha) {
      resultados = resultados.filter(
        (ordenanza) => ordenanza.fecha_aprobacion >= filtroFecha
      );
    }

    // Filtro por municipio
    if (filtroMunicipio) {
      resultados = resultados.filter(
        (ordenanza) => ordenanza.municipio_id == filtroMunicipio
      );
    }

    return resultados;
  }, [datos, filtroVigente, filtroFecha, filtroMunicipio]);

  /* =========================
     Eliminar ordenanza
  ========================= */
  async function handleDelete(id_ordenanza) {
    try {
      await api.delete("/ordenanzas/" + id_ordenanza);
      setDatos(
        datos.filter(
          (ordenanza) => ordenanza.id_ordenanza !== id_ordenanza
        )
      );
    } catch (error) {
      setError(error.mensaje || "Error al eliminar la ordenanza");
    }
  }

  function limpiarFiltros() {
    setFiltroVigente("");
    setFiltroFecha("");
    setFiltroMunicipio("");
  }

  /* =========================
     Error
  ========================= */
  if (error) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 3 }}>
        Listado de ordenanzas con filtros
      </Typography>

      {/* =========================
          Tarjeta de filtros
      ========================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtros
          </Typography>

          <Grid container spacing={2}>
            {/* Vigencia */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Vigencia"
                value={filtroVigente}
                onChange={(e) => setFiltroVigente(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>Todas</em>
                </MenuItem>
                <MenuItem value="true">Vigentes</MenuItem>
                <MenuItem value="false">No vigentes</MenuItem>
              </TextField>
            </Grid>

            {/* Fecha aprobación */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                label="Fecha aprobación desde"
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            {/* Municipio */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Municipio"
                value={filtroMunicipio}
                onChange={(e) => setFiltroMunicipio(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>Todos los municipios</em>
                </MenuItem>
                {municipios.map((municipio) => (
                  <MenuItem
                    key={municipio.id_municipio}
                    value={municipio.id_municipio}
                  >
                    {municipio.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Limpiar */}
            <Grid item size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<ClearIcon />}
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =========================
          Sin resultados
      ========================= */}
      {datosFiltrados.length === 0 && (
        <Typography variant="h5" align="center">
          No hay ordenanzas disponibles
        </Typography>
      )}

      {/* =========================
          Tabla
      ========================= */}
      {datosFiltrados.length > 0 && (
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="center">Fecha aprobación</TableCell>
                <TableCell align="center">% votos</TableCell>
                <TableCell align="center">Vigente</TableCell>
                <TableCell>Municipio</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datosFiltrados.map((row) => (
                <TableRow key={row.id_ordenanza}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell align="center">
                    {row.fecha_aprobacion}
                  </TableCell>
                  <TableCell align="center">
                    {row.voto_favorable} %
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.vigente ? "Sí" : "No"}
                      color={row.vigente ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {row.municipio?.nombre || "—"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleDelete(row.id_ordenanza)
                        }
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate(
                            "/ordenanzas/edit/" + row.id_ordenanza
                          )
                        }
                      >
                        <EditIcon />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* =========================
          PDF
      ========================= */}
      {datosFiltrados.length > 0 && (
        <Fab sx={{ position: "fixed", top: 85, right: 20 }}>
          <PDFDownloadLink
            document={
              <ListadoOrdenanzasFiltroPDF data={datosFiltrados} />
            }
            fileName="ordenanzas.pdf"
          >
            {({ loading }) =>
              loading ? "..." : <DownloadIcon />
            }
          </PDFDownloadLink>
        </Fab>
      )}
    </>
  );
}

export default ListadoOrdenanzasFiltro;