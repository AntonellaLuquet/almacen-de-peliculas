import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página 404 - No encontrada
 */
const NotFoundPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col lg={6}>
          <div className="empty-state py-5">
            {/* Icono grande */}
            <i className="bi bi-exclamation-triangle display-1 text-warning mb-4"></i>
            
            {/* Título principal */}
            <h1 className="display-4 fw-bold text-dark mb-3">
              404
            </h1>
            
            {/* Subtítulo */}
            <h2 className="h4 text-muted mb-4">
              Página no encontrada
            </h2>
            
            {/* Descripción */}
            <p className="lead text-muted mb-4">
              Lo sentimos, la página que buscas no existe o ha sido movida. 
              Verifica la URL o regresa a la página principal.
            </p>
            
            {/* Botones de acción */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button 
                as={Link} 
                to="/" 
                variant="primary" 
                size="lg"
                className="px-4"
              >
                <i className="bi bi-house me-2"></i>
                Ir al Inicio
              </Button>
              
              <Button 
                as={Link} 
                to="/catalogo" 
                variant="outline-primary" 
                size="lg"
                className="px-4"
              >
                <i className="bi bi-collection me-2"></i>
                Ver Catálogo
              </Button>
            </div>
            
            {/* Enlace adicional */}
            <div className="mt-4">
              <Button 
                variant="link" 
                onClick={() => window.history.back()}
                className="text-decoration-none"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver atrás
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Sección de ayuda */}
      <Row className="justify-content-center mt-5">
        <Col lg={8}>
          <div className="bg-light rounded p-4 text-center">
            <h4 className="mb-3">¿Necesitas ayuda?</h4>
            <p className="text-muted mb-3">
              Si crees que esto es un error o necesitas asistencia, 
              no dudes en contactarnos.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a 
                href="mailto:soporte@almacenpeliculas.com" 
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-envelope me-2"></i>
                Contactar Soporte
              </a>
              
              <a 
                href="tel:+34900123456" 
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-telephone me-2"></i>
                Llamar
              </a>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Enlaces útiles */}
      <Row className="justify-content-center mt-4">
        <Col lg={6}>
          <h5 className="text-center mb-3">Enlaces útiles:</h5>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-house me-1"></i>
              Inicio
            </Link>
            <Link to="/catalogo" className="text-decoration-none">
              <i className="bi bi-collection me-1"></i>
              Catálogo
            </Link>
            <Link to="/login" className="text-decoration-none">
              <i className="bi bi-box-arrow-in-right me-1"></i>
              Iniciar Sesión
            </Link>
            <Link to="/register" className="text-decoration-none">
              <i className="bi bi-person-plus me-1"></i>
              Registro
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;