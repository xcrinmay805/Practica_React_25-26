/**
 * @fileoverview Página de error global para manejar rutas no encontradas y errores
 * 
 * Este componente se renderiza cuando ocurre un error durante el enrutamiento o
 * cuando se accede a una ruta que no existe. Muestra un mensaje de error personalizado
 * con opción para volver a la página de inicio.
 * 
 * @module pages/ErrorPage
 * @requires react-router-dom
 * @requires @mui/material
 */

import { useNavigate, useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Typography, Button, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import notfound from "../assets/not-found.jpg";

/**
 * Componente de página de error
 * 
 * Características:
 * - Obtiene información del error usando useRouteError hook
 * - Muestra el error en la consola para debugging
 * - Renderiza fondo personalizado con imagen
 * - Proporciona botón para volver a la página de inicio
 * 
 * @component
 * @returns {JSX.Element} Página de error con información y navegación
 */
function ErrorPage() {
  // Hook para obtener información del error de la ruta
  const error = useRouteError();
  
  // Hook para navegar programáticamente
  const navigate = useNavigate();
  
  // Registrar error en consola para debugging
  console.error(error);

  return (
    <>
      {/* Barra de navegación */}
      <Navbar />
      
      {/* Contenedor con imagen de fondo */}
      <Box
        sx={{
          minHeight: "calc(100vh - 100px)",
          backgroundImage: `url(${notfound})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Contenedor del contenido de error */}
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mt:3 }}>
            {/* Título de error */}
            <Typography variant="h4" sx={{ mb:2, color: "black" }}>
              Lo sentimos, parece que ha ocurrido un error
            </Typography>
            
            {/* Detalles del error */}
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                p: 2,
                backgroundColor: "rgba(255, 107, 107, 0.2)",
                borderRadius: 2,
                border: "1px solid #ff6b6b",
              }}
            >
              <strong>{error.statusText || error.message}</strong>
            </Typography>
            
            {/* Botón para volver a inicio */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Volver a la página de inicio
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ErrorPage;
