import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import peliculasService from '../services/peliculasService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Página de detalle de una película
 */
const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, updateItem, isInCart, getItemQuantity } = useCart();

  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  /**
   * Carga los datos de la película
   */
  useEffect(() => {
    const cargarPelicula = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const peliculaData = await peliculasService.obtenerPelicula(id);
        setPelicula(peliculaData);
        
      } catch (error) {
        console.error('Error al cargar película:', error);
        if (error.response?.status === 404) {
          setError('Película no encontrada');
        } else {
          setError('Error al cargar los datos de la película');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarPelicula();
    }
  }, [id]);

  /**
   * Agrega la película al carrito
   */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/pelicula/${id}` } } });
      return;
    }

    try {
      setAddingToCart(true);
      
      if (isInCart(pelicula.id)) {
        // Si ya está en el carrito, actualizar cantidad
        const currentQuantity = getItemQuantity(pelicula.id);
        await updateItem(pelicula.id, currentQuantity + cantidad);
      } else {
        // Si no está en el carrito, agregar
        await addItem(pelicula.id, cantidad);
      }
      
      // Mostrar mensaje de éxito (podrías usar un toast aquí)
      alert('Película agregada al carrito exitosamente');
      
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar la película al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  /**
   * Maneja el cambio de cantidad
   */
  const handleCantidadChange = (nuevaCantidad) => {
    if (nuevaCantidad >= 1 && nuevaCantidad <= 10) {
      setCantidad(nuevaCantidad);
    }
  };

  /**
   * Formatea la duración en horas y minutos
   */
  const formatDuration = (minutos) => {
    if (!minutos) return 'No especificada';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}min` : `${mins}min`;
  };

  /**
   * Renderiza las estrellas de puntuación
   */
  const renderStars = (puntuacion) => {
    if (!puntuacion) return null;
    
    const stars = [];
    const fullStars = Math.floor(puntuacion);
    const hasHalfStar = puntuacion % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(puntuacion);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    
    return (
      <div className="d-flex align-items-center">
        {stars}
        <span className="ms-2 fw-semibold">{puntuacion.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Cargando película...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => navigate('/catalogo')}>
            Volver al Catálogo
          </Button>
        </div>
      </Container>
    );
  }

  if (!pelicula) {
    return null;
  }

  const currentQuantityInCart = getItemQuantity(pelicula.id);

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Button variant="link" className="p-0" onClick={() => navigate('/')}>
              Inicio
            </Button>
          </li>
          <li className="breadcrumb-item">
            <Button variant="link" className="p-0" onClick={() => navigate('/catalogo')}>
              Catálogo
            </Button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {pelicula.titulo}
          </li>
        </ol>
      </nav>

      <Row>
        {/* Imagen de la película */}
        <Col lg={4} className="mb-4">
          <Card className="shadow">
            <Card.Img 
              variant="top"
              src={pelicula.posterUrl || '/images/no-poster.jpg'}
              alt={pelicula.titulo}
              className="movie-detail-poster"
            />
          </Card>
        </Col>

        {/* Información de la película */}
        <Col lg={8}>
          <div className="movie-detail-info">
            {/* Título y año */}
            <div className="mb-3">
              <h1 className="display-6 fw-bold">{pelicula.titulo}</h1>
              <p className="lead text-muted mb-2">
                <i className="bi bi-calendar me-2"></i>
                {pelicula.anio}
                {pelicula.duracion && (
                  <>
                    <span className="mx-2">•</span>
                    <i className="bi bi-clock me-2"></i>
                    {formatDuration(pelicula.duracion)}
                  </>
                )}
              </p>
            </div>

            {/* Géneros y clasificación */}
            <div className="mb-3">
              <div className="movie-genres">
                {pelicula.generos && pelicula.generos.map((genero, index) => (
                  <Badge key={index} bg="info" className="genre-tag me-2">
                    {genero}
                  </Badge>
                ))}
                {pelicula.clasificacion && (
                  <Badge bg="secondary" className="movie-classification">
                    {pelicula.clasificacion}
                  </Badge>
                )}
              </div>
            </div>

            {/* Puntuación */}
            {pelicula.puntuacion && (
              <div className="mb-3">
                {renderStars(pelicula.puntuacion)}
              </div>
            )}

            {/* Descripción */}
            <div className="mb-4">
              <h5>Sinopsis</h5>
              <p className="text-muted">
                {pelicula.descripcion || 'No hay descripción disponible.'}
              </p>
            </div>

            {/* Información adicional */}
            {(pelicula.director || pelicula.reparto) && (
              <Row className="mb-4">
                {pelicula.director && (
                  <Col md={6} className="mb-3">
                    <h6>
                      <i className="bi bi-camera-reels me-2"></i>
                      Director
                    </h6>
                    <p className="text-muted mb-0">{pelicula.director}</p>
                  </Col>
                )}
                
                {pelicula.reparto && (
                  <Col md={6} className="mb-3">
                    <h6>
                      <i className="bi bi-people me-2"></i>
                      Reparto Principal
                    </h6>
                    <p className="text-muted mb-0">{pelicula.reparto}</p>
                  </Col>
                )}
              </Row>
            )}

            {/* Precio y acciones */}
            <Card className="bg-light">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <div className="price-section">
                      <h3 className="movie-price mb-2">
                        ${pelicula.precio?.toFixed(2)}
                      </h3>
                      {pelicula.stock !== undefined && (
                        <p className="text-muted mb-0">
                          <i className="bi bi-box me-1"></i>
                          {pelicula.stock > 0 ? (
                            `${pelicula.stock} disponibles`
                          ) : (
                            <span className="text-danger">Sin stock</span>
                          )}
                        </p>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="actions-section">
                      {/* Selector de cantidad */}
                      <div className="quantity-controls mb-3">
                        <label className="form-label">Cantidad:</label>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn"
                            onClick={() => handleCantidadChange(cantidad - 1)}
                            disabled={cantidad <= 1}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          
                          <input
                            type="number"
                            className="quantity-input form-control form-control-sm mx-2 text-center"
                            value={cantidad}
                            onChange={(e) => handleCantidadChange(parseInt(e.target.value) || 1)}
                            min="1"
                            max="10"
                          />
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn"
                            onClick={() => handleCantidadChange(cantidad + 1)}
                            disabled={cantidad >= 10}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </div>

                      {/* Botón agregar al carrito */}
                      <div className="d-grid gap-2">
                        {pelicula.stock > 0 ? (
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                          >
                            {addingToCart ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Agregando...
                              </>
                            ) : currentQuantityInCart > 0 ? (
                              <>
                                <i className="bi bi-cart-check me-2"></i>
                                Agregar Más ({currentQuantityInCart} en carrito)
                              </>
                            ) : (
                              <>
                                <i className="bi bi-cart-plus me-2"></i>
                                Agregar al Carrito
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button variant="secondary" size="lg" disabled>
                            <i className="bi bi-x-circle me-2"></i>
                            Sin Stock
                          </Button>
                        )}
                        
                        <Button
                          variant="outline-primary"
                          size="lg"
                          onClick={() => navigate('/catalogo')}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Seguir Comprando
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Información adicional */}
            <div className="mt-4">
              <Row>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <h6>
                        <i className="bi bi-shield-check me-2"></i>
                        Garantía de Satisfacción
                      </h6>
                      <p className="text-muted small mb-0">
                        Devolución gratuita en 30 días si no estás satisfecho.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <h6>
                        <i className="bi bi-truck me-2"></i>
                        Envío Rápido
                      </h6>
                      <p className="text-muted small mb-0">
                        Recibe tu película en 24-48 horas laborables.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Películas relacionadas (placeholder) */}
      <Row className="mt-5">
        <Col>
          <h4 className="mb-3">
            <i className="bi bi-collection me-2"></i>
            Películas Relacionadas
          </h4>
          <div className="bg-light rounded p-4 text-center text-muted">
            <i className="bi bi-film display-4"></i>
            <p className="mt-2">Próximamente: Recomendaciones personalizadas</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetailPage;