import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Alert, Badge,
  InputGroup, Row, Col, Pagination, Form
} from 'react-bootstrap';
import pedidoService from '../../services/pedidoService';

/**
 * Gestión de pedidos del sistema
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;

  // Estados disponibles
  const orderStatuses = ['PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderData = await pedidoService.getAllPedidos();
      // Ordenar por fecha más reciente primero
      const sortedOrders = orderData.sort((a, b) =>
        new Date(b.fechaPedido) - new Date(a.fechaPedido)
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.estado === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleViewOrder = async (orderId) => {
    try {
      const orderDetails = await pedidoService.getPedidoById(orderId);
      setSelectedOrder(orderDetails);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      setError('Error al cargar los detalles del pedido');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await pedidoService.updateestado(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, estado: newStatus } : order
      ));

      // Si el modal está abierto y es este pedido, actualizarlo también
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, estado: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar el estado del pedido');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'PENDIENTE': 'warning',
      'PROCESANDO': 'info',
      'ENVIADO': 'primary',
      'ENTREGADO': 'success',
      'CANCELADO': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const calculateOrderStats = () => {
    const stats = {
      total: orders.length,
      pendientes: orders.filter(o => o.estado === 'PENDIENTE').length,
      procesando: orders.filter(o => o.estado === 'PROCESANDO').length,
      enviados: orders.filter(o => o.estado === 'ENVIADO').length,
      entregados: orders.filter(o => o.estado === 'ENTREGADO').length,
      cancelados: orders.filter(o => o.estado === 'CANCELADO').length,
      totalRevenue: orders
        .filter(o => o.estado === 'ENTREGADO')
        .reduce((sum, order) => sum + order.total, 0)
    };
    return stats;
  };

  // Paginación
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const stats = calculateOrderStats();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Estadísticas resumidas */}
      <Row className="mb-4">
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h4 className="text-primary">{stats.total}</h4>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h4 className="text-warning">{stats.pendientes}</h4>
              <small className="text-muted">Pendientes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h4 className="text-info">{stats.procesando}</h4>
              <small className="text-muted">Procesando</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h4 className="text-primary">{stats.enviados}</h4>
              <small className="text-muted">Enviados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h4 className="text-success">{stats.entregados}</h4>
              <small className="text-muted">Entregados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h5 className="text-success">{formatCurrency(stats.totalRevenue)}</h5>
              <small className="text-muted">Ingresos</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Header y filtros */}
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-bag-check me-2"></i>
              Gestión de Pedidos
            </h5>
            <Badge bg="info">{filteredOrders.length} pedidos</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por ID, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {orderStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button
                variant="outline-primary"
                onClick={loadOrders}
                className="w-100"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Actualizar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de pedidos */}
      <Card>
        <Card.Body>
          {currentOrders.length > 0 ? (
            <>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Método Pago</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <div>
                            <strong>{order.usuario.nombre}</strong>
                            <br />
                            <small className="text-muted">{order.usuario.email}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            {new Date(order.fechaPedido).toLocaleDateString('es-ES')}
                            <br />
                            <small className="text-muted">
                              {new Date(order.fechaPedido).toLocaleTimeString('es-ES')}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {order.items?.length || 0} items
                          </Badge>
                        </td>
                        <td>
                          <strong>{formatCurrency(order.total)}</strong>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {getStatusBadge(order.estado)}
                            <Form.Select
                              size="sm"
                              value={order.estado}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {orderStatuses.map(status => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </td>
                        <td>
                          <Badge bg="outline-primary">
                            {order.metodoPago || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    />
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    />

                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      const pageNumber = Math.max(1, currentPage - 2) + idx;
                      if (pageNumber <= totalPages) {
                        return (
                          <Pagination.Item
                            key={pageNumber}
                            active={pageNumber === currentPage}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Pagination.Item>
                        );
                      }
                      return null;
                    })}

                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    />
                    <Pagination.Last
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted py-5">
              <i className="bi bi-bag fs-1"></i>
              <p>No se encontraron pedidos</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de detalles del pedido */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalles del Pedido #{selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Información del cliente */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Información del Cliente</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Nombre:</strong> {selectedOrder.usuario.nombre}</p>
                      <p><strong>Email:</strong> {selectedOrder.usuario.email}</p>
                      <p><strong>Teléfono:</strong> {selectedOrder.usuario.telefono || 'N/A'}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Fecha del Pedido:</strong> {new Date(selectedOrder.fechaPedido).toLocaleString('es-ES')}</p>
                      <p><strong>Estado:</strong> {getStatusBadge(selectedOrder.estado)}</p>
                      <p><strong>Método de Pago:</strong> {selectedOrder.metodoPago || 'N/A'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Dirección de entrega */}
              {selectedOrder.direccionEntrega && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Dirección de Entrega</h6>
                  </Card.Header>
                  <Card.Body>
                    <p>{selectedOrder.direccionEntrega.calle} {selectedOrder.direccionEntrega.numero}</p>
                    <p>{selectedOrder.direccionEntrega.ciudad}, {selectedOrder.direccionEntrega.provincia}</p>
                    <p>CP: {selectedOrder.direccionEntrega.codigoPostal}</p>
                  </Card.Body>
                </Card>
              )}

              {/* Items del pedido */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Items del Pedido</h6>
                </Card.Header>
                <Card.Body>
                  <Table striped size="sm">
                    <thead>
                      <tr>
                        <th>Película</th>
                        <th>Precio Unit.</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.pelicula.imagenUrl || '/placeholder-movie.jpg'}
                                alt={item.pelicula.titulo}
                                width="40"
                                height="50"
                                className="me-2 rounded"
                                onError={(e) => {
                                  e.target.src = '/placeholder-movie.jpg';
                                }}
                              />
                              <div>
                                <strong>{item.pelicula.titulo}</strong>
                                <br />
                                <small className="text-muted">{item.pelicula.director}</small>
                              </div>
                            </div>
                          </td>
                          <td>{formatCurrency(item.precio)}</td>
                          <td>{item.cantidad}</td>
                          <td><strong>{formatCurrency(item.precio * item.cantidad)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan="3" className="text-end">Total:</th>
                        <th>{formatCurrency(selectedOrder.total)}</th>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>

              {/* Actualizar estado */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Actualizar Estado</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nuevo Estado</Form.Label>
                        <Form.Select
                          value={selectedOrder.estado}
                          onChange={(e) => {
                            handleUpdateOrderStatus(selectedOrder.id, e.target.value);
                          }}
                        >
                          {orderStatuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;