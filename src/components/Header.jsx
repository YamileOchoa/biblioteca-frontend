// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Form, Navbar, Nav } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      {/* Navbar superior */}
      <Navbar
        expand="lg"
        style={{ backgroundColor: "#F2F7FF", height: "70px" }}
      >
        <Container
          fluid
          className="d-flex align-items-center justify-between px-5"
        >
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src="src/assets/logo.png" alt="Logo" height="40" />
          </Navbar.Brand>

          {/* Buscador */}
          <Form className="mx-auto w-50 position-relative">
            <Form.Control
              type="search"
              placeholder="Buscar por título del libro..."
              className="ps-3 pe-5 rounded-pill text-[12px]"
              aria-label="Buscar"
              style={{ fontFamily: "Montserrat", fontWeight: 400 }}
            />
            <i
              className="bi bi-search position-absolute"
              style={{
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#000",
              }}
            ></i>
          </Form>

          {/* Iconos lado derecho */}
          <div className="d-flex gap-4">
            {isLoggedIn ? (
              <>
                <div
                  className="d-flex flex-column align-items-center text-black text-[12px]"
                  onClick={() => navigate("/perfil")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <small>Mi perfil</small>
                </div>
                <div
                  className="d-flex flex-column align-items-center text-black text-[12px]"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-box-arrow-right fs-5"></i>
                  <small>Salir</small>
                </div>
              </>
            ) : (
              <div
                className="d-flex flex-column align-items-center text-black text-[12px]"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person fs-5"></i>
                <small>Inicia Sesión</small>
              </div>
            )}

            <div className="d-flex flex-column align-items-center text-black text-[12px]">
              <i className="bi bi-cart2 fs-5"></i>
              <small>Carrito</small>
            </div>
            <div className="d-flex flex-column align-items-center text-black text-[12px]">
              <i className="bi bi-geo-alt fs-5"></i>
              <small>Ubicación</small>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Navbar inferior */}
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid className="px-5">
          <Navbar.Toggle aria-controls="nav-links" />
          <Navbar.Collapse id="nav-links" className="justify-content-center">
            <Nav
              className="fw-semibold text-center"
              style={{ fontFamily: "Montserrat", columnGap: "80px" }}
            >
              <Nav.Link
                onClick={() => navigate("/")}
                style={{ fontSize: "12px", cursor: "pointer" }}
              >
                INICIO
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/mis-libros")}
                style={{ fontSize: "12px", cursor: "pointer" }}
              >
                MIS LIBROS
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/mis-prestamos")}
                style={{ fontSize: "12px", cursor: "pointer" }}
              >
                MIS PRÉSTAMOS
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/favoritos")}
                style={{ fontSize: "12px", cursor: "pointer" }}
              >
                FAVORITOS
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/ayuda")}
                style={{
                  fontSize: "12px",
                  color: "#1DB5BE",
                  cursor: "pointer",
                }}
              >
                AYUDA
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
