import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import mercadoPagoService from '../../services/payment/mercadoPagoService';

/**
 * Página de pago pendiente
 */
const CheckoutPending = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const procesarPendiente = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de retorno de Mercado Pago
        const returnData = mercadoPagoService.manejarRetorno(searchParams);
        
        if (returnData.payment_id) {
          // Verificar el estado del pago
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
        console.error('Error al procesar pago pendiente:', error);
        setError('Error al procesar la información del pago');
      } finally {
        setLoading(false);
      }
    };

    procesarPendiente();
  }, [searchParams]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="warning" size="lg" />
          <p className="mt-3">Verificando estado del pago...</p>
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
              <h4 className="mt-3">Error de Verificación</h4>
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

  // Determinar el tipo de pendiente y mensaje apropiado
  const getTipoPendiente = () => {
    const status = paymentInfo?.status || paymentInfo?.collection_status;
    const paymentType = paymentInfo?.payment_type;
    
    switch (status) {
      case 'pending':
        if (paymentType === 'bank_transfer') {
          return {
            titulo: 'Esperando Transferencia Bancaria',
            mensaje: 'Tu pago está siendo procesado. Puede demorar entre 1 y 3 días hábiles.',
            tiempo: '1-3 días hábiles',
            accion: 'Verifica que hayas completado la transferencia correctamente'
          };
        } else if (paymentType === 'ticket') {
          return {
            titulo: 'Esperando Pago en Efectivo',
            mensaje: 'Ve al punto de pago indicado y realiza el pago con el cupón generado.',
            tiempo: 'Hasta 3 días',
            accion: 'Imprime o guarda el cupón de pago'
          };
        } else {
          return {
            titulo: 'Pago en Verificación',
            mensaje: 'Tu pago está siendo verificado por el banco o la entidad financiera.',
            tiempo: '24-48 horas',
            accion: 'No es necesario realizar ninguna acción adicional'
          };
        }
      
      case 'in_process':
        return {
          titulo: 'Pago en Proceso',
          mensaje: 'Tu pago está siendo procesado por Mercado Pago.',
          tiempo: 'Unos minutos',
          accion: 'Te notificaremos cuando se complete el proceso'
        };
      
      default:
        return {
          titulo: 'Pago Pendiente',
          mensaje: 'Tu pago está pendiente de confirmación.',
          tiempo: 'Variable',
          accion: 'Revisaremos el estado y te notificaremos'
        };
    }
  };

  const tipoPendiente = getTipoPendiente();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="text-center p-5">
              <i className={`bi ${estadoPago.icono} display-1 text-${estadoPago.tipo} mb-4`}></i>
              
              <h2 className="mb-3">{tipoPendiente.titulo}</h2>
              
              <Alert variant={estadoPago.tipo} className="mb-4">
                <strong>{tipoPendiente.mensaje}</strong>
              </Alert>

              <div className="mb-4">
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <i className="bi bi-clock me-2 text-warning"></i>
                  <span><strong>Tiempo estimado:</strong> {tipoPendiente.tiempo}</span>
                </div>
                <p className="text-muted small">
                  {tipoPendiente.accion}
                </p>
              </div>

              {paymentInfo && (
                <Card className="bg-light mb-4">
                  <Card.Body>
                    <h6>Detalles del Pago:</h6>
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
                <Button variant="primary" size="lg" as={Link} to="/mis-pedidos">
                  <i className="bi bi-list-ul me-2"></i>
                  Ver Estado del Pedido
                </Button>
                
                <Button variant="outline-primary" as={Link} to="/catalogo">
                  <i className="bi bi-collection me-2"></i>
                  Seguir Comprando
                </Button>
                
                <Button variant="outline-secondary" as={Link} to="/">
                  <i className="bi bi-house me-2"></i>
                  Ir al Inicio
                </Button>
              </div>

              <div className="mt-4">
                <Alert variant="info" className="small">
                  <i className="bi bi-bell me-2"></i>
                  <strong>Te mantendremos informado</strong><br />
                  Recibirás notificaciones por email cuando cambie el estado de tu pago.
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información sobre próximos pasos */}
      <Row className="justify-content-center mt-4">
        <Col md={10} lg={8}>
          <Card className="bg-light">
            <Card.Body>
              <h5 className="text-center mb-3">¿Qué Sucede Ahora?</h5>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-1-circle display-6 text-primary"></i>
                  <h6 className="mt-2">Procesamiento</h6>
                  <small className="text-muted">
                    Estamos procesando tu pago con la entidad correspondiente
                  </small>
                </Col>
                
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-2-circle display-6 text-primary"></i>
                  <h6 className="mt-2">Confirmación</h6>
                  <small className="text-muted">
                    Una vez confirmado, procesaremos tu pedido inmediatamente
                  </small>
                </Col>
                
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-3-circle display-6 text-primary"></i>
                  <h6 className="mt-2">Envío</h6>
                  <small className="text-muted">
                    Prepararemos y enviaremos tu pedido en 24-48 horas
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contacto de soporte */}
      <Row className="justify-content-center mt-3">
        <Col md={8} lg={6}>
          <Card className="border-primary">
            <Card.Body className="text-center">
              <h6>¿Tienes Dudas?</h6>
              <p className="text-muted small mb-3">
                Nuestro equipo de soporte está disponible para ayudarte
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Button variant="outline-primary" size="sm" href="mailto:soporte@almacenpeliculas.com">
                  <i className="bi bi-envelope me-1"></i>
                  Email
                </Button>
                <Button variant="outline-primary" size="sm" href="tel:+34900123456">
                  <i className="bi bi-telephone me-1"></i>
                  Teléfono
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPending;