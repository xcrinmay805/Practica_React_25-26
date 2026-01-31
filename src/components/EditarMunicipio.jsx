/**
 * @fileoverview Componente para editar un municipio existente
 *
 * Formulario para actualizar los datos de un municipio.
 * Carga los datos actuales del municipio y permite modificarlos
 * con las mismas validaciones que el formulario de alta.
 *
 * @module components/EditarMunicipio
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import api from "../api";

function EditarMunicipio() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estado del formulario
  const [municipio, setMunicipio] = useState({
    nombre: "",
    densidadPoblacion: "",
    fundacion: "",
    gobiernoCoalicion: "",
  });

  // Estado de validación
  const [isCamposValidos, setIsCamposValidos] = useState({
    nombre: true,
    Poblacion: true,
    fundacion: true,
    gobiernoCoalicion: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  /* =========================
     Cargar municipio actual
     ========================= */
  useEffect(() => {
    async function fetchMunicipio() {
      try {
        const respuesta = await api.get(`/municipios/${id}`);
        setMunicipio(respuesta.datos);
      } catch (error) {
        setDialogMessage(
          error.mensaje || "Error al recuperar los datos del municipio"
        );
        setDialogSeverity("error");
        setOpenDialog(true);
      }
    }

    fetchMunicipio();
  }, [id]);

  /* =========================
     Actualizar municipio
     ========================= */
  useEffect(() => {
    async function updateMunicipio() {
      try {
        await api.put(`/municipios/${id}`, municipio);
        setDialogMessage("Municipio actualizado correctamente");
        setDialogSeverity("success");
      } catch (error) {
        setDialogMessage(
          error.mensaje || "Error al actualizar el municipio"
        );
        setDialogSeverity("error");
      }
      setOpenDialog(true);
      setIsUpdating(false);
    }

    if (isUpdating) updateMunicipio();
  }, [isUpdating]);

  function handleChange(e) {
    setMunicipio({ ...municipio, [e.target.name]: e.target.value });
  }

  function validarDatos() {
    let valido = true;
    let validacion = {
      nombre: true,
      densidadPoblacion: true,
      fundacion: true,
      gobiernoCoalicion: true,
    };

    if (municipio.nombre.length < 4) {
      validacion.nombre = false;
      valido = false;
    }

    if (
      !municipio.densidadPoblacion ||
      isNaN(municipio.densidadPoblacion)
    ) {
      validacion.densidadPoblacion = false;
      valido = false;
    }

    if (!municipio.fundacion) {
      validacion.fundacion = false;
      valido = false;
    }

    if (municipio.gobiernoCoalicion === "") {
      validacion.gobiernoCoalicion = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

  function handleClick() {
    if (isUpdating) return;
    if (validarDatos()) setIsUpdating(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/municipios");
  }

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={9} md={7}>
          <Paper elevation={6} sx={{ mt: 3, p: 3 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Editar municipio
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {/* Nombre */}
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  name="nombre"
                  value={municipio.nombre}
                  onChange={handleChange}
                  error={!isCamposValidos.nombre}
                  helperText={
                    !isCamposValidos.nombre &&
                    "El nombre debe tener al menos 10 caracteres"
                  }
                />
              </Grid>

              {/* Densidad de población */}
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  required
                  label="Densidad de población"
                  name="densidadPoblacion"
                  type="number"
                  value={municipio.densidadPoblacion}
                  onChange={handleChange}
                  error={!isCamposValidos.densidadPoblacion}
                  helperText={
                    !isCamposValidos.densidadPoblacion &&
                    "Ingrese un número válido"
                  }
                />
              </Grid>

              {/* Fecha de fundación */}
              <Grid item xs={10}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    label="Fecha de fundación"
                    minDate={dayjs("1800-01-01")}
                    maxDate={dayjs()}
                    value={
                      municipio.fundacion
                        ? dayjs(municipio.fundacion)
                        : null
                    }
                    onChange={(value) =>
                      setMunicipio({
                        ...municipio,
                        fundacion: value.format("YYYY-MM-DD"),
                      })
                    }
                    slotProps={{
                      textField: {
                        required: true,
                        error: !isCamposValidos.fundacion,
                        helperText:
                          !isCamposValidos.fundacion &&
                          "La fecha es obligatoria",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Gobierno de coalición */}
              <Grid item xs={10}>
                <FormControl
                  fullWidth
                  required
                  error={!isCamposValidos.gobiernoCoalicion}
                >
                  <InputLabel>Gobierno de coalición</InputLabel>
                  <Select
                    name="gobiernoCoalicion"
                    value={municipio.gobiernoCoalicion}
                    label="Gobierno de coalición"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Sí</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Botón */}
              <Grid
                item
                xs={10}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={handleClick}
                >
                  Guardar cambios
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogSeverity === "success" ? "Operación correcta" : "Error"}
        </DialogTitle>
        <DialogContent>
          <Alert severity={dialogSeverity} variant="filled">
            {dialogMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditarMunicipio;