import { Container, Row, Col } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  return (
    <footer className="bg-black text-white py-5">
      <Container>
        <Row className="mb-4">
          <Col md={3} className="mb-4 mb-md-0 text-center">
            <img
              src="/src/assets/logo1.png"
              alt="Logo"
              style={{ width: "200px", height: "auto" }}
            />
            <p className="mt-2 mb-3">
              Av. Cascanueces, Santa Anita 14923 Lima (Perú)
            </p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </Col>

          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3">CONTACTO</h5>
            <p>
              <i className="fab fa-whatsapp me-2"></i>+91 102-13-34
            </p>
            <p>
              <i className="far fa-envelope me-2"></i>libreria.lectum@gmail.com
            </p>
            <p>
              <i className="far fa-comment me-2"></i>
              <a href="#" className="text-white text-decoration-underline">
                Formulario de contacto
              </a>
            </p>
            <p>
              <i className="far fa-clock me-2"></i>Lunes a Sábado, de 8:00 a.m a
              10:00 p.m
            </p>
          </Col>

          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3">SERVICIO AL CLIENTE</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Políticas de envío
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Políticas de cookies
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5 className="mb-3">SOBRE NOSOTROS</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Nuestras Tiendas
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-underline">
                  Regístrate
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-top border-light" />

        <Row>
          <Col className="text-center">
            <small className="text-white">
              2025 © Library Lectum. Todos los Derechos Reservados | Grupo
              Tecsup
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
