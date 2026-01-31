import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { Link } from "react-router";
import styles from "../css/Impresion.module.css";

function Navbar() {
  const [anchorMunicipiosMenu, setAnchorMunicipiosMenu] = React.useState(null);
  const [anchorOrdenanzasMenu, setAnchorOrdenanzasMenu] = React.useState(null);
  const [anchorMobileMenu, setAnchorMobileMenu] = React.useState(null);

  const handleOpenMunicipiosMenu = (event) => {
    setAnchorMunicipiosMenu(event.currentTarget);
  };

  const handleOpenOrdenanzasMenu = (event) => {
    setAnchorOrdenanzasMenu(event.currentTarget);
  };

  const handleOpenMobileMenu = (event) => {
    setAnchorMobileMenu(event.currentTarget);
  };

  const handleCloseMenus = () => {
    setAnchorMunicipiosMenu(null);
    setAnchorOrdenanzasMenu(null);
    setAnchorMobileMenu(null);
  };

  const linkStyle = { color: "black", textDecoration: "none" };

  return (
    <AppBar
      position="static"
      className={styles.noprint}
      sx={{ backgroundColor: "#2e7d32" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Menú hamburguesa (xs) */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleOpenMobileMenu}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorMobileMenu}
              open={Boolean(anchorMobileMenu)}
              onClose={handleCloseMenus}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <ListSubheader>Municipios</ListSubheader>

              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/new" style={linkStyle}>
                  Registro de municipios
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios" style={linkStyle}>
                  Listado de municipios
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/cards" style={linkStyle}>
                  Listado de tarjetas de municipios
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/filter" style={linkStyle}>
                  Municipios con filtros
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/graph" style={linkStyle}>
                  Gráficas de municipios
                </Link>
              </MenuItem>

              <Divider />

              <ListSubheader>Ordenanzas</ListSubheader>

              <MenuItem onClick={handleCloseMenus}>
                <Link to="/ordenanzas/new" style={linkStyle}>
                  Alta de ordenanzas
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/ordenanzas" style={linkStyle}>
                  Listado de ordenanzas
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/ordenanzas/filter" style={linkStyle}>
                  Ordenanzas con filtros
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo */}
          <RequestPageIcon />
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              mx: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ADMINISTRACIÓN LOCAL
          </Typography>

          {/* Menú desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button onClick={handleOpenMunicipiosMenu} sx={{ color: "white" }}>
              Municipios
            </Button>
            <Menu
              anchorEl={anchorMunicipiosMenu}
              open={Boolean(anchorMunicipiosMenu)}
              onClose={handleCloseMenus}
            >
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/new" style={linkStyle}>
                  Registro de municipios
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios" style={linkStyle}>
                  Listado de municipios
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/cards" style={linkStyle}>
                  Listado de tarjetas de municipios
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/filter" style={linkStyle}>
                  Municipios con filtros
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/municipios/graph" style={linkStyle}>
                  Gráficas de municipios
                </Link>
              </MenuItem>
            </Menu>

            <Button onClick={handleOpenOrdenanzasMenu} sx={{ color: "white" }}>
              Ordenanzas
            </Button>
            <Menu
              anchorEl={anchorOrdenanzasMenu}
              open={Boolean(anchorOrdenanzasMenu)}
              onClose={handleCloseMenus}
            >
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/ordenanzas/new" style={linkStyle}>
                  Nueva ordenanza
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/ordenanzas" style={linkStyle}>
                  Listado de ordenanzas
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenus}>
                <Link to="/ordenanzas/filter" style={linkStyle}>
                  Ordenanzas con filtros
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;