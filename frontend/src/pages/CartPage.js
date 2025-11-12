import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, ListGroup, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Página del carrito de compras
 */
const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    subtotal, 
    impuestos, 
    total, 
    totalItems,
    loading, 
    error, 
    updateItem, 
    removeItem, 
    clearCart,
    clearError
  } = useCart();

  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());

  /**
   * Actualiza la cantidad de un item
   */
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      setUpdatingItems(prev => new Set(prev).add(itemId));
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  /**
   * Elimina un item del carrito
   */
  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este item del carrito?')) {
      return;
    }

    try {
      setRemovingItems(prev => new Set(prev).add(itemId));
      await removeItem(itemId);
    } catch (error) {
      console.error('Error al eliminar item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  /**
   * Vacía el carrito completamente
   */
  const handleClearCart = async () => {
    if (!window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      return;
    }

    try {
      await clearCart();
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
    }
  };

  /**
   * Procede al checkout
   */
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  /**
   * Renderiza un item del carrito
   */
  const renderCartItem = (item) => (
    <ListGroup.Item key={item.id} className="cart-item">
      <Row className="align-items-center">
        {/* Imagen de la película */}
        <Col md={2} className="text-center mb-3 mb-md-0">
          <img
            src={item.pelicula.imagenUrl || '/images/no-poster.jpg'}
            alt={item.pelicula.titulo}
            className="img-fluid rounded"
            style={{ maxHeight: '120px', maxWidth: '80px' }}
          />
        </Col>

        {/* Información de la película */}
        <Col md={4} className="mb-3 mb-md-0">
          <h6 className="mb-1">
            <Link 
              to={`/pelicula/${item.pelicula.id}`}
              className="text-decoration-none"
            >
              {item.pelicula.titulo}
            </Link>
          </h6>
          
          <div className="mb-2">
            {item.pelicula.generos && item.pelicula.generos.slice(0, 2).map((genero, index) => (
              <Badge key={index} bg="info" className="me-1">
                {genero}
              </Badge>
            ))}
          </div>
          
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            {item.pelicula.anio}
          </small>
        </Col>

        {/* Precio unitario */}
        <Col md={2} className="text-center mb-3 mb-md-0">
          <div>
            <strong>${item.precioUnitario?.toFixed(2)}</strong>
          </div>
          <small className="text-muted">c/u</small>
        </Col>

        {/* Controles de cantidad */}
        <Col md={2} className="text-center mb-3 mb-md-0">
          <div className="quantity-controls d-flex align-items-center justify-content-center">
            <Button
              variant="outline-secondary"
              size="sm"
              className="quantity-btn"
              onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
              disabled={updatingItems.has(item.id) || removingItems.has(item.id)}
            >
              <i className="bi bi-dash"></i>
            </Button>
            
            <span className="mx-3 fw-semibold">
              {updatingItems.has(item.id) ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                item.cantidad
              )}
            </span>
            
            <Button
              variant="outline-secondary"
              size="sm"
              className="quantity-btn"
              onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
              disabled={updatingItems.has(item.id) || removingItems.has(item.id) || item.cantidad >= 10}
            >
              <i className="bi bi-plus"></i>
            </Button>
          </div>
        </Col>

        {/* Subtotal y acciones */}
        <Col md={2} className="text-center">
          <div className="mb-2">
            <strong>${item.subtotal?.toFixed(2)}</strong>
          </div>
          
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleRemoveItem(item.id)}
            disabled={updatingItems.has(item.id) || removingItems.has(item.id)}
            title="Eliminar del carrito"
          >
            {removingItems.has(item.id) ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              <i className="bi bi-trash"></i>
            )}
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border spinner-border-primary" role="status">
            <span className="visually-hidden">Cargando carrito...</span>
          </div>
          <p className="mt-2 text-muted">Cargando tu carrito...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="bi bi-cart me-2"></i>
                Mi Carrito
              </h2>
              <p className="text-muted mb-0">
                {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Carrito vacío'}
              </p>
            </div>
            
            <Button 
              variant="outline-secondary"
              onClick={() => navigate('/catalogo')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Seguir Comprando
            </Button>
          </div>
        </Col>
      </Row>

      {/* Error */}
      {error && (
        <Alert variant="danger" dismissible onClose={clearError}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Row>
        {/* Lista de items */}
        <Col lg={8}>
          {items.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-cart-x display-1 text-muted"></i>
                <h4 className="mt-3">Tu carrito está vacío</h4>
                <p className="text-muted mb-4">
                  ¡Explora nuestro catálogo y encuentra las mejores películas!
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
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Items en tu carrito</h5>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleClearCart}
                >
                  <i className="bi bi-trash me-2"></i>
                  Vaciar Carrito
                </Button>
              </Card.Header>
              
              <ListGroup variant="flush">
                {items.map(renderCartItem)}
              </ListGroup>
            </Card>
          )}
        </Col>

        {/* Resumen del carrito */}
        {items.length > 0 && (
          <Col lg={4}>
            <Card className="cart-summary sticky-top" style={{ top: '1rem' }}>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  Resumen del Pedido
                </h5>
              </Card.Header>
              
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
                    onClick={handleProceedToCheckout}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Proceder al Pago
                  </Button>
                  
                  <Button 
                    variant="outline-primary"
                    as={Link}
                    to="/catalogo"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar Más Items
                  </Button>
                </div>
                
                {/* Información adicional */}
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Compra 100% segura
                  </small>
                  <br />
                  <small className="text-muted">
                    <i className="bi bi-truck me-1"></i>
                    Envío gratuito en todos los pedidos
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Información adicional */}
      {items.length > 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center mb-3 mb-md-0">
                    <i className="bi bi-truck display-6 text-primary"></i>
                    <h6 className="mt-2">Envío Rápido</h6>
                    <small className="text-muted">
                      Recibe tu pedido en 24-48 horas
                    </small>
                  </Col>
                  
                  <Col md={4} className="text-center mb-3 mb-md-0">
                    <i className="bi bi-arrow-clockwise display-6 text-primary"></i>
                    <h6 className="mt-2">Devoluciones</h6>
                    <small className="text-muted">
                      30 días para devoluciones gratuitas
                    </small>
                  </Col>
                  
                  <Col md={4} className="text-center">
                    <i className="bi bi-headset display-6 text-primary"></i>
                    <h6 className="mt-2">Soporte</h6>
                    <small className="text-muted">
                      Atención al cliente 24/7
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;