/**
 * @fileoverview Página de layout principal que contiene la barra de navegación
 * 
 * Este es el componente de layout raíz que renderiza la barra de navegación (Navbar)
 * y un Outlet para mostrar las rutas anidadas. Se utiliza como padre de todas las
 * subrutas definidas en el router.
 * 
 * @module pages/Home
 * @requires react-router-dom
 * @requires ../components/Navbar
 */

import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

/**
 * Componente de layout Home
 * 
 * Renderiza la estructura base de la aplicación con:
 * - Navbar: Barra de navegación fija con menús de directores y películas
 * - Outlet: Área donde se renderizan las rutas anidadas
 * 
 * @component
 * @returns {JSX.Element} Estructura de layout con Navbar y Outlet
 */
function Home() {
  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  );
}

export default Home;
