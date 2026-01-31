import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function AltaMunicipio() {
  const navigate = useNavigate();

  const [municipio, setMunicipio] = useState({
    nombre: "",
    densidadPoblacion: "",
    fundacion: "",
    gobiernoCoalicion: "",
  });

  const [isCamposValidos, setIsCamposValidos] = useState({
    nombre: true,
    densidadPoblacion: true,
    fundacion: true,
    gobiernoCoalicion: true,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  function handleChange(e) {
    setMunicipio({ ...municipio, [e.target.name]: e.target.value });
  }

  function validarDatos() {
    let valido = true;
    const validacion = {
      nombre: true,
      densidadPoblacion: true,
      fundacion: true,
      gobiernoCoalicion: true,
    };

    if (!municipio.nombre || municipio.nombre.length < 3) {
      validacion.nombre = false;
      valido = false;
    }

    if (!municipio.densidadPoblacion || isNaN(municipio.densidadPoblacion)) {
      validacion.densidadPoblacion = false;
      valido = false;
    }

    if (!municipio.fundacion || !dayjs(municipio.fundacion).isValid()) {
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

  async function handleClick() {
  if (!validarDatos()) return;

  try {
    const payload = {
      nombre: municipio.nombre,
      densidadPoblacion: Number(municipio.densidadPoblacion),
      fundacion: municipio.fundacion,
      gobiernoCoalicion: municipio.gobiernoCoalicion === "true",
    };

    const respuesta = await api.post("/municipios/", payload);

    setDialogMessage(respuesta.data.mensaje);
    setDialogSeverity("success");
    setOpenDialog(true);
  } catch (err) {
    setDialogMessage(err.response?.data?.mensaje || "Error interno");
    setDialogSeverity("error");
    setOpenDialog(true);
  }
}


  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/");
  }

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={9} md={7}>
          <Paper elevation={6} sx={{ mt: 3, p: 3 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Alta de municipio
            </Typography>

            <Grid container spacing={2} justifyContent="center">
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
                    "El nombre debe tener al menos 3 caracteres"
                  }
                />
              </Grid>

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

              <Grid item xs={10}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha de fundación"
                    minDate={dayjs("1800-01-01")}
                    maxDate={dayjs()}
                    value={
                      municipio.fundacion
                        ? dayjs(municipio.fundacion)
                        : null
                    }
                    onChange={(value) => {
                      if (value && value.isValid()) {
                        setMunicipio({
                          ...municipio,
                          fundacion: value.format("YYYY-MM-DD"),
                        });
                      } else {
                        setMunicipio({ ...municipio, fundacion: "" });
                      }
                    }}
                    slotProps={{
                      textField: {
                        required: true,
                        error: !isCamposValidos.fundacion,
                        helperText:
                          !isCamposValidos.fundacion &&
                          "Fecha inválida u obligatoria",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

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
                    <MenuItem value="true">Sí</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={10} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" sx={{ mt: 3 }} onClick={handleClick}>
                  Aceptar
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

export default AltaMunicipio;
