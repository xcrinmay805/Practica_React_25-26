/**
 * @fileoverview Listado de municipios con filtros avanzados
 *
 * Permite filtrar municipios por:
 * - Densidad de población mínima
 * - Rango de fecha de fundación
 *
 * Muestra resultados en tabla con opciones de editar, eliminar y descargar PDF.
 *
 * @module components/ListadoMunicipiosFiltroAvanzado
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
  Stack,
  Box,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import ClearIcon from "@mui/icons-material/Clear";

import { useNavigate } from "react-router-dom";
import api from "../api";
import generatePDF from "../utils/generatePDF";

function ListadoMunicipiosFiltroAvanzado() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  const [densidadMin, setDensidadMin] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const navigate = useNavigate();

  // Cargar municipios
  useEffect(() => {
    async function fetchMunicipios() {
      try {
        const respuesta = await api.get("/municipios");
        setDatos(respuesta.datos);
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchMunicipios();
  }, []);

  // Filtros avanzados
  const datosFiltrados = useMemo(() => {
    let resultado = datos;

    if (densidadMin) {
      resultado = resultado.filter(
        (m) => Number(m.densidadPoblacion) >= Number(densidadMin)
      );
    }

    if (fechaInicio) {
      resultado = resultado.filter(
        (m) => m.fundacion >= fechaInicio
      );
    }

    if (fechaFin) {
      resultado = resultado.filter(
        (m) => m.fundacion <= fechaFin
      );
    }

    return resultado;
  }, [datos, densidadMin, fechaInicio, fechaFin]);

  async function handleDelete(id) {
    try {
      await api.delete("/municipios/" + id);
      setDatos(datos.filter((m) => m.id_municipio !== id));
      setError(null);
    } catch (error) {
      setError(error.mensaje || "Error al eliminar el municipio");
    }
  }

  function limpiarFiltros() {
    setDensidadMin("");
    setFechaInicio("");
    setFechaFin("");
  }

  if (error) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de municipios con filtros avanzados
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtros
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Densidad mínima (hab/km²)"
                type="number"
                value={densidadMin}
                onChange={(e) => setDensidadMin(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha fundación desde"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha fundación hasta"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={limpiarFiltros}
                fullWidth
              >
                Limpiar filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mensaje sin resultados */}
      {datosFiltrados.length === 0 && (
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          No hay municipios que cumplan los filtros
        </Typography>
      )}

      {/* Tabla */}
      {datosFiltrados.length > 0 && (
        <Box id="pdf-content">
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">Fecha Fundación</TableCell>
                  <TableCell align="right">Densidad (hab/km²)</TableCell>
                  <TableCell align="right">Coalición</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {datosFiltrados.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell align="right">
                      {row.fundacion}
                    </TableCell>
                    <TableCell align="right">
                      {Number(row.densidadPoblacion).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {row.gobiernoCoalicion}
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(row.id)}
                        >
                          <DeleteIcon />
                        </Button>

                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate("/municipios/edit/" + row.id)
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
        </Box>
      )}

      {datosFiltrados.length > 0 && (
        <Fab
          color="secondary"
          aria-label="imprimir"
          onClick={() => generatePDF("pdf-content", "municipios_filtrados")}
          sx={{
            position: "fixed",
            top: 85,
            right: 20,
          }}
        >
          <PrintIcon />
        </Fab>
      )}
    </>
  );
}

export default ListadoMunicipiosFiltroAvanzado;