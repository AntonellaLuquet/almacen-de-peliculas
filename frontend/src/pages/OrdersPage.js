import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import pedidoService from '../services/pedidoService';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidoService.obtenerMisPedidos();
      setPedidos(response || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError('Error al cargar el historial de pedidos');
    } finally {
      setLoading(false);
    }
  };

  const obtenerDetallePedido = async (pedidoId) => {
    try {
      const detalle = await pedidoService.obtenerPedidoPorId(pedidoId);
      setSelectedOrder(detalle);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      setError('Error al cargar los detalles del pedido');
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'PENDIENTE': { bg: 'warning', text: 'dark' },
      'CONFIRMADO': { bg: 'info', text: 'white' },
      'ENVIADO': { bg: 'primary', text: 'white' },
      'ENTREGADO': { bg: 'success', text: 'white' },
      'CANCELADO': { bg: 'danger', text: 'white' }
    };
    return estados[estado] || { bg: 'secondary', text: 'white' };
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'PENDIENTE': 'bi-clock',
      'CONFIRMADO': 'bi-check-circle',
      'ENVIADO': 'bi-truck',
      'ENTREGADO': 'bi-box-check',
      'CANCELADO': 'bi-x-circle'
    };
    return iconos[estado] || 'bi-question-circle';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const renderOrderItem = (item) => (
    <tr key={item.id}>
      <td>
        <div className="d-flex align-items-center">
          <img src={item.pelicula?.posterUrl || '/images/no-poster.jpg'} alt={item.pelicula?.titulo} className="rounded me-3" style={{ width: '50px', height: '70px', objectFit: 'cover' }} />
          <div>
            <h6 className="mb-0">{item.tituloPelicula}</h6>
            <small className="text-muted">{item.anioPelicula}</small>
          </div>
        </div>
      </td>
      <td className="text-center">{item.cantidad}</td>
      <td className="text-center">${item.precioUnitario?.toFixed(2)}</td>
      <td className="text-center fw-semibold">${item.subtotal?.toFixed(2)}</td>
    </tr>
  );

  useEffect(() => {
    cargarPedidos();
  }, []);

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" size="lg" /><p className="mt-3 text-muted">Cargando historial de pedidos...</p></Container>;
  }

  return (
    <Container className="py-4">
      <Row className="mb-4"><Col><h2><i className="bi bi-bag-check me-2"></i>Mis Pedidos</h2><p className="text-muted">Historial completo de tus compras</p></Col></Row>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}><i className="bi bi-exclamation-triangle me-2"></i>{error}</Alert>}
      {pedidos.length === 0 ? (
        <Card><Card.Body className="text-center py-5"><i className="bi bi-bag-x display-1 text-muted"></i><h4 className="mt-3">No hay pedidos</h4><p className="text-muted mb-4">Aún no has realizado ninguna compra.</p><Button variant="primary" size="lg" as={Link} to="/catalogo"><i className="bi bi-collection me-2"></i>Explorar Catálogo</Button></Card.Body></Card>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table className="mb-0">
              <thead className="table-light"><tr><th>Pedido #</th><th>Fecha</th><th>Estado</th><th>Items</th><th>Total</th><th>Acciones</th></tr></thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td><strong>#{pedido.id}</strong></td>
                    <td>{formatDate(pedido.fechaCreacion)}</td>
                    <td><Badge bg={getEstadoBadge(pedido.estado).bg} text={getEstadoBadge(pedido.estado).text} className="d-flex align-items-center" style={{ width: 'fit-content' }}><i className={`${getEstadoIcon(pedido.estado)} me-1`}></i>{pedido.estado}</Badge></td>
                    <td>{pedido.items.length}</td>
                    <td><strong>${pedido.total?.toFixed(2)}</strong></td>
                    <td><Button variant="outline-primary" size="sm" onClick={() => obtenerDetallePedido(pedido.id)} title="Ver detalles"><i className="bi bi-eye"></i></Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title><i className="bi bi-receipt me-2"></i>Detalle del Pedido #{selectedOrder?.id}</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}><p className="mb-1"><strong>Fecha:</strong> {formatDate(selectedOrder.fechaCreacion)}</p><p className="mb-1"><strong>Estado:</strong> <Badge bg={getEstadoBadge(selectedOrder.estado).bg} text={getEstadoBadge(selectedOrder.estado).text}>{selectedOrder.estado}</Badge></p></Col>
                <Col md={6}><h6>Dirección de Envío</h6><address className="small"><strong>{selectedOrder.direccionEnvio?.calle}</strong><br/>{selectedOrder.direccionEnvio?.ciudad}, {selectedOrder.direccionEnvio?.codigoPostal}<br/>{selectedOrder.direccionEnvio?.pais}</address></Col>
              </Row>
              <h6>Items del Pedido</h6>
              <div className="table-responsive">
                <Table size="sm"><thead className="table-light"><tr><th>Producto</th><th className="text-center">Cant.</th><th className="text-center">Precio Unit.</th><th className="text-center">Subtotal</th></tr></thead><tbody>{selectedOrder.items?.map(renderOrderItem)}</tbody></Table>
              </div>
              <Row className="mt-3"><Col md={6} className="ms-auto"><div className="border-top pt-3"><div className="d-flex justify-content-between mb-1"><span>Subtotal:</span><span>${selectedOrder.subtotal?.toFixed(2)}</span></div><div className="d-flex justify-content-between mb-1"><span>Impuestos:</span><span>${selectedOrder.impuestos?.toFixed(2)}</span></div><div className="d-flex justify-content-between mb-1"><span>Envío:</span><span className="text-success">Gratis</span></div><div className="d-flex justify-content-between border-top pt-2"><strong>Total:</strong><strong>${selectedOrder.total?.toFixed(2)}</strong></div></div></Col></Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowDetailModal(false)}>Cerrar</Button></Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersPage;
