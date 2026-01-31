/**
 * @fileoverview Componente PDF para exportar listado de directores filtrados
 * 
 * Componente React-PDF que genera un documento PDF con tabla de directores.
 * Utiliza StyleSheet para estilizar la tabla con bordes, encabezados de color
 * y espaciado apropiado para presentación de datos.
 * 
 * @module components/ListadoDirectoresFiltroPDF
 * @requires @react-pdf/renderer
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

/**
 * Estilos para el documento PDF
 * Define página, tabla, encabezados y celdas con bordes y colores
 * @type {StyleSheet}
 */
const styles = StyleSheet.create({
  // Estilos de página: padding interno y tamaño de fuente base
  page: {
    padding: 20,
    fontSize: 10,
  },
  // Estilos del título: centrado, fuerte, con separación inferior
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  // Estilos de tabla: ancho completo, flexbox para filas
  table: {
    display: "table",
    width: "100%",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "#bfbfbf",
    marginTop: 20,
  },
  // Estilos de fila: dirección horizontal
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  // Estilos de encabezado: fondo gris, bordes, 25% ancho (4 columnas)
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
  },
  // Estilos de columna de datos: bordes, ancho proporcional
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 8,
  },
  // Estilos de celda: tamaño de fuente reducido para tabla
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 9,
  },
});

/**
 * Componente PDF para exportar listado de directores
 * 
 * Genera un documento PDF con tabla de 3 columnas:
 * - Nombre del director
 * - Fecha de nacimiento
 * - Biografía
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.data - Array de directores a mostrar en la tabla
 * @param {string} props.data[].name - Nombre del director
 * @param {string} props.data[].birth_date - Fecha de nacimiento (formato YYYY-MM-DD)
 * @param {string} props.data[].biography - Biografía del director
 * @returns {JSX.Element} Documento PDF con tabla de directores
 */
function ListadoDirectoresFiltroPDF({ data }) {
  return (
    // Documento PDF con página tamaño A4
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Título del documento PDF */}
        <View style={styles.title}>
          <Text>Listado de Directores</Text>
        </View>

        {/* Tabla principal */}
        <View style={styles.table}>
          {/* Fila de encabezados */}
          <View style={styles.tableRow}>
            {/* Columna: Nombre */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nombre</Text>
            </View>
            {/* Columna: Fecha de Nacimiento */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Fecha de Nacimiento</Text>
            </View>
            {/* Columna: Biografía */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Biografía</Text>
            </View>
            {/* Columna: Foto (comentada - no se utiliza actualmente) */}
            {/* <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Foto</Text>
            </View> */}
          </View>

          {/* Renderizar filas de datos para cada director */}
          {data.map((director, index) => (
            <View style={styles.tableRow} key={index}>
              {/* Celda: Nombre del director */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{director.name}</Text>
              </View>
              {/* Celda: Fecha de nacimiento del director */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{director.birth_date}</Text>
              </View>
              {/* Celda: Biografía del director */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {director.biography ? director.biography : ""}
                </Text>
              </View>
              {/* Celda: Foto (comentada - no se utiliza actualmente) */}
              {/* <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {director.photo_url ? "✓" : ""}
                </Text>
              </View> */}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default ListadoDirectoresFiltroPDF;
