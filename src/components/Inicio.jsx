import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Inicio() {
  const slides = [
    {
      image: "https://www.juntadeandalucia.es/sites/default/files/2023-02/negativ.png",
    },
    {
      image: "https://eldiariorural.es/wp-content/uploads/2021/03/TC_5120-18102019-Barbecho-1000x540.jpg",
    },
    {
      image: "https://santamariadeguia.es/wp-content/uploads/2025/07/Las-actuaciones-incluyen-la-dotacion-de-alumbrado-fotovoltaico-en-zonas-rurales-del-municipio-777x437.jpeg",
    },
  ];

  const [index, setIndex] = useState(0);

  // Cambio automático cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Contenedor principal */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pt: 4,
          pb: 4,
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Bienvenido al registro de ordenanzas municipales
        </Typography>

        {/* Carrusel con imágenes */}
        <Box
          sx={{
            mt: 4,
            width: "90%",
            maxWidth: 1000,
            height: 400,
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {slides.map((slide, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "opacity 1s ease-in-out",
                opacity: i === index ? 1 : 0,
                p: 0,
              }}
            >
              {/* Imagen de fondo */}
              <Box
                component="img"
                src={slide.image}
                alt={slide.title || `Slide ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 3,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              />

              {/* Texto encima de la imagen (solo si existe) */}
              {(slide.title || slide.description) && (
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                >
                  {slide.title && (
                    <Typography variant="h4" gutterBottom>
                      {slide.title}
                    </Typography>
                  )}
                  {slide.description && (
                    <Typography variant="h6">{slide.description}</Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: "auto",
          backgroundColor: "#1976d2",
          color: "white",
          textAlign: "center",
        }}
      >
        © 2026 Registro Municipal. Todos los derechos reservados.
      </Box>
    </Box>
  );
}

export default Inicio;
