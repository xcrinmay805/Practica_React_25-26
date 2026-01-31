/**
 * @fileoverview Componente que muestra gráfica de películas por director
 * 
 * Muestra un gráfico de pastel interactivo que visualiza la cantidad de películas
 * dirigidas por cada director. Utiliza la librería Recharts para la visualización.
 * 
 * @module components/GraficaDirectores
 * @requires react
 * @requires recharts
 * @requires @mui/material
 * @requires ../api
 */

import { useEffect, useState } from "react";
import { Pie, PieChart, Tooltip, Cell, Legend, Text, LabelList } from "recharts";

import api from "../api";
import { Typography } from "@mui/material";

/**
 * Componente que muestra gráfica de películas por director
 * 
 * Características:
 * - Obtiene datos de la API (/directors/graph)
 * - Muestra gráfico de pastel con colores variados
 * - Etiquetas con nombres de directores
 * - Tooltip interactivo al pasar el ratón
 * - Leyenda con directores
 * - Manejo de errores y estado vacío
 * 
 * @component
 * @returns {JSX.Element} Gráfico de pastel o mensajes de error/vacío
 */
function GraficaDirectores() {
  // Estado para almacenar los datos del gráfico
  const [datos, setDatos] = useState([]);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Paleta de 50 colores para los diferentes directores
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE",
    "#FF4567", "#32CD32", "#8B008B", "#FF1493", "#00FFFF",
    "#7FFF00", "#D2691E", "#DC143C", "#FFD700", "#ADFF2F",
    "#8A2BE2", "#FF6347", "#40E0D0", "#DA70D6", "#FF4500",
    "#1E90FF", "#3CB371", "#9932CC", "#FF8C00", "#66CDAA",
    "#B22222", "#FF00FF", "#FFDEAD", "#4B0082", "#20B2AA",
    "#E6E6FA", "#8B4513", "#48D1CC", "#FF69B4", "#CD5C5C",
    "#4682B4", "#EE82EE", "#FF7F50", "#9ACD32", "#BA55D3",
    "#6495ED", "#2E8B57", "#FFB6C1", "#DB7093", "#5F9EA0",
    "#FFDAB9", "#FF0000", "#8FBC8F", "#7B68EE", "#FA8072",
  ];

  /**
   * Efecto para cargar los datos del gráfico al montar el componente
   */
  useEffect(() => {
    async function fetchDirectores() {
      try {
        // Obtener datos de películas por director del backend
        const respuesta = await api.get("/directors/graph");

        // Actualizar estado con los datos obtenidos
        setDatos(respuesta.datos);
        setError(null);
      } catch (error) {
        // En caso de error, mostrar mensaje
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchDirectores();
  }, []);

  // Mostrar mensaje si hay error
  if (error != null) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      </>
    );
  }

  // Mostrar mensaje si no hay datos
  if (!datos || datos.length === 0) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          No hay datos disponibles
        </Typography>
      </>
    );
  }

  return (
    <>
      {/* Título del gráfico */}
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        Número de películas por director
      </Typography>
      
      {/* Gráfico de pastel */}
      <PieChart
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "80vh",
          aspectRatio: 1,
        }}
        responsive
      >
        {/* Título del gráfico */}
        <Text value="Peliculas por director" offset={70} position="outside" />
        
        {/* Componente Pie */}
        <Pie
          data={datos}
          dataKey="total"
          nameKey="id_director_director.name"
          cx="50%"
          cy="50%"
          innerRadius={20}
          outerRadius="50%"
          fill="#8884d8"
          isAnimationActive={true}
          label
          legendType="circle"
        >
          {/* Asignar colores a cada segmento */}
          {datos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          
          {/* Tooltip al pasar el ratón */}
          <Tooltip />
          
          {/* Etiquetas de directores */}
          <LabelList dataKey="id_director_director.name" offset={70} position="outside" />
        </Pie>
        
        {/* Leyenda del gráfico */}
        <Legend verticalAlign="top" height={50} />
      </PieChart>
    </>
  );
}

export default GraficaDirectores;
