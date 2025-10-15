import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de inicio de sesión
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la URL de redirección (si existe)
  const from = location.state?.from?.pathname || '/';

  /**
   * Redirigir si ya está autenticado
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  /**
   * Limpiar errores cuando cambie el formulario
   */
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors({});
  }, [formData]);

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Valida los campos del formulario
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return errors;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await login({
        email: formData.email.trim(),
        password: formData.password
      });
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <i className="bi bi-person-circle display-4 text-primary"></i>
                <h2 className="mt-3 mb-2">Iniciar Sesión</h2>
                <p className="text-muted">
                  Accede a tu cuenta para continuar comprando
                </p>
              </div>

              {/* Error general */}
              {error && (
                <Alert variant="danger" dismissible onClose={clearError}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-envelope me-2"></i>
                    Email *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    isInvalid={!!validationErrors.email}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>
                    Contraseña *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    isInvalid={!!validationErrors.password}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botón de envío */}
                <div className="d-grid mb-3">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </div>

                {/* Enlaces adicionales */}
                <div className="text-center">
                  <div className="mb-2">
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <p className="mb-0 text-muted">
                    ¿No tienes cuenta?{' '}
                    <Link 
                      to="/register" 
                      className="text-decoration-none fw-semibold"
                      state={{ from: location.state?.from }}
                    >
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Información adicional */}
          <div className="text-center mt-4">
            <p className="text-muted small">
              <i className="bi bi-shield-check me-1"></i>
              Tus datos están protegidos con encriptación SSL
            </p>
          </div>
        </Col>
      </Row>

      {/* Beneficios de tener cuenta */}
      <Row className="justify-content-center mt-5">
        <Col lg={8}>
          <div className="text-center">
            <h4 className="mb-4">¿Por qué crear una cuenta?</h4>
            <Row>
              <Col md={4} className="mb-3">
                <i className="bi bi-cart-check display-6 text-primary"></i>
                <h6 className="mt-2">Compras más rápidas</h6>
                <small className="text-muted">
                  Guarda tu información para compras futuras
                </small>
              </Col>
              <Col md={4} className="mb-3">
                <i className="bi bi-clock-history display-6 text-primary"></i>
                <h6 className="mt-2">Historial de pedidos</h6>
                <small className="text-muted">
                  Accede a todos tus pedidos anteriores
                </small>
              </Col>
              <Col md={4} className="mb-3">
                <i className="bi bi-heart display-6 text-primary"></i>
                <h6 className="mt-2">Lista de deseos</h6>
                <small className="text-muted">
                  Guarda tus películas favoritas para después
                </small>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;