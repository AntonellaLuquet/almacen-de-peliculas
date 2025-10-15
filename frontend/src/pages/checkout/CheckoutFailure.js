import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import mercadoPagoService from '../../services/payment/mercadoPagoService';

/**
 * Página de pago fallido
 */
const CheckoutFailure = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const procesarFallo = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de retorno de Mercado Pago
        const returnData = mercadoPagoService.manejarRetorno(searchParams);
        
        if (returnData.payment_id) {
          // Verificar el estado del pago para obtener más detalles
          try {
            const paymentStatus = await mercadoPagoService.verificarPago(returnData.payment_id);
            setPaymentInfo({ ...returnData, ...paymentStatus });
          } catch (verifyError) {
            // Si no se puede verificar, usar solo los datos de retorno
            setPaymentInfo(returnData);
          }
        } else {
          setPaymentInfo(returnData);
        }
        
      } catch (error) {
        console.error('Error al procesar fallo de pago:', error);
        setError('Error al procesar la información del pago');
      } finally {
        setLoading(false);
      }
    };

    procesarFallo();
  }, [searchParams]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="danger" size="lg" />
          <p className="mt-3">Procesando información del pago...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Alert variant="danger" className="text-center">
              <i className="bi bi-exclamation-triangle display-4"></i>
              <h4 className="mt-3">Error de Procesamiento</h4>
              <p>{error}</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const estadoPago = mercadoPagoService.obtenerEstadoPago(
    paymentInfo?.status, 
    paymentInfo?.collection_status
  );

  // Determinar el motivo del fallo
  const getMotivoFallo = () => {
    const status = paymentInfo?.status || paymentInfo?.collection_status;
    
    switch (status) {
      case 'rejected':
        return {
          titulo: 'Pago Rechazado',
          mensaje: 'Tu pago fue rechazado. Esto puede deberse a fondos insuficientes, datos incorrectos de la tarjeta o políticas del banco.',
          sugerencia: 'Intenta con otra tarjeta o método de pago'
        };
      case 'cancelled':
        return {
          titulo: 'Pago Cancelado',
          mensaje: 'El pago fue cancelado durante el proceso.',
          sugerencia: 'Puedes intentar nuevamente cuando estés listo'
        };
      default:
        return {
          titulo: 'Error en el Pago',
          mensaje: 'Ocurrió un problema durante el procesamiento del pago.',
          sugerencia: 'Por favor, intenta nuevamente'
        };
    }
  };

  const motivoFallo = getMotivoFallo();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="text-center p-5">
              <i className={`bi ${estadoPago.icono} display-1 text-${estadoPago.tipo} mb-4`}></i>
              
              <h2 className="mb-3">{motivoFallo.titulo}</h2>
              
              <Alert variant={estadoPago.tipo} className="mb-4">
                <strong>{motivoFallo.mensaje}</strong>
              </Alert>

              <p className="text-muted mb-4">
                {motivoFallo.sugerencia}
              </p>

              {paymentInfo && (
                <Card className="bg-light mb-4">
                  <Card.Body>
                    <h6>Detalles del Intento:</h6>
                    <div className="text-start">
                      {paymentInfo.payment_id && (
                        <p className="mb-1">
                          <strong>ID de Pago:</strong> {paymentInfo.payment_id}
                        </p>
                      )}
                      {paymentInfo.external_reference && (
                        <p className="mb-1">
                          <strong>Referencia:</strong> {paymentInfo.external_reference}
                        </p>
                      )}
                      {paymentInfo.payment_type && (
                        <p className="mb-1">
                          <strong>Método:</strong> {paymentInfo.payment_type}
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" as={Link} to="/checkout">
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Intentar Nuevamente
                </Button>
                
                <Button variant="outline-primary" as={Link} to="/carrito">
                  <i className="bi bi-cart me-2"></i>
                  Volver al Carrito
                </Button>
                
                <Button variant="outline-secondary" as={Link} to="/catalogo">
                  <i className="bi bi-collection me-2"></i>
                  Seguir Comprando
                </Button>
              </div>

              <div className="mt-4">
                <Alert variant="info" className="small">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>¿Necesitas ayuda?</strong><br />
                  Contacta a nuestro soporte al cliente si tienes problemas recurrentes con el pago.
                  <div className="mt-2">
                    <Button variant="link" size="sm" href="mailto:soporte@almacenpeliculas.com">
                      <i className="bi bi-envelope me-1"></i>
                      soporte@almacenpeliculas.com
                    </Button>
                    <Button variant="link" size="sm" href="tel:+34900123456">
                      <i className="bi bi-telephone me-1"></i>
                      +34 900 123 456
                    </Button>
                  </div>
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información adicional */}
      <Row className="justify-content-center mt-4">
        <Col md={10} lg={8}>
          <Card className="bg-light">
            <Card.Body>
              <h5 className="text-center mb-3">Consejos para Pagos Exitosos</h5>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-credit-card display-6 text-primary"></i>
                  <h6 className="mt-2">Verifica tu Tarjeta</h6>
                  <small className="text-muted">
                    Asegúrate de que los datos sean correctos y que tengas fondos suficientes
                  </small>
                </Col>
                
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-wifi display-6 text-primary"></i>
                  <h6 className="mt-2">Conexión Estable</h6>
                  <small className="text-muted">
                    Usa una conexión a internet estable durante el proceso de pago
                  </small>
                </Col>
                
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-shield-check display-6 text-primary"></i>
                  <h6 className="mt-2">Pago Seguro</h6>
                  <small className="text-muted">
                    Todos nuestros pagos están protegidos con encriptación SSL
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutFailure;