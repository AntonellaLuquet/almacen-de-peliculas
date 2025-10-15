import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Badge, Form, FormControl, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/**
 * Componente Header con navegación principal
 */
const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Maneja el logout del usuario
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /**
   * Maneja la búsqueda de películas
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  /**
   * Verifica si una ruta está activa
   */
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo/Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-film me-2"></i>
          Almacén de Películas
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Enlaces de navegación principales */}
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActiveRoute('/') ? 'active fw-semibold' : ''}
            >
              <i className="bi bi-house me-1"></i>
              Inicio
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/catalogo" 
              className={isActiveRoute('/catalogo') ? 'active fw-semibold' : ''}
            >
              <i className="bi bi-collection me-1"></i>
              Catálogo
            </Nav.Link>
          </Nav>

          {/* Barra de búsqueda */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Buscar películas..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: '200px' }}
            />
            <Button variant="outline-light" type="submit" size="sm">
              <i className="bi bi-search"></i>
            </Button>
          </Form>

          {/* Navegación de usuario */}
          <Nav>
            {isAuthenticated ? (
              <>
                {/* Carrito */}
                <Nav.Link 
                  as={Link} 
                  to="/carrito" 
                  className={`position-relative ${isActiveRoute('/carrito') ? 'active fw-semibold' : ''}`}
                >
                  <i className="bi bi-cart me-1"></i>
                  Carrito
                  {totalItems > 0 && (
                    <Badge 
                      bg="danger" 
                      pill 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>

                {/* Menú de usuario */}
                <NavDropdown 
                  title={
                    <>
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.nombre || 'Usuario'}
                    </>
                  } 
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/perfil">
                    <i className="bi bi-person me-2"></i>
                    Mi Perfil
                  </NavDropdown.Item>
                  
                  <NavDropdown.Item as={Link} to="/mis-pedidos">
                    <i className="bi bi-bag me-2"></i>
                    Mis Pedidos
                  </NavDropdown.Item>
                  
                  {user?.rol === 'ADMIN' && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin">
                        <i className="bi bi-gear me-2"></i>
                        Administración
                      </NavDropdown.Item>
                    </>
                  )}
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                {/* Enlaces para usuarios no autenticados */}
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className={isActiveRoute('/login') ? 'active fw-semibold' : ''}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Iniciar Sesión
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/register"
                  className={isActiveRoute('/register') ? 'active fw-semibold' : ''}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;