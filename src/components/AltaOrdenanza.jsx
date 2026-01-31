/**
 * @fileoverview Componente para crear una nueva ordenanza
 *
 * Formulario para registrar una nueva ordenanza con validaciones.
 *
 * @module components/AltaOrdenanza
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";

import api from "../api";

function AltaOrdenanza() {
  const navigate = useNavigate();

  // Estado del formulario
  const [ordenanza, setOrdenanza] = useState({
    nombre: "",
    fecha_aprobacion: "",
    voto_favorable: "",
    vigente: true,
    municipio: "",
  });

  // Estado de validaciones
  const [isCamposValidos, setIsCamposValidos] = useState({
    nombre: true,
    fecha_aprobacion: true,
    voto_favorable: true,
    municipio: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  function handleChange(e) {
    setOrdenanza({ ...ordenanza, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (isUpdating) return;

    if (validarDatos()) {
      crearOrdenanza();
    }
  }

  async function crearOrdenanza() {
    try {
      setIsUpdating(true);
      const respuesta = await api.post("/ordenanzas/", ordenanza);
      setDialogMessage(respuesta.mensaje);
      setDialogSeverity("success");
    } catch (error) {
      setDialogMessage(
        error.mensaje || "Error al crear la ordenanza"
      );
      setDialogSeverity("error");
    } finally {
      setIsUpdating(false);
      setOpenDialog(true);
    }
  }

  function validarDatos() {
    let valido = true;
    let validacion = {
      nombre: true,
      fecha_aprobacion: true,
      voto_favorable: true,
      municipio: true,
    };

    if (ordenanza.nombre.length < 3) {
      validacion.nombre = false;
      valido = false;
    }

    if (!ordenanza.fecha_aprobacion) {
      validacion.fecha_aprobacion = false;
      valido = false;
    }

    if (
      ordenanza.voto_favorable === "" ||
      ordenanza.voto_favorable < 0 ||
      ordenanza.voto_favorable > 100
    ) {
      validacion.voto_favorable = false;
      valido = false;
    }

    if (!ordenanza.municipio) {
      validacion.municipio = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/");
  }

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={9} md={7}>
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Alta de ordenanza
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  name="nombre"
                  value={ordenanza.nombre}
                  onChange={handleChange}
                  error={!isCamposValidos.nombre}
                  helperText={
                    !isCamposValidos.nombre &&
                    "El nombre debe tener al menos 3 caracteres"
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    label="Fecha de aprobación"
                    minDate={dayjs("1800-01-01")}
                    maxDate={dayjs()}
                    value={
                      ordenanza.fecha_aprobacion
                        ? dayjs(ordenanza.fecha_aprobacion)
                        : null
                    }
                    onChange={(value) =>
                      setOrdenanza({
                        ...ordenanza,
                        fecha_aprobacion: value.format("YYYY-MM-DD"),
                      })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !isCamposValidos.fecha_aprobacion,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="% Votos a favor"
                  name="voto_favorable"
                  value={ordenanza.voto_favorable}
                  onChange={handleChange}
                  error={!isCamposValidos.voto_favorable}
                  helperText={
                    !isCamposValidos.voto_favorable &&
                    "Debe estar entre 0 y 100"
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Municipio"
                  name="municipio"
                  value={ordenanza.municipio}
                  onChange={handleChange}
                  error={!isCamposValidos.municipio}
                  helperText={
                    !isCamposValidos.municipio &&
                    "Debe indicar el municipio"
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ordenanza.vigente}
                      onChange={(e) =>
                        setOrdenanza({
                          ...ordenanza,
                          vigente: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Ordenanza vigente"
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isUpdating}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogSeverity === "success"
            ? "Operación correcta"
            : "Error"}
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

export default AltaOrdenanza;