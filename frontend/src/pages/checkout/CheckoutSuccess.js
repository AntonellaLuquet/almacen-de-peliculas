import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import mercadoPagoService from '../../services/payment/mercadoPagoService';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEfectivo, setIsEfectivo] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      try {
        setLoading(true);
        const paymentMethod = searchParams.get('payment_method');

        if (paymentMethod === 'efectivo') {
          setIsEfectivo(true);
          setPaymentInfo({ order_id: searchParams.get('order_id') });
        } else {
          const returnData = mercadoPagoService.manejarRetorno(searchParams);
          if (returnData.payment_id) {
            const paymentStatus = await mercadoPagoService.verificarPago(returnData.payment_id);
            setPaymentInfo({ ...returnData, ...paymentStatus });
          } else {
            setPaymentInfo(returnData);
          }
        }
      } catch (error) {
        console.error('Error al procesar el pago:', error);
        setError('Error al verificar el estado del pago');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" size="lg" /><p className="mt-3">Verificando...</p></Container>;
  }

  if (error) {
    return <Container className="py-5 text-center"><Alert variant="danger"><h4>Error de Verificación</h4><p>{error}</p></Alert></Container>;
  }

  // Render para pago en efectivo
  if (isEfectivo) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow text-center p-5">
              <i className="bi bi-check-circle-fill display-1 text-success mb-4"></i>
              <h2 className="mb-3">¡Pedido Registrado!</h2>
              <Alert variant="success" className="mb-4">
                <strong>Tu pedido ha sido registrado con éxito.</strong>
                <p className="mb-0">Recuerda que debes abonarlo en efectivo al momento de retirarlo.</p>
              </Alert>
              <Card className="bg-light mb-4"><Card.Body><h6>Detalles del Pedido:</h6><p className="mb-1"><strong>Nº de Pedido:</strong> {paymentInfo.order_id}</p></Card.Body></Card>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" as={Link} to="/mis-pedidos"><i className="bi bi-bag-check me-2"></i>Ver Mis Pedidos</Button>
                <Button variant="outline-primary" as={Link} to="/catalogo"><i className="bi bi-collection me-2"></i>Seguir Comprando</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Render para Mercado Pago
  const estadoPago = mercadoPagoService.obtenerEstadoPago(paymentInfo?.status, paymentInfo?.collection_status);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow text-center p-5">
            <i className={`bi ${estadoPago.icono} display-1 text-${estadoPago.tipo} mb-4`}></i>
            <h2 className="mb-3">¡Pago Procesado!</h2>
            <Alert variant={estadoPago.tipo} className="mb-4"><strong>{estadoPago.mensaje}</strong></Alert>
            {paymentInfo && (
              <Card className="bg-light mb-4"><Card.Body><h6>Detalles del Pago:</h6><div className="text-start">
                {paymentInfo.payment_id && <p className="mb-1"><strong>ID de Pago:</strong> {paymentInfo.payment_id}</p>}
                {paymentInfo.external_reference && <p className="mb-1"><strong>Referencia:</strong> {paymentInfo.external_reference}</p>}
              </div></Card.Body></Card>
            )}
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" as={Link} to="/mis-pedidos"><i className="bi bi-bag-check me-2"></i>Ver Mis Pedidos</Button>
              <Button variant="outline-primary" as={Link} to="/catalogo"><i className="bi bi-collection me-2"></i>Seguir Comprando</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutSuccess;
