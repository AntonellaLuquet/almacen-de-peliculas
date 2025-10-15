import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import mercadoPagoService from '../services/payment/mercadoPagoService';

/**
 * Página de checkout con integración de Mercado Pago
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, impuestos, total, totalItems, createOrder, loading: cartLoading } = useCart();

  // Estados del formulario
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: {
      calle: user?.direccion?.calle || '',
      ciudad: user?.direccion?.ciudad || '',
      codigoPostal: user?.direccion?.codigoPostal || '',
      pais: user?.direccion?.pais || 'Argentina'
    },
    instruccionesEspeciales: ''
  });

  // Estados del proceso
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [procesandoPago, setProcesandoPago] = useState(false);

  /**
   * Redirige si el carrito está vacío
   */
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/carrito');
    }
  }, [items, cartLoading, navigate]);

  /**
   * Maneja cambios en el formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('direccion.')) {
      const direccionField = name.split('.')[1];
      setDatosEnvio(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [direccionField]: value
        }
      }));
    } else {
      setDatosEnvio(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar errores de validación
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Valida el formulario
   */
  const validateForm = () => {
    const errors = {};

    // Validaciones básicas
    if (!datosEnvio.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!datosEnvio.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    
    if (!datosEnvio.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosEnvio.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!datosEnvio.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
    }
    
    if (!datosEnvio.direccion.calle.trim()) {
      errors['direccion.calle'] = 'La dirección es requerida';
    }
    
    if (!datosEnvio.direccion.ciudad.trim()) {
      errors['direccion.ciudad'] = 'La ciudad es requerida';
    }
    
    if (!datosEnvio.direccion.codigoPostal.trim()) {
      errors['direccion.codigoPostal'] = 'El código postal es requerido';
    }

    return errors;
  };

  /**
   * Procesa el pago con Mercado Pago
   */
  const procesarPagoMercadoPago = async () => {
    try {
      setProcesandoPago(true);
      setError(null);

      // Preparar datos para Mercado Pago
      const datosPedido = {
        datosEnvio,
        items: items.map(item => ({
          id: item.pelicula.id.toString(),
          title: item.pelicula.titulo,
          description: item.pelicula.descripcion?.substring(0, 250) || 'Película',
          picture_url: item.pelicula.posterUrl,
          category_id: 'movies',
          quantity: item.cantidad,
          unit_price: item.precioUnitario
        })),
        payer: {
          name: datosEnvio.nombre,
          surname: datosEnvio.apellidos,
          email: datosEnvio.email,
          phone: {
            area_code: '11',
            number: datosEnvio.telefono
          },
          address: {
            street_name: datosEnvio.direccion.calle,
            street_number: '',
            zip_code: datosEnvio.direccion.codigoPostal
          }
        },
        back_urls: {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout/failure`,
          pending: `${window.location.origin}/checkout/pending`
        },
        auto_return: 'approved',
        external_reference: `pedido_${Date.now()}`,
        notification_url: `${window.location.origin}/api/payments/mercadopago/webhook`,
        shipments: {
          cost: 0, // Envío gratis
          mode: 'not_specified'
        }
      };

      // Crear preferencia en Mercado Pago
      const response = await mercadoPagoService.crearPreferencia(datosPedido);
      
      if (response.init_point) {
        // Crear el pedido en el backend antes de redirigir
        await createOrder({
          ...datosEnvio,
          metodoPago: 'MERCADO_PAGO',
          preferenceId: response.id,
          externalReference: datosPedido.external_reference
        });

        // Redirigir a Mercado Pago
        mercadoPagoService.redirigirACheckout(response.init_point);
      } else {
        throw new Error('No se pudo crear la preferencia de pago');
      }

    } catch (error) {
      console.error('Error al procesar pago:', error);
      setError(error.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setProcesandoPago(false);
    }
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

    setLoading(true);
    
    try {
      if (metodoPago === 'mercadopago') {
        await procesarPagoMercadoPago();
      } else {
        throw new Error('Método de pago no soportado');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      setError('Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderiza un item del resumen
   */
  const renderOrderItem = (item) => (
    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img
          src={item.pelicula.posterUrl || '/images/no-poster.jpg'}
          alt={item.pelicula.titulo}
          className="rounded me-3"
          style={{ width: '50px', height: '70px', objectFit: 'cover' }}
        />
        <div>
          <h6 className="mb-1">{item.pelicula.titulo}</h6>
          <small className="text-muted">Cantidad: {item.cantidad}</small>
        </div>
      </div>
      <div className="text-end">
        <div className="fw-semibold">${item.subtotal?.toFixed(2)}</div>
        <small className="text-muted">${item.precioUnitario?.toFixed(2)} c/u</small>
      </div>
    </ListGroup.Item>
  );

  if (cartLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando checkout...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-credit-card me-2"></i>
            Finalizar Compra
          </h2>
          <p className="text-muted">
            Completa tus datos para proceder con el pago seguro
          </p>
        </Col>
      </Row>

      <Row>
        {/* Formulario de datos */}
        <Col lg={7}>
          <Form onSubmit={handleSubmit}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-person me-2"></i>
                  Datos Personales
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={datosEnvio.nombre}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.nombre}
                        disabled={loading || procesandoPago}
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
                        value={datosEnvio.apellidos}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.apellidos}
                        disabled={loading || procesandoPago}
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
                        value={datosEnvio.email}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.email}
                        disabled={loading || procesandoPago}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={datosEnvio.telefono}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.telefono}
                        disabled={loading || procesandoPago}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Dirección de Envío
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección *</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion.calle"
                    placeholder="Calle, número, piso, departamento"
                    value={datosEnvio.direccion.calle}
                    onChange={handleChange}
                    isInvalid={!!validationErrors['direccion.calle']}
                    disabled={loading || procesandoPago}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors['direccion.calle']}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad *</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion.ciudad"
                        value={datosEnvio.direccion.ciudad}
                        onChange={handleChange}
                        isInvalid={!!validationErrors['direccion.ciudad']}
                        disabled={loading || procesandoPago}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors['direccion.ciudad']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código Postal *</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion.codigoPostal"
                        value={datosEnvio.direccion.codigoPostal}
                        onChange={handleChange}
                        isInvalid={!!validationErrors['direccion.codigoPostal']}
                        disabled={loading || procesandoPago}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors['direccion.codigoPostal']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>País</Form.Label>
                      <Form.Select
                        name="direccion.pais"
                        value={datosEnvio.direccion.pais}
                        onChange={handleChange}
                        disabled={loading || procesandoPago}
                      >
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Brasil">Brasil</option>
                        <option value="México">México</option>
                        <option value="Colombia">Colombia</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Instrucciones Especiales (Opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="instruccionesEspeciales"
                    placeholder="Ej: Portero eléctrico, horario de entrega preferido, etc."
                    value={datosEnvio.instruccionesEspeciales}
                    onChange={handleChange}
                    disabled={loading || procesandoPago}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-credit-card-2-front me-2"></i>
                  Método de Pago
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="payment-methods">
                  <Form.Check
                    type="radio"
                    id="mercadopago"
                    name="metodoPago"
                    label={
                      <div className="d-flex align-items-center">
                        <img 
                          src="/images/mercadopago-logo.png" 
                          alt="Mercado Pago"
                          className="me-2"
                          style={{ height: '30px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'inline';
                          }}
                        />
                        <span style={{ display: 'none' }}>💳</span>
                        <div>
                          <strong>Mercado Pago</strong>
                          <div className="small text-muted">
                            Tarjetas de crédito, débito, transferencias y más
                          </div>
                        </div>
                      </div>
                    }
                    value="mercadopago"
                    checked={metodoPago === 'mercadopago'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    disabled={loading || procesandoPago}
                  />
                  
                  <div className="mt-3 p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-shield-check text-success me-2"></i>
                      <strong>Pago 100% Seguro</strong>
                    </div>
                    <small className="text-muted">
                      Tus datos están protegidos con la máxima seguridad. 
                      Mercado Pago no comparte tu información financiera con el vendedor.
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Error general */}
            {error && (
              <Alert variant="danger" className="mb-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}
          </Form>
        </Col>

        {/* Resumen del pedido */}
        <Col lg={5}>
          <Card className="sticky-top" style={{ top: '1rem' }}>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Resumen del Pedido
              </h5>
            </Card.Header>

            <ListGroup variant="flush">
              {items.map(renderOrderItem)}
            </ListGroup>

            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({totalItems} items):</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Impuestos:</span>
                <span>${impuestos?.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Envío:</span>
                <span className="text-success">Gratis</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <h5>Total:</h5>
                <h5 className="text-primary">${total?.toFixed(2)}</h5>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || procesandoPago || items.length === 0}
                >
                  {procesandoPago ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>
                      Pagar con Mercado Pago
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => navigate('/carrito')}
                  disabled={loading || procesandoPago}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al Carrito
                </Button>
              </div>

              <div className="mt-4 text-center">
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <i className="bi bi-shield-lock me-2 text-success"></i>
                  <small className="text-muted">Transacción segura SSL</small>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="bi bi-truck me-2 text-primary"></i>
                  <small className="text-muted">Envío gratis a todo el país</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;