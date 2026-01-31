/**
 * @fileoverview Componente para mostrar el listado de municipios en una tabla
 *
 * Muestra todos los municipios registrados en la base de datos en formato tabla.
 * Permite editar, eliminar y descargar los datos como PDF.
 *
 * @module components/ListadoMunicipios
 */

import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import Fab from "@mui/material/Fab";
import { Stack, Box } from "@mui/material";

import api from "../api";
import { useNavigate } from "react-router-dom";
import generatePDF from "../utils/generatePDF";

function ListadoMunicipios() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

  async function handleDelete(id) {
    try {
      await api.delete("/municipios/" + id);

      const datos_nuevos = datos.filter(
        (municipio) => municipio.id_municipio !== id
      );

      setDatos(datos_nuevos);
      setError(null);
    } catch (error) {
      setError(error.mensaje || "Error al eliminar el municipio");
    }
  }

  if (error) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        No hay municipios disponibles
      </Typography>
    );
  }

  return (
    <>
      <Box id="pdf-content">
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Listado de municipios
        </Typography>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Fecha Fundación</TableCell>
                <TableCell align="right">Densidad (hab/km²)</TableCell>
                <TableCell align="right">Coalicion</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell align="right">{row.fundacion}</TableCell>
                  <TableCell align="right">
                    {Number(row.densidadPoblacion).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{row.gobiernoCoalicion}</TableCell>
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

      <Fab
        color="secondary"
        aria-label="imprimir"
        onClick={() => generatePDF("pdf-content", "municipios")}
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

export default ListadoMunicipios;