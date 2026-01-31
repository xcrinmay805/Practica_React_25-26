/**
 * @fileoverview Componente raíz de la aplicación con configuración de enrutamiento
 */

import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Componentes principales
import Inicio from "./components/Inicio";

// Municipios
import ListadoMunicipios from "./components/ListadoMunicipios";
import AltaMunicipio from "./components/AltaMunicipio";
import EditarMunicipio from "./components/EditarMunicipio";
import ListadoCardsMunicipios from "./components/ListadoCardsMunicipios";
import ListadoMunicipiosFiltro from "./components/ListadoMunicipiosFiltro";
import GraficaMunicipios from "./components/GraficaMunicipios";

// Ordenanzas
import ListadoOrdenanzas from "./components/ListadoOrdenanzas";
import ListadoOrdenanzasFiltro from "./components/ListadoOrdenanzasFiltro";
import EditarOrdenanza from "./components/EditarOrdenanza";
import AltaOrdenanza from "./components/AltaOrdenanza";

// Layout
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <ErrorPage />,
    children: [
      // Inicio
      { index: true, Component: Inicio },

      // Municipios
      {
        path: "/municipios",
        element: <ListadoMunicipios />,
      },
      {
        path: "/municipios/cards",
        element: <ListadoCardsMunicipios />,
      },
      {
        path: "/municipios/filter",
        element: <ListadoMunicipiosFiltro />,
      },
      {
        path: "/municipios/graph",
        element: <GraficaMunicipios />,
      },
      {
        path: "/municipios/new",
        element: <AltaMunicipio />,
      },
      {
        path: "/municipios/edit/:id_municipio",
        element: <EditarMunicipio />,
      },

      // Ordenanzas
      {
        path: "/ordenanzas",
        element: <ListadoOrdenanzas />,
      },
      {
        path: "/ordenanzas/filter",
        element: <ListadoOrdenanzasFiltro />,
      },
      {
        path: "/ordenanzas/edit/:id_ordenanza",
        element: <EditarOrdenanza />,
      },
      {
        path: "/ordenanzas/new",
        element: <AltaOrdenanza />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;