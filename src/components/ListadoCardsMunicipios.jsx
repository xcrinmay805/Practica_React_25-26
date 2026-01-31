/**
 * @fileoverview Componente que muestra municipios en tarjetas personalizadas
 *
 * Alternativa visual al listado en tabla. Muestra municipios como tarjetas con
 * nombre, fecha de fundación, densidad de población y si existe gobierno de coalición.
 *
 * @module components/ListadoCardsMunicipios
 */

import { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Stack,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import HandshakeIcon from "@mui/icons-material/Handshake";

import { Link } from "react-router-dom";
import api from "../api";
import styles from "../css/Impresion.module.css";

function ListadoCardsMunicipios() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

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
      setDatos(datos.filter((m) => m.id !== id));
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
      {/* Título */}
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de municipios
      </Typography>

      {/* Grid de tarjetas */}
      <Grid container spacing={2}>
        {datos.map((row) => (
          <Grid
            key={row.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent>
                {/* Nombre + fecha */}
                <Typography variant="h6">
                  {row.nombre}{" "}
                  <Typography component="span" variant="caption">
                    ({row.fundacion})
                  </Typography>
                </Typography>

                {/* Densidad */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Densidad:{" "}
                  <strong>
                    {Number(row.densidadPoblacion).toFixed(2)} hab/km²
                  </strong>
                </Typography>

                {/* Gobierno de coalición */}
                {row.gobiernoCoalicion && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <HandshakeIcon color="primary" />
                    <Typography variant="body2">
                      Gobierno de coalición
                    </Typography>
                  </Stack>
                )}
              </CardContent>

              {/* Acciones */}
              <CardActions sx={{ mt: "auto" }}>
                <Link to={`/municipios/edit/${row.id}`}>
                  <Button size="small" startIcon={<EditIcon />}>
                    Editar
                  </Button>
                </Link>

                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(row.id)}
                >
                  Borrar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón imprimir */}
      <Fab
        className={styles.noprint}
        color="secondary"
        aria-label="imprimir"
        onClick={() => window.print()}
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

export default ListadoCardsMunicipios;