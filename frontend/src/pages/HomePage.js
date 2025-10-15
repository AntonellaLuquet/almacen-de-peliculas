import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import peliculasService from '../services/peliculasService';

/**
 * Página principal de la aplicación
 */
const HomePage = () => {
  const [peliculasDestacadas, setPeliculasDestacadas] = useState([]);
  const [ultimasNovedades, setUltimasNovedades] = useState([]);
  const [mejoresPuntuadas, setMejoresPuntuadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga los datos iniciales de la página
   */
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        
        // Cargar películas destacadas (primeras 6)
        const destacadas = await peliculasService.buscarPeliculas({
          page: 0,
          size: 6,
          sortBy: 'fechaCreacion',
          sortDir: 'desc'
        });
        
        // Cargar últimas novedades (últimas 8)
        const novedades = await peliculasService.buscarPeliculas({
          page: 0,
          size: 8,
          sortBy: 'fechaCreacion',
          sortDir: 'desc'
        });
        
        // Cargar mejor puntuadas (top 6)
        const mejores = await peliculasService.buscarPeliculas({
          page: 0,
          size: 6,
          sortBy: 'puntuacion',
          sortDir: 'desc'
        });
        
        setPeliculasDestacadas(destacadas.content || []);
        setUltimasNovedades(novedades.content || []);
        setMejoresPuntuadas(mejores.content || []);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar el contenido de la página');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  /**
   * Renderiza una tarjeta de película
   */
  const renderMovieCard = (pelicula) => (
    <Card key={pelicula.id} className="movie-card h-100 fade-in">
      <Card.Img 
        variant="top" 
        src={pelicula.posterUrl || '/images/no-poster.jpg'} 
        alt={pelicula.titulo}
        className="movie-poster"
        style={{ height: '300px', objectFit: 'cover' }}
      />
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
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            {pelicula.anio}
          </small>
          {pelicula.puntuacion && (
            <span className="ms-3">
              <i className="bi bi-star-fill text-warning me-1"></i>
              {pelicula.puntuacion.toFixed(1)}
            </span>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="movie-price fw-bold">
              ${pelicula.precio?.toFixed(2)}
            </span>
            <Button 
              as={Link} 
              to={`/pelicula/${pelicula.id}`}
              variant="primary" 
              size="sm"
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border spinner-border-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Bienvenido al Almacén de Películas
              </h1>
              <p className="lead mb-4">
                Descubre las mejores películas, desde los últimos estrenos hasta 
                los clásicos más queridos del cine. Tu entretenimiento favorito 
                está aquí.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/catalogo" variant="primary" size="lg">
                  <i className="bi bi-collection me-2"></i>
                  Explorar Catálogo
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Únete Ahora
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <i className="bi bi-film display-1 opacity-75"></i>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Películas Destacadas Carousel */}
      {peliculasDestacadas.length > 0 && (
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-5">
              <i className="bi bi-stars me-2"></i>
              Películas Destacadas
            </h2>
            <Carousel indicators={false} controls={true}>
              {peliculasDestacadas.map((pelicula) => (
                <Carousel.Item key={pelicula.id}>
                  <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                      <Card className="text-center border-0 shadow">
                        <Card.Img 
                          variant="top"
                          src={pelicula.posterUrl || '/images/no-poster.jpg'}
                          alt={pelicula.titulo}
                          style={{ height: '400px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title className="h4">{pelicula.titulo}</Card.Title>
                          <Card.Text className="text-muted">
                            {pelicula.descripcion?.substring(0, 150)}...
                          </Card.Text>
                          <Button 
                            as={Link} 
                            to={`/pelicula/${pelicula.id}`}
                            variant="primary"
                          >
                            Ver Película
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        </section>
      )}

      {/* Últimas Novedades */}
      {ultimasNovedades.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="text-center">
                  <i className="bi bi-clock me-2"></i>
                  Últimas Novedades
                </h2>
                <p className="text-center text-muted">
                  Los estrenos más recientes llegaron a nuestro catálogo
                </p>
              </Col>
            </Row>
            <Row>
              {ultimasNovedades.slice(0, 4).map((pelicula) => (
                <Col key={pelicula.id} lg={3} md={6} className="mb-4">
                  {renderMovieCard(pelicula)}
                </Col>
              ))}
            </Row>
            <Row className="mt-4">
              <Col className="text-center">
                <Button 
                  as={Link} 
                  to="/catalogo?sortBy=fechaCreacion&sortDir=desc"
                  variant="outline-primary"
                >
                  Ver Todas las Novedades
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Mejor Puntuadas */}
      {mejoresPuntuadas.length > 0 && (
        <section className="py-5">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="text-center">
                  <i className="bi bi-trophy me-2"></i>
                  Mejor Puntuadas
                </h2>
                <p className="text-center text-muted">
                  Las películas favoritas de nuestros usuarios
                </p>
              </Col>
            </Row>
            <Row>
              {mejoresPuntuadas.slice(0, 3).map((pelicula) => (
                <Col key={pelicula.id} lg={4} md={6} className="mb-4">
                  {renderMovieCard(pelicula)}
                </Col>
              ))}
            </Row>
            <Row className="mt-4">
              <Col className="text-center">
                <Button 
                  as={Link} 
                  to="/catalogo?sortBy=puntuacion&sortDir=desc"
                  variant="outline-primary"
                >
                  Ver Todas las Mejor Puntuadas
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Características del Servicio */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row>
            <Col md={4} className="text-center mb-4">
              <i className="bi bi-truck display-4 mb-3"></i>
              <h4>Envío Rápido</h4>
              <p>Recibe tus películas en 24-48 horas</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <i className="bi bi-shield-check display-4 mb-3"></i>
              <h4>Compra Segura</h4>
              <p>Tus datos protegidos con la mejor seguridad</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <i className="bi bi-headset display-4 mb-3"></i>
              <h4>Soporte 24/7</h4>
              <p>Atención al cliente cuando lo necesites</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={6}>
              <h3 className="mb-3">¡No te pierdas nada!</h3>
              <p className="text-muted mb-4">
                Suscríbete a nuestro newsletter y recibe las últimas novedades 
                y ofertas exclusivas
              </p>
              <div className="d-flex">
                <input 
                  type="email" 
                  className="form-control me-2" 
                  placeholder="Tu email..."
                />
                <Button variant="primary">
                  Suscribirse
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;