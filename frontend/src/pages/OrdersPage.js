import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import pedidoService from '../services/pedidoService';

/**
 * Página de historial de pedidos del usuario
 */
const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const pageSize = 10;

  /**
   * Carga los pedidos del usuario
   */
  const cargarPedidos = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pedidoService.obtenerMisPedidos({
        page,
        size: pageSize,
        sortBy: 'fechaPedido',
        sortDir: 'desc'
      });
      
      setPedidos(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError('Error al cargar el historial de pedidos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene el detalle de un pedido
   */
  const obtenerDetallePedido = async (pedidoId) => {
    try {
      const detalle = await pedidoService.obtenerPedido(pedidoId);
      setSelectedOrder(detalle);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      setError('Error al cargar los detalles del pedido');
    }
  };

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = (page) => {
    cargarPedidos(page);
  };

  /**
   * Obtiene el color del badge según el estado
   */
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

  /**
   * Obtiene el icono según el estado
   */
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

  /**
   * Formatea la fecha
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Renderiza un item del pedido en el modal
   */
  const renderOrderItem = (item) => (
    <tr key={item.id}>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={item.pelicula?.posterUrl || '/images/no-poster.jpg'}
            alt={item.pelicula?.titulo}
            className="rounded me-3"
            style={{ width: '50px', height: '70px', objectFit: 'cover' }}
          />
          <div>
            <h6 className="mb-0">{item.pelicula?.titulo}</h6>
            <small className="text-muted">{item.pelicula?.anio}</small>
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
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Cargando historial de pedidos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-bag-check me-2"></i>
            Mis Pedidos
          </h2>
          <p className="text-muted">
            Historial completo de tus compras y estado de envíos
          </p>
        </Col>
      </Row>

      {/* Error */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      {totalElements > 0 && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="bg-primary text-white">
              <Card.Body className="text-center">
                <i className="bi bi-bag display-4"></i>
                <h4 className="mt-2">{totalElements}</h4>
                <p className="mb-0">Total de Pedidos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-success text-white">
              <Card.Body className="text-center">
                <i className="bi bi-box-check display-4"></i>
                <h4 className="mt-2">
                  {pedidos.filter(p => p.estado === 'ENTREGADO').length}
                </h4>
                <p className="mb-0">Entregados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-info text-white">
              <Card.Body className="text-center">
                <i className="bi bi-truck display-4"></i>
                <h4 className="mt-2">
                  {pedidos.filter(p => ['CONFIRMADO', 'ENVIADO'].includes(p.estado)).length}
                </h4>
                <p className="mb-0">En Proceso</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Lista de pedidos */}
      {pedidos.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-bag-x display-1 text-muted"></i>
            <h4 className="mt-3">No hay pedidos</h4>
            <p className="text-muted mb-4">
              Aún no has realizado ninguna compra. ¡Explora nuestro catálogo!
            </p>
            <Button 
              variant="primary" 
              size="lg"
              as={Link}
              to="/catalogo"
            >
              <i className="bi bi-collection me-2"></i>
              Explorar Catálogo
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              Historial de Pedidos ({totalElements})
            </h5>
          </Card.Header>
          
          <div className="table-responsive">
            <Table className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Pedido #</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Método de Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <strong>#{pedido.numeroPedido || pedido.id}</strong>
                    </td>
                    
                    <td>
                      <div>
                        {formatDate(pedido.fechaPedido)}
                      </div>
                      <small className="text-muted">
                        {pedido.fechaEntregaEstimada && (
                          <>Entrega: {formatDate(pedido.fechaEntregaEstimada)}</>
                        )}
                      </small>
                    </td>
                    
                    <td>
                      <Badge 
                        bg={getEstadoBadge(pedido.estado).bg}
                        text={getEstadoBadge(pedido.estado).text}
                        className="d-flex align-items-center"
                        style={{ width: 'fit-content' }}
                      >
                        <i className={`${getEstadoIcon(pedido.estado)} me-1`}></i>
                        {pedido.estado}
                      </Badge>
                    </td>
                    
                    <td>
                      <span className="fw-semibold">{pedido.totalItems}</span>
                      <small className="text-muted d-block">
                        {pedido.totalItems === 1 ? 'item' : 'items'}
                      </small>
                    </td>
                    
                    <td>
                      <strong>${pedido.total?.toFixed(2)}</strong>
                      {pedido.subtotal && (
                        <small className="text-muted d-block">
                          Subtotal: ${pedido.subtotal?.toFixed(2)}
                        </small>
                      )}
                    </td>
                    
                    <td>
                      <div>
                        {pedido.metodoPago === 'MERCADO_PAGO' ? (
                          <span>
                            <i className="bi bi-credit-card me-1"></i>
                            Mercado Pago
                          </span>
                        ) : (
                          pedido.metodoPago
                        )}
                      </div>
                      {pedido.estadoPago && (
                        <small className={`text-${pedido.estadoPago === 'APROBADO' ? 'success' : 'muted'}`}>
                          {pedido.estadoPago}
                        </small>
                      )}
                    </td>
                    
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => obtenerDetallePedido(pedido.id)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        
                        {pedido.numeroSeguimiento && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            title="Seguimiento"
                          >
                            <i className="bi bi-geo-alt"></i>
                          </Button>
                        )}
                        
                        {['PENDIENTE', 'CONFIRMADO'].includes(pedido.estado) && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Cancelar"
                          >
                            <i className="bi bi-x"></i>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <Card.Footer>
              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.First 
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(0)}
                  />
                  <Pagination.Prev 
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const page = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + index;
                    return (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    );
                  })}
                  
                  <Pagination.Next 
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                  <Pagination.Last 
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => handlePageChange(totalPages - 1)}
                  />
                </Pagination>
              </div>
            </Card.Footer>
          )}
        </Card>
      )}

      {/* Modal de detalle del pedido */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-receipt me-2"></i>
            Detalle del Pedido #{selectedOrder?.numeroPedido || selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {selectedOrder && (
            <>
              {/* Información del pedido */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Información del Pedido</h6>
                  <p className="mb-1">
                    <strong>Fecha:</strong> {formatDate(selectedOrder.fechaPedido)}
                  </p>
                  <p className="mb-1">
                    <strong>Estado:</strong>{' '}
                    <Badge 
                      bg={getEstadoBadge(selectedOrder.estado).bg}
                      text={getEstadoBadge(selectedOrder.estado).text}
                    >
                      <i className={`${getEstadoIcon(selectedOrder.estado)} me-1`}></i>
                      {selectedOrder.estado}
                    </Badge>
                  </p>
                  {selectedOrder.fechaEntregaEstimada && (
                    <p className="mb-1">
                      <strong>Entrega estimada:</strong> {formatDate(selectedOrder.fechaEntregaEstimada)}
                    </p>
                  )}
                </Col>
                
                <Col md={6}>
                  <h6>Dirección de Envío</h6>
                  <address className="small">
                    <strong>{selectedOrder.datosEnvio?.nombre} {selectedOrder.datosEnvio?.apellidos}</strong><br/>
                    {selectedOrder.datosEnvio?.direccion?.calle}<br/>
                    {selectedOrder.datosEnvio?.direccion?.ciudad}, {selectedOrder.datosEnvio?.direccion?.codigoPostal}<br/>
                    {selectedOrder.datosEnvio?.direccion?.pais}<br/>
                    <i className="bi bi-telephone me-1"></i>
                    {selectedOrder.datosEnvio?.telefono}
                  </address>
                </Col>
              </Row>

              {/* Items del pedido */}
              <h6>Items del Pedido</h6>
              <div className="table-responsive">
                <Table size="sm">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-center">Precio Unit.</th>
                      <th className="text-center">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map(renderOrderItem)}
                  </tbody>
                </Table>
              </div>

              {/* Resumen de totales */}
              <Row className="mt-3">
                <Col md={6} className="ms-auto">
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                    </div>
                    {selectedOrder.impuestos > 0 && (
                      <div className="d-flex justify-content-between mb-1">
                        <span>Impuestos:</span>
                        <span>${selectedOrder.impuestos?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mb-1">
                      <span>Envío:</span>
                      <span className="text-success">Gratis</span>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-2">
                      <strong>Total:</strong>
                      <strong>${selectedOrder.total?.toFixed(2)}</strong>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Información adicional */}
              {selectedOrder.instruccionesEspeciales && (
                <div className="mt-3">
                  <h6>Instrucciones Especiales</h6>
                  <p className="small bg-light p-2 rounded">
                    {selectedOrder.instruccionesEspeciales}
                  </p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
          
          {selectedOrder?.numeroSeguimiento && (
            <Button variant="primary">
              <i className="bi bi-geo-alt me-2"></i>
              Rastrear Envío
            </Button>
          )}
          
          {['ENTREGADO'].includes(selectedOrder?.estado) && (
            <Button variant="outline-primary">
              <i className="bi bi-arrow-repeat me-2"></i>
              Volver a Comprar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersPage;