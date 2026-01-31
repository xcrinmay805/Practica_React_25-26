/**
 * @fileoverview Punto de entrada principal de la aplicación React
 * 
 * Este archivo inicializa la aplicación React cargando:
 * - Estilos de fuente Roboto desde fontsource
 * - El componente raíz App
 * - Renderiza todo dentro de StrictMode para detección de problemas
 * 
 * @module main
 * @requires react
 * @requires react-dom
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Importar variantes de fuente Roboto para Material-UI
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App.jsx'

/**
 * Renderiza la aplicación React en el elemento HTML con id="root"
 * 
 * Utiliza StrictMode para ayudar a detectar problemas potenciales:
 * - Identifica componentes con ciclos de vida inseguros
 * - Advierte sobre legacy string ref API
 * - Advierte sobre uso de findDOMNode
 * - Detecta efectos secundarios inesperados
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
