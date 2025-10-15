import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import usuarioService from '../services/usuarioService';

/**
 * Página de perfil de usuario
 */
const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  // Estados del formulario
  const [activeTab, setActiveTab] = useState('datos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Estados para datos personales
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    fechaNacimiento: user?.fechaNacimiento || ''
  });

  // Estados para dirección
  const [direccion, setDireccion] = useState({
    calle: user?.direccion?.calle || '',
    ciudad: user?.direccion?.ciudad || '',
    codigoPostal: user?.direccion?.codigoPostal || '',
    pais: user?.direccion?.pais || 'España'
  });

  // Estados para cambio de contraseña
  const [cambiarPassword, setCambiarPassword] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  });

  // Estados para el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  /**
   * Inicializa los datos del usuario
   */
  useEffect(() => {
    if (user) {
      setDatosPersonales({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fechaNacimiento: user.fechaNacimiento || ''
      });
      
      setDireccion({
        calle: user.direccion?.calle || '',
        ciudad: user.direccion?.ciudad || '',
        codigoPostal: user.direccion?.codigoPostal || '',
        pais: user.direccion?.pais || 'España'
      });
    }
  }, [user]);

  /**
   * Maneja cambios en datos personales
   */
  const handleDatosPersonalesChange = (e) => {
    const { name, value } = e.target;
    setDatosPersonales(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Maneja cambios en dirección
   */
  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccion(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Maneja cambios en contraseña
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setCambiarPassword(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Valida los datos personales
   */
  const validateDatosPersonales = () => {
    const errors = {};

    if (!datosPersonales.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!datosPersonales.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    
    if (!datosPersonales.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosPersonales.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (datosPersonales.telefono && !/^\+?[\d\s-()]{9,}$/.test(datosPersonales.telefono)) {
      errors.telefono = 'El teléfono no es válido';
    }
    
    if (datosPersonales.fechaNacimiento) {
      const birthDate = new Date(datosPersonales.fechaNacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        errors.fechaNacimiento = 'Debes tener al menos 13 años';
      }
    }

    return errors;
  };

  /**
   * Valida la dirección
   */
  const validateDireccion = () => {
    const errors = {};

    if (!direccion.calle.trim()) {
      errors.calle = 'La dirección es requerida';
    }
    
    if (!direccion.ciudad.trim()) {
      errors.ciudad = 'La ciudad es requerida';
    }
    
    if (!direccion.codigoPostal.trim()) {
      errors.codigoPostal = 'El código postal es requerido';
    } else if (!/^\d{5}$/.test(direccion.codigoPostal)) {
      errors.codigoPostal = 'El código postal debe tener 5 dígitos';
    }

    return errors;
  };

  /**
   * Valida el cambio de contraseña
   */
  const validatePassword = () => {
    const errors = {};

    if (!cambiarPassword.passwordActual) {
      errors.passwordActual = 'La contraseña actual es requerida';
    }
    
    if (!cambiarPassword.passwordNuevo) {
      errors.passwordNuevo = 'La nueva contraseña es requerida';
    } else if (cambiarPassword.passwordNuevo.length < 6) {
      errors.passwordNuevo = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(cambiarPassword.passwordNuevo)) {
      errors.passwordNuevo = 'La contraseña debe contener mayúsculas, minúsculas y números';
    }
    
    if (cambiarPassword.passwordNuevo !== cambiarPassword.confirmarPassword) {
      errors.confirmarPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  /**
   * Guarda los datos personales
   */
  const handleSaveDatosPersonales = async () => {
    const errors = validateDatosPersonales();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await usuarioService.actualizarPerfil({
        ...datosPersonales,
        direccion: user?.direccion
      });
      
      await updateProfile(updatedUser);
      setSuccess('Datos personales actualizados correctamente');
      
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      setError(error.response?.data?.message || 'Error al actualizar los datos personales');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guarda la dirección
   */
  const handleSaveDireccion = async () => {
    const errors = validateDireccion();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await usuarioService.actualizarPerfil({
        ...datosPersonales,
        direccion
      });
      
      await updateProfile(updatedUser);
      setSuccess('Dirección actualizada correctamente');
      
    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      setError(error.response?.data?.message || 'Error al actualizar la dirección');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia la contraseña
   */
  const handleChangePassword = async () => {
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await usuarioService.cambiarPassword({
        passwordActual: cambiarPassword.passwordActual,
        passwordNuevo: cambiarPassword.passwordNuevo
      });
      
      setCambiarPassword({
        passwordActual: '',
        passwordNuevo: '',
        confirmarPassword: ''
      });
      
      setSuccess('Contraseña cambiada correctamente');
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina la cuenta del usuario
   */
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      
      await usuarioService.eliminarCuenta();
      
      // Aquí deberías hacer logout y redirigir
      // logout();
      // navigate('/');
      
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      setError(error.response?.data?.message || 'Error al eliminar la cuenta');
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  /**
   * Limpia mensajes después de un tiempo
   */
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-person-circle me-2"></i>
            Mi Perfil
          </h2>
          <p className="text-muted">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </Col>
      </Row>

      {/* Mensajes globales */}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Row>
        {/* Información del usuario */}
        <Col lg={3} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="bi bi-person-circle display-1 text-primary"></i>
              </div>
              <h5>{user?.nombre} {user?.apellidos}</h5>
              <p className="text-muted mb-2">{user?.email}</p>
              <p className="small text-muted">
                <i className="bi bi-calendar me-1"></i>
                Miembro desde {new Date(user?.fechaCreacion).toLocaleDateString()}
              </p>
              <div className="mt-3">
                <span className={`badge bg-${user?.activo ? 'success' : 'secondary'}`}>
                  {user?.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Formularios de configuración */}
        <Col lg={9}>
          <Card>
            <Card.Header>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="card-header-tabs"
              >
                <Tab eventKey="datos" title={
                  <>
                    <i className="bi bi-person me-2"></i>
                    Datos Personales
                  </>
                }>
                </Tab>
                <Tab eventKey="direccion" title={
                  <>
                    <i className="bi bi-geo-alt me-2"></i>
                    Dirección
                  </>
                }>
                </Tab>
                <Tab eventKey="seguridad" title={
                  <>
                    <i className="bi bi-shield-lock me-2"></i>
                    Seguridad
                  </>
                }>
                </Tab>
                <Tab eventKey="configuracion" title={
                  <>
                    <i className="bi bi-gear me-2"></i>
                    Configuración
                  </>
                }>
                </Tab>
              </Tabs>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Tab: Datos Personales */}
              {activeTab === 'datos' && (
                <div>
                  <h5 className="mb-3">Información Personal</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={datosPersonales.nombre}
                          onChange={handleDatosPersonalesChange}
                          isInvalid={!!validationErrors.nombre}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.nombre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Apellidos *</Form.Label>
                        <Form.Control
                          type="text"
                          name="apellidos"
                          value={datosPersonales.apellidos}
                          onChange={handleDatosPersonalesChange}
                          isInvalid={!!validationErrors.apellidos}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.apellidos}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={datosPersonales.email}
                          onChange={handleDatosPersonalesChange}
                          isInvalid={!!validationErrors.email}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telefono"
                          value={datosPersonales.telefono}
                          onChange={handleDatosPersonalesChange}
                          isInvalid={!!validationErrors.telefono}
                          disabled={loading}
                          placeholder="+34 600 000 000"
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.telefono}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaNacimiento"
                          value={datosPersonales.fechaNacimiento}
                          onChange={handleDatosPersonalesChange}
                          isInvalid={!!validationErrors.fechaNacimiento}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.fechaNacimiento}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      onClick={handleSaveDatosPersonales}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-2"></i>
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: Dirección */}
              {activeTab === 'direccion' && (
                <div>
                  <h5 className="mb-3">Dirección de Envío</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección Completa *</Form.Label>
                    <Form.Control
                      type="text"
                      name="calle"
                      value={direccion.calle}
                      onChange={handleDireccionChange}
                      placeholder="Calle, número, piso, departamento"
                      isInvalid={!!validationErrors.calle}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.calle}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ciudad *</Form.Label>
                        <Form.Control
                          type="text"
                          name="ciudad"
                          value={direccion.ciudad}
                          onChange={handleDireccionChange}
                          isInvalid={!!validationErrors.ciudad}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.ciudad}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Código Postal *</Form.Label>
                        <Form.Control
                          type="text"
                          name="codigoPostal"
                          value={direccion.codigoPostal}
                          onChange={handleDireccionChange}
                          isInvalid={!!validationErrors.codigoPostal}
                          disabled={loading}
                          maxLength={5}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.codigoPostal}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>País</Form.Label>
                        <Form.Select
                          name="pais"
                          value={direccion.pais}
                          onChange={handleDireccionChange}
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

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      onClick={handleSaveDireccion}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-2"></i>
                          Guardar Dirección
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'seguridad' && (
                <div>
                  <h5 className="mb-3">Cambiar Contraseña</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña Actual *</Form.Label>
                        <Form.Control
                          type="password"
                          name="passwordActual"
                          value={cambiarPassword.passwordActual}
                          onChange={handlePasswordChange}
                          isInvalid={!!validationErrors.passwordActual}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.passwordActual}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nueva Contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="passwordNuevo"
                          value={cambiarPassword.passwordNuevo}
                          onChange={handlePasswordChange}
                          isInvalid={!!validationErrors.passwordNuevo}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.passwordNuevo}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar Nueva Contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmarPassword"
                          value={cambiarPassword.confirmarPassword}
                          onChange={handlePasswordChange}
                          isInvalid={!!validationErrors.confirmarPassword}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.confirmarPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="alert alert-info small">
                    <i className="bi bi-info-circle me-2"></i>
                    La contraseña debe tener al menos 6 caracteres e incluir mayúsculas, minúsculas y números.
                  </div>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Cambiando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-key me-2"></i>
                          Cambiar Contraseña
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: Configuración */}
              {activeTab === 'configuracion' && (
                <div>
                  <h5 className="mb-4">Configuración de Cuenta</h5>
                  
                  {/* Zona de peligro */}
                  <Card className="border-danger">
                    <Card.Header className="bg-danger text-white">
                      <h6 className="mb-0">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Zona de Peligro
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <h6>Eliminar Cuenta</h6>
                      <p className="text-muted">
                        Una vez que elimines tu cuenta, no habrá vuelta atrás. 
                        Por favor, asegúrate de estar seguro.
                      </p>
                      <Button 
                        variant="outline-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Eliminar mi cuenta
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmación para eliminar cuenta */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-danger me-2"></i>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>¿Estás seguro de que quieres eliminar tu cuenta?</strong></p>
          <p className="text-muted">
            Esta acción no se puede deshacer. Se eliminarán permanentemente:
          </p>
          <ul className="text-muted">
            <li>Todos tus datos personales</li>
            <li>Tu historial de compras</li>
            <li>Preferencias y configuraciones</li>
          </ul>
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle me-2"></i>
            <strong>Esta acción es irreversible.</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deletingAccount}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
          >
            {deletingAccount ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Eliminando...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Sí, eliminar mi cuenta
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;