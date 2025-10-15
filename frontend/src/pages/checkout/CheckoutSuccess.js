import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import mercadoPagoService from '../../services/payment/mercadoPagoService';

/**
 * Página de éxito del pago
 */
const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarPago = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de retorno de Mercado Pago
        const returnData = mercadoPagoService.manejarRetorno(searchParams);
        
        if (returnData.payment_id) {
          // Verificar el estado del pago
          const paymentStatus = await mercadoPagoService.verificarPago(returnData.payment_id);
          setPaymentInfo({ ...returnData, ...paymentStatus });
        } else {
          setPaymentInfo(returnData);
        }
        
      } catch (error) {
        console.error('Error al verificar pago:', error);
        setError('Error al verificar el estado del pago');
      } finally {
        setLoading(false);
      }
    };

    verificarPago();
  }, [searchParams]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Verificando pago...</p>
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

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="text-center p-5">
              <i className={`bi ${estadoPago.icono} display-1 text-${estadoPago.tipo} mb-4`}></i>
              
              <h2 className="mb-3">¡Pago Exitoso!</h2>
              
              <Alert variant={estadoPago.tipo} className="mb-4">
                <strong>{estadoPago.mensaje}</strong>
              </Alert>

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
                  <i className="bi bi-bag-check me-2"></i>
                  Ver Mis Pedidos
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

              <div className="mt-4 text-muted">
                <p className="small">
                  <i className="bi bi-envelope me-1"></i>
                  Recibirás un email de confirmación con los detalles de tu compra
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutSuccess;