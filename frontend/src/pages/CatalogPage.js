import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Pagination, Alert, Spinner } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import peliculasService from '../services/peliculasService';
import { useCart } from '../context/CartContext';

/**
 * Página del catálogo de películas con filtros y búsqueda
 */
const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, isInCart, getItemQuantity } = useCart();

  // Estado de películas y paginación
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Estado de filtros
  const [filtros, setFiltros] = useState({
    search: searchParams.get('search') || '',
    genero: searchParams.get('genero') || '',
    clasificacion: searchParams.get('clasificacion') || '',
    anioMin: searchParams.get('anioMin') || '',
    anioMax: searchParams.get('anioMax') || '',
    precioMin: searchParams.get('precioMin') || '',
    precioMax: searchParams.get('precioMax') || '',
    puntuacionMin: searchParams.get('puntuacionMin') || '',
    sortBy: searchParams.get('sortBy') || 'fechaCreacion',
    sortDir: searchParams.get('sortDir') || 'desc'
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [pageSize] = useState(12);

  // Opciones para filtros
  const generos = ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Romance', 'Aventura', 'Thriller', 'Animación', 'Documental'];
  const clasificaciones = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  const sortOptions = [
    { value: 'fechaCreacion|desc', label: 'Más recientes' },
    { value: 'fechaCreacion|asc', label: 'Más antiguos' },
    { value: 'titulo|asc', label: 'Título A-Z' },
    { value: 'titulo|desc', label: 'Título Z-A' },
    { value: 'precio|asc', label: 'Precio menor' },
    { value: 'precio|desc', label: 'Precio mayor' },
    { value: 'puntuacion|desc', label: 'Mejor valorados' },
    { value: 'puntuacion|asc', label: 'Peor valorados' }
  ];

  /**
   * Carga las películas según los filtros actuales
   */
  const cargarPeliculas = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: filtros.sortBy,
        sortDir: filtros.sortDir
      };

      // Agregar filtros no vacíos
      if (filtros.search) params.search = filtros.search;
      if (filtros.genero) params.genero = filtros.genero;
      if (filtros.clasificacion) params.clasificacion = filtros.clasificacion;
      if (filtros.anioMin) params.anioMin = filtros.anioMin;
      if (filtros.anioMax) params.anioMax = filtros.anioMax;
      if (filtros.precioMin) params.precioMin = filtros.precioMin;
      if (filtros.precioMax) params.precioMax = filtros.precioMax;
      if (filtros.puntuacionMin) params.puntuacionMin = filtros.puntuacionMin;

      const response = await peliculasService.buscarConFiltros(filtros, params);
      
      setPeliculas(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      
    } catch (error) {
      console.error('Error al cargar películas:', error);
      setError('Error al cargar el catálogo de películas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza los parámetros de URL
   */
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (filtros.search) params.set('search', filtros.search);
    if (filtros.genero) params.set('genero', filtros.genero);
    if (filtros.clasificacion) params.set('clasificacion', filtros.clasificacion);
    if (filtros.anioMin) params.set('anioMin', filtros.anioMin);
    if (filtros.anioMax) params.set('anioMax', filtros.anioMax);
    if (filtros.precioMin) params.set('precioMin', filtros.precioMin);
    if (filtros.precioMax) params.set('precioMax', filtros.precioMax);
    if (filtros.puntuacionMin) params.set('puntuacionMin', filtros.puntuacionMin);
    if (filtros.sortBy !== 'fechaCreacion') params.set('sortBy', filtros.sortBy);
    if (filtros.sortDir !== 'desc') params.set('sortDir', filtros.sortDir);
    if (currentPage > 0) params.set('page', currentPage.toString());

    setSearchParams(params);
  };

  /**
   * Maneja cambios en los filtros
   */
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({ ...prev, [field]: value }));
    setCurrentPage(0); // Reset página al cambiar filtros
  };

  /**
   * Maneja cambios en el ordenamiento
   */
  const handleSortChange = (value) => {
    const [sortBy, sortDir] = value.split('|');
    setFiltros(prev => ({ ...prev, sortBy, sortDir }));
    setCurrentPage(0);
  };

  /**
   * Aplica los filtros
   */
  const handleApplyFilters = () => {
    setCurrentPage(0);
    updateSearchParams();
  };

  /**
   * Limpia todos los filtros
   */
  const handleClearFilters = () => {
    setFiltros({
      search: '',
      genero: '',
      clasificacion: '',
      anioMin: '',
      anioMax: '',
      precioMin: '',
      precioMax: '',
      puntuacionMin: '',
      sortBy: 'fechaCreacion',
      sortDir: 'desc'
    });
    setCurrentPage(0);
    setSearchParams({});
  };

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * Agrega una película al carrito
   */
  const handleAddToCart = async (peliculaId) => {
    try {
      await addItem(peliculaId, 1);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  /**
   * Renderiza una tarjeta de película
   */
  const renderMovieCard = (pelicula) => (
    <Card key={pelicula.id} className="movie-card h-100 fade-in">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={pelicula.posterUrl || '/images/no-poster.jpg'} 
          alt={pelicula.titulo}
          className="movie-poster"
        />
        {pelicula.puntuacion && (
          <Badge 
            bg="warning" 
            text="dark"
            className="position-absolute top-0 end-0 m-2"
          >
            <i className="bi bi-star-fill me-1"></i>
            {pelicula.puntuacion.toFixed(1)}
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="movie-title text-truncate" title={pelicula.titulo}>
          {pelicula.titulo}
        </Card.Title>
        
        <div className="mb-2">
          {pelicula.generos && pelicula.generos.slice(0, 2).map((genero, index) => (
            <Badge key={index} bg="info" className="me-1 mb-1">
              {genero}
            </Badge>
          ))}
          {pelicula.clasificacion && (
            <Badge bg="secondary" className="mb-1">
              {pelicula.clasificacion}
            </Badge>
          )}
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            {pelicula.anio}
          </small>
        </div>
        
        <Card.Text className="text-muted small flex-grow-1">
          {pelicula.descripcion?.substring(0, 100)}...
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="movie-price fw-bold fs-5">
              ${pelicula.precio?.toFixed(2)}
            </span>
            <Button 
              as={Link} 
              to={`/pelicula/${pelicula.id}`}
              variant="outline-primary" 
              size="sm"
            >
              Ver Detalles
            </Button>
          </div>
          
          <div className="d-grid">
            {isInCart(pelicula.id) ? (
              <Button 
                variant="success" 
                size="sm"
                disabled
              >
                <i className="bi bi-check-circle me-2"></i>
                En carrito ({getItemQuantity(pelicula.id)})
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => handleAddToCart(pelicula.id)}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Agregar al Carrito
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // Efectos
  useEffect(() => {
    cargarPeliculas();
  }, [currentPage, filtros.sortBy, filtros.sortDir]);

  useEffect(() => {
    updateSearchParams();
  }, [currentPage, filtros]);

  return (
    <Container className="py-4">
      <Row>
        {/* Sidebar de filtros */}
        <Col lg={3} className="mb-4">
          <Card className="filter-section sticky-top" style={{ top: '1rem' }}>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-funnel me-2"></i>
                  Filtros
                </h5>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Limpiar
                </Button>
              </div>
            </Card.Header>
            
            <Card.Body>
              {/* Búsqueda */}
              <Form.Group className="mb-3">
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Título de película..."
                  value={filtros.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Form.Group>

              {/* Género */}
              <Form.Group className="mb-3">
                <Form.Label>Género</Form.Label>
                <Form.Select
                  value={filtros.genero}
                  onChange={(e) => handleFilterChange('genero', e.target.value)}
                >
                  <option value="">Todos los géneros</option>
                  {generos.map(genero => (
                    <option key={genero} value={genero}>{genero}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Clasificación */}
              <Form.Group className="mb-3">
                <Form.Label>Clasificación</Form.Label>
                <Form.Select
                  value={filtros.clasificacion}
                  onChange={(e) => handleFilterChange('clasificacion', e.target.value)}
                >
                  <option value="">Todas las clasificaciones</option>
                  {clasificaciones.map(clasificacion => (
                    <option key={clasificacion} value={clasificacion}>{clasificacion}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Año */}
              <Form.Group className="mb-3">
                <Form.Label>Año</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Desde"
                      value={filtros.anioMin}
                      onChange={(e) => handleFilterChange('anioMin', e.target.value)}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Hasta"
                      value={filtros.anioMax}
                      onChange={(e) => handleFilterChange('anioMax', e.target.value)}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* Precio */}
              <Form.Group className="mb-3">
                <Form.Label>Precio ($)</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Mín"
                      value={filtros.precioMin}
                      onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Máx"
                      value={filtros.precioMax}
                      onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* Puntuación mínima */}
              <Form.Group className="mb-3">
                <Form.Label>Puntuación mínima</Form.Label>
                <Form.Select
                  value={filtros.puntuacionMin}
                  onChange={(e) => handleFilterChange('puntuacionMin', e.target.value)}
                >
                  <option value="">Cualquier puntuación</option>
                  <option value="4">4+ estrellas</option>
                  <option value="3">3+ estrellas</option>
                  <option value="2">2+ estrellas</option>
                  <option value="1">1+ estrellas</option>
                </Form.Select>
              </Form.Group>

              <Button 
                variant="primary" 
                className="w-100"
                onClick={handleApplyFilters}
              >
                Aplicar Filtros
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Contenido principal */}
        <Col lg={9}>
          {/* Header con ordenamiento */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Catálogo de Películas</h2>
              <p className="text-muted mb-0">
                {loading ? 'Cargando...' : `${totalElements} películas encontradas`}
              </p>
            </div>
            
            <Form.Select
              style={{ width: '200px' }}
              value={`${filtros.sortBy}|${filtros.sortDir}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Cargando películas...</p>
            </div>
          )}

          {/* Sin resultados */}
          {!loading && peliculas.length === 0 && !error && (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h4 className="mt-3">No se encontraron películas</h4>
              <p className="text-muted">
                Intenta ajustar los filtros de búsqueda
              </p>
              <Button variant="primary" onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          )}

          {/* Grid de películas */}
          {!loading && peliculas.length > 0 && (
            <>
              <Row>
                {peliculas.map(pelicula => (
                  <Col key={pelicula.id} xl={3} lg={4} md={6} className="mb-4">
                    {renderMovieCard(pelicula)}
                  </Col>
                ))}
              </Row>

              {/* Paginación */}
              {totalPages > 1 && (
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
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
                  </Col>
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CatalogPage;