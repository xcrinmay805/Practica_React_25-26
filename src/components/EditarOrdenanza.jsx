/**
 * @fileoverview Componente para editar una ordenanza existente
 *
 * Permite actualizar los datos de una ordenanza.
 * Carga los datos actuales, la lista de municipios y valida los campos.
 *
 * @module components/EditarOrdenanza
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
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

function EditarOrdenanza() {
  const navigate = useNavigate();
  const { id_ordenanza } = useParams();

  const [ordenanza, setOrdenanza] = useState({
    nombre: "",
    fecha_aprobacion: "",
    voto_favorable: "",
    vigente: true,
    id_municipio: "",
  });

  const [municipios, setMunicipios] = useState([]);

  const [isCamposValidos, setIsCamposValidos] = useState({
    nombre: true,
    fecha_aprobacion: true,
    voto_favorable: true,
    id_municipio: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  /* =========================
     Cargar municipios
  ========================= */
  useEffect(() => {
    async function fetchMunicipios() {
      try {
        const res = await api.get("/municipios/");
        setMunicipios(res.datos);
      } catch (error) {
        setDialogMessage(
          error.mensaje || "Error al cargar municipios"
        );
        setDialogSeverity("error");
        setOpenDialog(true);
      }
    }

    fetchMunicipios();
  }, []);

  /* =========================
     Cargar ordenanza actual
  ========================= */
  useEffect(() => {
    async function fetchOrdenanza() {
      try {
        const res = await api.get(`/ordenanzas/${id_ordenanza}`);
        setOrdenanza(res.datos);
      } catch (error) {
        setDialogMessage(
          error.mensaje || "Error al cargar la ordenanza"
        );
        setDialogSeverity("error");
        setOpenDialog(true);
      }
    }

    fetchOrdenanza();
  }, [id_ordenanza]);

  /* =========================
     Actualizar ordenanza
  ========================= */
  useEffect(() => {
    async function fetchUpdateOrdenanza() {
      try {
        await api.put(`/ordenanzas/${id_ordenanza}`, ordenanza);
        setDialogMessage("Ordenanza actualizada correctamente");
        setDialogSeverity("success");
        setOpenDialog(true);
      } catch (error) {
        setDialogMessage(
          error.mensaje || "Error al actualizar la ordenanza"
        );
        setDialogSeverity("error");
        setOpenDialog(true);
      }
      setIsUpdating(false);
    }

    if (isUpdating) fetchUpdateOrdenanza();
  }, [isUpdating]);

  function handleChange(e) {
    const { name, value } = e.target;
    setOrdenanza({ ...ordenanza, [name]: value });
  }

  function handleSubmit() {
    if (isUpdating) return;
    if (validarDatos()) setIsUpdating(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/ordenanzas");
  }

  function validarDatos() {
    let valido = true;
    let validacion = {
      nombre: true,
      fecha_aprobacion: true,
      voto_favorable: true,
      id_municipio: true,
    };

    if (ordenanza.nombre.length < 3) {
      validacion.nombre = false;
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

    if (!ordenanza.fecha_aprobacion) {
      validacion.fecha_aprobacion = false;
      valido = false;
    }

    if (!ordenanza.id_municipio) {
      validacion.id_municipio = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={9} md={7}>
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Editar ordenanza
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
                    "Debe tener al menos 3 caracteres"
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
                    value={
                      ordenanza.fecha_aprobacion
                        ? dayjs(ordenanza.fecha_aprobacion)
                        : null
                    }
                    onChange={(newValue) =>
                      setOrdenanza({
                        ...ordenanza,
                        fecha_aprobacion: newValue.format("YYYY-MM-DD"),
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
                  select
                  fullWidth
                  required
                  label="Municipio"
                  name="id_municipio"
                  value={ordenanza.id_municipio}
                  onChange={handleChange}
                  error={!isCamposValidos.id_municipio}
                >
                  <MenuItem value="">
                    <em>Seleccionar municipio</em>
                  </MenuItem>
                  {municipios.map((m) => (
                    <MenuItem
                      key={m.ido}
                      value={m.id}
                    >
                      {m.nombre}
                    </MenuItem>
                  ))}
                </TextField>
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
                  label="Vigente"
                />
              </Grid>

              <Grid item xs={12} textAlign="right">
                <Button variant="contained" onClick={handleSubmit}>
                  Guardar cambios
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogSeverity === "success" ? "Correcto" : "Error"}
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

export default EditarOrdenanza;