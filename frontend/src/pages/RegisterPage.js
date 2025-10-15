import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de registro de usuarios
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigoPostal: '',
      pais: 'España'
    },
    acceptTerms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, isAuthenticated, error, clearError } = useAuth();
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
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('direccion.')) {
      const direccionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [direccionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  /**
   * Valida los campos del formulario
   */
  const validateForm = () => {
    const errors = {};

    // Nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Apellidos
    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    } else if (formData.apellidos.trim().length < 2) {
      errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    // Contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Confirmar contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Teléfono (opcional pero con formato)
    if (formData.telefono && !/^\+?[\d\s-()]{9,}$/.test(formData.telefono)) {
      errors.telefono = 'El teléfono no es válido';
    }

    // Fecha de nacimiento
    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        errors.fechaNacimiento = 'Debes tener al menos 13 años';
      }
    }

    // Dirección
    if (!formData.direccion.calle.trim()) {
      errors['direccion.calle'] = 'La calle es requerida';
    }
    if (!formData.direccion.ciudad.trim()) {
      errors['direccion.ciudad'] = 'La ciudad es requerida';
    }
    if (!formData.direccion.codigoPostal.trim()) {
      errors['direccion.codigoPostal'] = 'El código postal es requerido';
    } else if (!/^\d{5}$/.test(formData.direccion.codigoPostal)) {
      errors['direccion.codigoPostal'] = 'El código postal debe tener 5 dígitos';
    }

    // Términos y condiciones
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      
      // Preparar datos para el registro
      const registroData = {
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim(),
        password: formData.password,
        telefono: formData.telefono.trim() || null,
        fechaNacimiento: formData.fechaNacimiento,
        direccion: {
          calle: formData.direccion.calle.trim(),
          ciudad: formData.direccion.ciudad.trim(),
          codigoPostal: formData.direccion.codigoPostal.trim(),
          pais: formData.direccion.pais
        }
      };

      await register(registroData);
      setShowSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow">
            <Card.Body className="p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <i className="bi bi-person-plus display-4 text-primary"></i>
                <h2 className="mt-3 mb-2">Crear Cuenta</h2>
                <p className="text-muted">
                  Únete para acceder a todas nuestras películas
                </p>
              </div>

              {/* Mensaje de éxito */}
              {showSuccess && (
                <Alert variant="success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Registro exitoso! Redirigiendo...
                </Alert>
              )}

              {/* Error general */}
              {error && (
                <Alert variant="danger" dismissible onClose={clearError}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Información Personal */}
                  <Col md={6}>
                    <h5 className="mb-3">
                      <i className="bi bi-person me-2"></i>
                      Información Personal
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        isInvalid={!!validationErrors.nombre}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Apellidos *</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Tus apellidos"
                        isInvalid={!!validationErrors.apellidos}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.apellidos}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
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

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+34 600 000 000"
                        isInvalid={!!validationErrors.telefono}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.fechaNacimiento}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.fechaNacimiento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    {/* Seguridad */}
                    <h5 className="mb-3">
                      <i className="bi bi-shield-lock me-2"></i>
                      Seguridad
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        isInvalid={!!validationErrors.password}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar Contraseña *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                        isInvalid={!!validationErrors.confirmPassword}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Dirección */}
                    <h5 className="mb-3">
                      <i className="bi bi-geo-alt me-2"></i>
                      Dirección
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Calle *</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion.calle"
                        value={formData.direccion.calle}
                        onChange={handleChange}
                        placeholder="Calle y número"
                        isInvalid={!!validationErrors['direccion.calle']}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors['direccion.calle']}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col sm={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ciudad *</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion.ciudad"
                            value={formData.direccion.ciudad}
                            onChange={handleChange}
                            placeholder="Tu ciudad"
                            isInvalid={!!validationErrors['direccion.ciudad']}
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors['direccion.ciudad']}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>C.P. *</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion.codigoPostal"
                            value={formData.direccion.codigoPostal}
                            onChange={handleChange}
                            placeholder="28000"
                            maxLength={5}
                            isInvalid={!!validationErrors['direccion.codigoPostal']}
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors['direccion.codigoPostal']}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>País</Form.Label>
                      <Form.Select
                        name="direccion.pais"
                        value={formData.direccion.pais}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="España">España</option>
                        <option value="Francia">Francia</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Italia">Italia</option>
                        <option value="Alemania">Alemania</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Términos y condiciones */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    isInvalid={!!validationErrors.acceptTerms}
                    disabled={loading}
                    label={
                      <>
                        Acepto los{' '}
                        <Link to="/terms" target="_blank">
                          términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link to="/privacy" target="_blank">
                          política de privacidad
                        </Link>
                      </>
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.acceptTerms}
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
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>
                        Crear Cuenta
                      </>
                    )}
                  </Button>
                </div>

                {/* Enlaces adicionales */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <Link 
                      to="/login" 
                      className="text-decoration-none fw-semibold"
                      state={{ from: location.state?.from }}
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Información de seguridad */}
          <div className="text-center mt-4">
            <p className="text-muted small">
              <i className="bi bi-shield-check me-1"></i>
              Tus datos personales están protegidos y nunca serán compartidos con terceros
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;