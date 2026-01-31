/**
 * @fileoverview Componente para mostrar el listado de ordenanzas en una tabla
 *
 * Muestra todas las ordenanzas registradas en la base de datos.
 * Permite editar, eliminar y descargar los datos como PDF con timestamp.
 *
 * @module components/ListadoOrdenanzas
 */

import { useState, useEffect } from "react";
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
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";

import { useNavigate } from "react-router-dom";
import api from "../api";
import generatePDF from "../utils/generatePDF";

function ListadoOrdenanzas() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /* =========================
     Cargar ordenanzas
  ========================= */
  useEffect(() => {
    async function fetchOrdenanzas() {
      try {
        const respuesta = await api.get("/ordenanzas/");
        setDatos(respuesta.datos);
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchOrdenanzas();
  }, []);

  /* =========================
     Eliminar ordenanza
  ========================= */
  async function handleDelete(id_ordenanza) {
    try {
      await api.delete("/ordenanzas/" + id_ordenanza);

      const datos_nuevos = datos.filter(
        (ordenanza) => ordenanza.id_ordenanza !== id_ordenanza
      );

      setDatos(datos_nuevos);
      setError(null);
    } catch (error) {
      setError(error.mensaje || "Error al eliminar la ordenanza");
    }
  }

  /* =========================
     Estados de error / vacío
  ========================= */
  if (error) {
    return (
      <>
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Listado de ordenanzas
        </Typography>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      </>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        No hay ordenanzas disponibles
      </Typography>
    );
  }

  return (
    <>
      {/* Contenedor PDF */}
      <Box id="pdf-content">
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Listado de ordenanzas
        </Typography>

        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="ordenanzas table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="center">Fecha aprobación</TableCell>
                <TableCell align="center">% Votos a favor</TableCell>
                <TableCell align="center">Vigente</TableCell>
                <TableCell>Municipio</TableCell>
                <TableCell align="center" className="omitir-pdf">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.id_ordenanza}>
                  <TableCell>{row.nombre}</TableCell>

                  <TableCell align="center">
                    {row.fecha_aprobacion}
                  </TableCell>

                  <TableCell align="center">
                    {Number(row.voto_favorable).toFixed(2)} %
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

                  <TableCell className="omitir-pdf">
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.id_ordenanza)}
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
      </Box>

      {/* FAB PDF */}
      <Fab
        color="secondary"
        aria-label="imprimir"
        onClick={() =>
          generatePDF(
            "pdf-content",
            "ordenanzas-" +
              new Date()
                .toLocaleString("es-ES")
                .replace(":", "-")
                .replace(":", "-")
                .replace(", ", "_")
          )
        }
        sx={{
          position: "fixed",
          top: 85,
          right: 20,
        }}
      >
        <PrintIcon />
      </Fab>
    </>
  );
}

export default ListadoOrdenanzas;