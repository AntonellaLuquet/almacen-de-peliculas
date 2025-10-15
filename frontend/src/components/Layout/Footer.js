import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Componente Footer de la aplicación
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto">
      <Container>
        <Row>
          {/* Información de la empresa */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-film me-2"></i>
              Almacén de Películas
            </h5>
            <p className="text-muted">
              Tu tienda online de confianza para las mejores películas. 
              Encuentra los últimos estrenos y clásicos del cine.
            </p>
            <div className="social-links">
              <a href="#" className="me-3" aria-label="Facebook">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="#" className="me-3" aria-label="Twitter">
                <i className="bi bi-twitter fs-4"></i>
              </a>
              <a href="#" className="me-3" aria-label="Instagram">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="bi bi-youtube fs-4"></i>
              </a>
            </div>
          </Col>

          {/* Enlaces útiles */}
          <Col md={2} className="mb-4">
            <h5 className="fw-semibold mb-3">Enlaces</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo" className="text-decoration-none">
                  Catálogo
                </Link>
              </li>
              <li className="mb-2">
                <a href="#novedades" className="text-decoration-none">
                  Novedades
                </a>
              </li>
              <li className="mb-2">
                <a href="#ofertas" className="text-decoration-none">
                  Ofertas
                </a>
              </li>
            </ul>
          </Col>

          {/* Categorías */}
          <Col md={2} className="mb-4">
            <h5 className="fw-semibold mb-3">Géneros</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/catalogo?genero=Acción" className="text-decoration-none">
                  Acción
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo?genero=Comedia" className="text-decoration-none">
                  Comedia
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo?genero=Drama" className="text-decoration-none">
                  Drama
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo?genero=Terror" className="text-decoration-none">
                  Terror
                </Link>
              </li>
            </ul>
          </Col>

          {/* Información de contacto */}
          <Col md={4} className="mb-4">
            <h5 className="fw-semibold mb-3">Contacto</h5>
            <div className="contact-info">
              <p className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                <a href="mailto:info@almacenpeliculas.com" className="text-decoration-none">
                  info@almacenpeliculas.com
                </a>
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                <a href="tel:+34900123456" className="text-decoration-none">
                  +34 900 123 456
                </a>
              </p>
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                Calle del Cine, 123<br />
                28001 Madrid, España
              </p>
              <p className="mb-2">
                <i className="bi bi-clock me-2"></i>
                Lun-Vie: 9:00-18:00<br />
                Sáb-Dom: 10:00-14:00
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Footer bottom */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-2 mb-md-0 text-muted">
              © {currentYear} Almacén de Películas. Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="footer-links">
              <a href="#privacidad" className="text-decoration-none me-3">
                Política de Privacidad
              </a>
              <a href="#terminos" className="text-decoration-none me-3">
                Términos de Uso
              </a>
              <a href="#cookies" className="text-decoration-none">
                Cookies
              </a>
            </div>
          </Col>
        </Row>

        {/* Información adicional */}
        <Row className="mt-3">
          <Col className="text-center">
            <div className="payment-methods">
              <small className="text-muted me-3">Métodos de pago:</small>
              <i className="bi bi-credit-card me-2" title="Tarjetas de crédito"></i>
              <i className="bi bi-paypal me-2" title="PayPal"></i>
              <i className="bi bi-bank me-2" title="Transferencia bancaria"></i>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;