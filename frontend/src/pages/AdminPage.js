import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminMovies from './AdminMovies';
import AdminOrders from './AdminOrders';
import AdminStats from './AdminStats';

/**
 * Página principal de administración con navegación por tabs
 */
const AdminPage = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                <i className="bi bi-gear-wide-connected me-2"></i>
                Panel de Administración
              </h2>
              <p className="text-muted mb-0">
                Gestión completa del sistema Almacén de Películas
              </p>
            </div>
          </div>

          <Tab.Container defaultActiveKey={currentPath}>
            <Row>
              {/* Navegación lateral */}
              <Col lg={2} className="mb-4">
                <Nav variant="pills" className="flex-column admin-nav">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="dashboard" 
                      href="/admin/dashboard"
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="users" 
                      href="/admin/users"
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-people me-2"></i>
                      Usuarios
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="movies" 
                      href="/admin/movies"
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-film me-2"></i>
                      Películas
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="orders" 
                      href="/admin/orders"
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      Pedidos
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="stats" 
                      href="/admin/stats"
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Estadísticas
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>

              {/* Contenido principal */}
              <Col lg={10}>
                <Routes>
                  <Route path="/" element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="movies" element={<AdminMovies />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="stats" element={<AdminStats />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;