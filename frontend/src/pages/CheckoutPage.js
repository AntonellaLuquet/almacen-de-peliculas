import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import mercadoPagoService from '../services/payment/mercadoPagoService';
import carritoService from '../services/carritoService'; // Usar el servicio unificado

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, impuestos, total, totalItems, clearCart, loading: cartLoading } = useCart();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [metodoPago, setMetodoPago] = useState('mercadopago');

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/carrito');
    }
  }, [items, cartLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setDatosEnvio(prev => ({ ...prev, direccion: { ...prev.direccion, [field]: value } }));
    } else {
      setDatosEnvio(prev => ({ ...prev, [name]: value }));
    }
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!datosEnvio.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!datosEnvio.apellidos.trim()) errors.apellidos = 'Los apellidos son requeridos';
    if (!datosEnvio.email.trim()) errors.email = 'El email es requerido';
    if (!datosEnvio.telefono.trim()) errors.telefono = 'El teléfono es requerido';
    if (!datosEnvio.direccion.calle.trim()) errors['direccion.calle'] = 'La dirección es requerida';
    if (!datosEnvio.direccion.ciudad.trim()) errors['direccion.ciudad'] = 'La ciudad es requerida';
    if (!datosEnvio.direccion.codigoPostal.trim()) errors['direccion.codigoPostal'] = 'El código postal es requerido';
    return errors;
  };

  const procesarPedidoEfectivo = async () => {
    const datosPedido = { datosEnvio, items };
    const pedidoCreado = await carritoService.checkout(datosPedido, 'EFECTIVO');
    await clearCart();
    navigate(`/checkout/success?order_id=${pedidoCreado.id}&payment_method=efectivo`);
  };

  const procesarPagoMercadoPago = async () => {
    const datosPedido = { datosEnvio, items };
    const response = await mercadoPagoService.crearPreferencia(datosPedido);
    if (response.init_point) {
      window.location.href = response.init_point;
    } else {
      throw new Error('No se pudo crear la preferencia de pago');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (metodoPago === 'mercadopago') {
        await procesarPagoMercadoPago();
      } else if (metodoPago === 'efectivo') {
        await procesarPedidoEfectivo();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al procesar el pedido.');
    }

    setLoading(false);
  };

  const renderOrderItem = (item) => (
    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img src={item.pelicula.posterUrl || '/images/no-poster.jpg'} alt={item.pelicula.titulo} className="rounded me-3" style={{ width: '50px', height: '70px', objectFit: 'cover' }} />
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
    return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /><p className="mt-2">Cargando checkout...</p></Container>;
  }

  return (
    <Container className="py-4">
      <Row className="mb-4"><Col><h2><i className="bi bi-credit-card me-2"></i>Finalizar Compra</h2><p className="text-muted">Completa tus datos para proceder con el pago</p></Col></Row>
      <Row>
        <Col lg={7}>
          <Form onSubmit={handleSubmit}>
            <Card className="mb-4">
              <Card.Header><h5 className="mb-0"><i className="bi bi-person me-2"></i>Datos Personales</h5></Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Nombre *</Form.Label><Form.Control type="text" name="nombre" value={datosEnvio.nombre} onChange={handleChange} isInvalid={!!validationErrors.nombre} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors.nombre}</Form.Control.Feedback></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Apellidos *</Form.Label><Form.Control type="text" name="apellidos" value={datosEnvio.apellidos} onChange={handleChange} isInvalid={!!validationErrors.apellidos} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors.apellidos}</Form.Control.Feedback></Form.Group></Col>
                </Row>
                <Row>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Email *</Form.Label><Form.Control type="email" name="email" value={datosEnvio.email} onChange={handleChange} isInvalid={!!validationErrors.email} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Teléfono *</Form.Label><Form.Control type="tel" name="telefono" value={datosEnvio.telefono} onChange={handleChange} isInvalid={!!validationErrors.telefono} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors.telefono}</Form.Control.Feedback></Form.Group></Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="mb-4">
              <Card.Header><h5 className="mb-0"><i className="bi bi-geo-alt me-2"></i>Dirección de Envío</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3"><Form.Label>Dirección *</Form.Label><Form.Control type="text" name="direccion.calle" placeholder="Calle, número, piso, departamento" value={datosEnvio.direccion.calle} onChange={handleChange} isInvalid={!!validationErrors['direccion.calle']} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors['direccion.calle']}</Form.Control.Feedback></Form.Group>
                <Row>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Ciudad *</Form.Label><Form.Control type="text" name="direccion.ciudad" value={datosEnvio.direccion.ciudad} onChange={handleChange} isInvalid={!!validationErrors['direccion.ciudad']} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors['direccion.ciudad']}</Form.Control.Feedback></Form.Group></Col>
                  <Col md={3}><Form.Group className="mb-3"><Form.Label>Código Postal *</Form.Label><Form.Control type="text" name="direccion.codigoPostal" value={datosEnvio.direccion.codigoPostal} onChange={handleChange} isInvalid={!!validationErrors['direccion.codigoPostal']} disabled={loading} /><Form.Control.Feedback type="invalid">{validationErrors['direccion.codigoPostal']}</Form.Control.Feedback></Form.Group></Col>
                  <Col md={3}><Form.Group className="mb-3"><Form.Label>País</Form.Label><Form.Select name="direccion.pais" value={datosEnvio.direccion.pais} onChange={handleChange} disabled={loading}><option value="Argentina">Argentina</option></Form.Select></Form.Group></Col>
                </Row>
                <Form.Group><Form.Label>Instrucciones Especiales (Opcional)</Form.Label><Form.Control as="textarea" rows={3} name="instruccionesEspeciales" placeholder="Ej: Portero eléctrico, horario de entrega preferido, etc." value={datosEnvio.instruccionesEspeciales} onChange={handleChange} disabled={loading} /></Form.Group>
              </Card.Body>
            </Card>
            <Card className="mb-4">
              <Card.Header><h5 className="mb-0"><i className="bi bi-credit-card-2-front me-2"></i>Método de Pago</h5></Card.Header>
              <Card.Body>
                <div className="payment-methods">
                  <Form.Check type="radio" id="mercadopago" name="metodoPago" label={<div className="d-flex align-items-center"><img src="/images/mercadopago-logo.png" alt="Mercado Pago" className="me-2" style={{ height: '30px' }} /><div><strong>Mercado Pago</strong><div className="small text-muted">Tarjetas, transferencias y más</div></div></div>} value="mercadopago" checked={metodoPago === 'mercadopago'} onChange={(e) => setMetodoPago(e.target.value)} disabled={loading} />
                  <hr />
                  <Form.Check type="radio" id="efectivo" name="metodoPago" label={<div className="d-flex align-items-center"><i className="bi bi-cash-coin me-2 fs-4"></i><div><strong>Efectivo / Al Contado</strong><div className="small text-muted">Paga al momento de retirar tu pedido</div></div></div>} value="efectivo" checked={metodoPago === 'efectivo'} onChange={(e) => setMetodoPago(e.target.value)} disabled={loading} />
                </div>
              </Card.Body>
            </Card>
            {error && <Alert variant="danger" className="mb-4"><i className="bi bi-exclamation-triangle me-2"></i>{error}</Alert>}
          </Form>
        </Col>
        <Col lg={5}>
          <Card className="sticky-top" style={{ top: '1rem' }}>
            <Card.Header><h5 className="mb-0"><i className="bi bi-list-check me-2"></i>Resumen del Pedido</h5></Card.Header>
            <ListGroup variant="flush">{items.map(renderOrderItem)}</ListGroup>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2"><span>Subtotal ({totalItems} items):</span><span>${subtotal?.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Impuestos:</span><span>${impuestos?.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-3"><span>Envío:</span><span className="text-success">Gratis</span></div>
              <hr />
              <div className="d-flex justify-content-between mb-4"><h5>Total:</h5><h5 className="text-primary">${total?.toFixed(2)}</h5></div>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={handleSubmit} disabled={loading || items.length === 0}>
                  {loading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Procesando...</> : <><i className="bi bi-check-circle me-2"></i>Finalizar Compra</>}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/carrito')} disabled={loading}>Volver al Carrito</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
