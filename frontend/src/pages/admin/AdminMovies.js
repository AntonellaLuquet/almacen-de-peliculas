import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Modal, Form, Alert, Badge, 
  InputGroup, Row, Col, Pagination, Image 
} from 'react-bootstrap';
import peliculasService from '../../services/peliculasService';

/**
 * Gestión de películas del sistema
 */
const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  // Opciones para los formularios
  const genres = [
    'ACCION', 'AVENTURA', 'COMEDIA', 'DRAMA', 'TERROR', 'CIENCIA_FICCION',
    'FANTASIA', 'ROMANCE', 'THRILLER', 'MISTERIO', 'DOCUMENTAL', 'ANIMACION'
  ];

  const classifications = ['ATP', '+13', '+16', '+18'];

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, genreFilter]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const movieData = await peliculasService.searchPeliculas({});
      const moviesArray = movieData.content || movieData || [];
      setMovies(moviesArray);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genreFilter) {
      filtered = filtered.filter(movie => 
        movie.generos && movie.generos.includes(genreFilter)
      );
    }

    setFilteredMovies(filtered);
    setCurrentPage(1);
  };

  const handleCreateMovie = () => {
    setSelectedMovie({
      titulo: '',
      descripcion: '',
      director: '',
      anio: new Date().getFullYear(),
      duracion: 90,
      generos: [],
      clasificacion: 'ATP',
      precio: 0,
      stock: 0,
      imagenUrl: '',
      activo: true
    });
    setIsCreating(true);
    setIsEditing(true);
    setShowMovieModal(true);
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie({ ...movie });
    setIsCreating(false);
    setIsEditing(true);
    setShowMovieModal(true);
  };

  const handleViewMovie = (movie) => {
    setSelectedMovie(movie);
    setIsCreating(false);
    setIsEditing(false);
    setShowMovieModal(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      if (isCreating) {
        const newMovie = await peliculasService.createPelicula(selectedMovie);
        setMovies([newMovie, ...movies]);
      } else {
        const updatedMovie = await peliculasService.updatePelicula(selectedMovie.id, selectedMovie);
        setMovies(movies.map(movie => 
          movie.id === selectedMovie.id ? updatedMovie : movie
        ));
      }
      
      setShowMovieModal(false);
      setSelectedMovie(null);
      setIsCreating(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving movie:', error);
      setError('Error al guardar la película');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta película?')) {
      try {
        await peliculasService.deletePelicula(movieId);
        setMovies(movies.filter(movie => movie.id !== movieId));
      } catch (error) {
        console.error('Error deleting movie:', error);
        setError('Error al eliminar la película');
      }
    }
  };

  const handleToggleMovieStatus = async (movieId, currentStatus) => {
    try {
      const movie = movies.find(m => m.id === movieId);
      const updatedMovie = { ...movie, activo: !currentStatus };
      const result = await peliculasService.updatePelicula(movieId, updatedMovie);
      
      setMovies(movies.map(movie => 
        movie.id === movieId ? result : movie
      ));
    } catch (error) {
      console.error('Error updating movie status:', error);
      setError('Error al actualizar el estado de la película');
    }
  };

  const getGenreBadges = (generos) => {
    if (!generos || generos.length === 0) return null;
    
    return generos.slice(0, 2).map((genero, index) => (
      <Badge key={index} bg="info" className="me-1">
        {genero.replace('_', ' ')}
      </Badge>
    ));
  };

  const getStatusBadge = (activo) => {
    return (
      <Badge bg={activo ? 'success' : 'secondary'}>
        {activo ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Paginación
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

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

      {/* Header y filtros */}
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-film me-2"></i>
              Gestión de Películas
            </h5>
            <div className="d-flex gap-2 align-items-center">
              <Badge bg="info">{filteredMovies.length} películas</Badge>
              <Button variant="success" onClick={handleCreateMovie}>
                <i className="bi bi-plus-circle me-2"></i>
                Nueva Película
              </Button>
            </div>
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
                  placeholder="Buscar por título o director..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="">Todos los géneros</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.replace('_', ' ')}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-primary" 
                onClick={loadMovies}
                className="w-100"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Actualizar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de películas */}
      <Card>
        <Card.Body>
          {currentMovies.length > 0 ? (
            <>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Director</th>
                      <th>Año</th>
                      <th>Géneros</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMovies.map((movie) => (
                      <tr key={movie.id}>
                        <td>
                          <Image
                            src={movie.imagenUrl || '/placeholder-movie.jpg'}
                            alt={movie.titulo}
                            width="60"
                            height="80"
                            className="object-fit-cover rounded"
                            onError={(e) => {
                              e.target.src = '/placeholder-movie.jpg';
                            }}
                          />
                        </td>
                        <td>
                          <div>
                            <strong>{movie.titulo}</strong>
                            <br />
                            <small className="text-muted">
                              {movie.duracion} min • {movie.clasificacion}
                            </small>
                          </div>
                        </td>
                        <td>{movie.director}</td>
                        <td>{movie.anio}</td>
                        <td>
                          {getGenreBadges(movie.generos)}
                          {movie.generos && movie.generos.length > 2 && (
                            <Badge bg="secondary">+{movie.generos.length - 2}</Badge>
                          )}
                        </td>
                        <td>{formatCurrency(movie.precio)}</td>
                        <td>
                          <Badge bg={movie.stock > 0 ? 'success' : 'danger'}>
                            {movie.stock} unidades
                          </Badge>
                        </td>
                        <td>{getStatusBadge(movie.activo)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <Button
                              variant="outline-info"
                              onClick={() => handleViewMovie(movie)}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button
                              variant="outline-warning"
                              onClick={() => handleEditMovie(movie)}
                              title="Editar película"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant={movie.activo ? "outline-secondary" : "outline-success"}
                              onClick={() => handleToggleMovieStatus(movie.id, movie.activo)}
                              title={movie.activo ? "Desactivar" : "Activar"}
                            >
                              <i className={`bi bi-${movie.activo ? 'eye-slash' : 'eye'}`}></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDeleteMovie(movie.id)}
                              title="Eliminar película"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
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
              <i className="bi bi-film fs-1"></i>
              <p>No se encontraron películas</p>
              <Button variant="primary" onClick={handleCreateMovie}>
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Primera Película
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de película */}
      <Modal show={showMovieModal} onHide={() => setShowMovieModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isCreating ? 'Nueva Película' : isEditing ? 'Editar Película' : 'Detalles de la Película'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovie && (
            <Form onSubmit={handleSaveMovie}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Título *</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedMovie.titulo}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        titulo: e.target.value
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Director *</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedMovie.director}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        director: e.target.value
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedMovie.descripcion}
                  onChange={(e) => setSelectedMovie({
                    ...selectedMovie,
                    descripcion: e.target.value
                  })}
                  disabled={!isEditing}
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Año *</Form.Label>
                    <Form.Control
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      value={selectedMovie.anio}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        anio: parseInt(e.target.value)
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duración (min) *</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={selectedMovie.duracion}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        duracion: parseInt(e.target.value)
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Clasificación *</Form.Label>
                    <Form.Select
                      value={selectedMovie.clasificacion}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        clasificacion: e.target.value
                      })}
                      disabled={!isEditing}
                    >
                      {classifications.map(classification => (
                        <option key={classification} value={classification}>
                          {classification}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Géneros</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <Form.Check
                      key={genre}
                      type="checkbox"
                      id={`genre-${genre}`}
                      label={genre.replace('_', ' ')}
                      checked={selectedMovie.generos && selectedMovie.generos.includes(genre)}
                      onChange={(e) => {
                        const currentGenres = selectedMovie.generos || [];
                        const newGenres = e.target.checked
                          ? [...currentGenres, genre]
                          : currentGenres.filter(g => g !== genre);
                        setSelectedMovie({
                          ...selectedMovie,
                          generos: newGenres
                        });
                      }}
                      disabled={!isEditing}
                    />
                  ))}
                </div>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        value={selectedMovie.precio}
                        onChange={(e) => setSelectedMovie({
                          ...selectedMovie,
                          precio: parseFloat(e.target.value) || 0
                        })}
                        disabled={!isEditing}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock *</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={selectedMovie.stock}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        stock: parseInt(e.target.value) || 0
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={selectedMovie.activo ? 'true' : 'false'}
                      onChange={(e) => setSelectedMovie({
                        ...selectedMovie,
                        activo: e.target.value === 'true'
                      })}
                      disabled={!isEditing}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>URL de Imagen</Form.Label>
                <Form.Control
                  type="url"
                  value={selectedMovie.imagenUrl || ''}
                  onChange={(e) => setSelectedMovie({
                    ...selectedMovie,
                    imagenUrl: e.target.value
                  })}
                  disabled={!isEditing}
                  placeholder="https://example.com/imagen.jpg"
                />
              </Form.Group>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowMovieModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    {isCreating ? 'Crear Película' : 'Guardar Cambios'}
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
        {!isEditing && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMovieModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default AdminMovies;