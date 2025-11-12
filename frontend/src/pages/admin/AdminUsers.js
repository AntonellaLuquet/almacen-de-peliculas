import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Modal, Form, Alert, Badge, 
  InputGroup, Row, Col, Pagination 
} from 'react-bootstrap';
import usuarioService from '../../services/usuarioService';

/**
 * Gestión de usuarios del sistema
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await usuarioService.listarUsuarios();
      // Normalizar: si la respuesta tiene 'content', usar ese array
      const usersArray = Array.isArray(userData) ? userData : (userData.content || []);
      setUsers(usersArray);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    // Aseguramos que users sea un array
    let filtered = Array.isArray(users) ? users : [];

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.rol === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setIsEditing(true);
    setShowUserModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await usuarioService.updateUsuario(selectedUser.id, selectedUser);
        setUsers(users.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        ));
      }
      
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Error al guardar el usuario');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await usuarioService.updateUsuario(userId, { activo: newStatus });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, activo: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Error al actualizar el estado del usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await usuarioService.deleteUsuario(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Error al eliminar el usuario');
      }
    }
  };

  const getRoleBadge = (rol) => {
    const variants = {
      'ADMIN': 'danger',
      'USUARIO': 'primary',
      'MODERADOR': 'warning'
    };
    return <Badge bg={variants[rol] || 'secondary'}>{rol}</Badge>;
  };

  const getStatusBadge = (activo) => {
    return (
      <Badge bg={activo ? 'success' : 'secondary'}>
        {activo ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  // Paginación
  const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = safeFilteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

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
              <i className="bi bi-people me-2"></i>
              Gestión de Usuarios
            </h5>
            <Badge bg="info">{filteredUsers.length} usuarios</Badge>
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
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="ADMIN">Administradores</option>
                <option value="CLIENTE">Clientes</option>
                <option value="MODERADOR">Moderadores</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="success" 
                onClick={loadUsers}
                className="w-100"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Actualizar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <Card.Body>
          {currentUsers.length > 0 ? (
            <>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2">
                              {user.nombre.charAt(0).toUpperCase()}
                            </div>
                            {user.nombre}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{getRoleBadge(user.rol)}</td>
                        <td>{getStatusBadge(user.activo)}</td>
                        <td>
                          {new Date(user.fechaCreacion).toLocaleDateString('es-ES')}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <Button
                              variant="outline-info"
                              onClick={() => handleViewUser(user)}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button
                              variant="outline-warning"
                              onClick={() => handleEditUser(user)}
                              title="Editar usuario"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant={user.activo ? "outline-secondary" : "outline-success"}
                              onClick={() => handleToggleUserStatus(user.id, user.activo)}
                              title={user.activo ? "Desactivar" : "Activar"}
                            >
                              <i className={`bi bi-${user.activo ? 'person-slash' : 'person-check'}`}></i>
                            </Button>
                            {user.rol !== 'ADMIN' && (
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDeleteUser(user.id)}
                                title="Eliminar usuario"
                              >
                                <i className="bi bi-trash"></i>
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
              <i className="bi bi-people fs-1"></i>
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de usuario */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Usuario' : 'Detalles del Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleSaveUser}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedUser.nombre}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        nombre: e.target.value
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        email: e.target.value
                      })}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                      value={selectedUser.rol}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        rol: e.target.value
                      })}
                      disabled={!isEditing}
                    >
                      <option value="CLIENTE">Cliente</option>
                      <option value="MODERADOR">Moderador</option>
                      <option value="ADMIN">Administrador</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={selectedUser.activo ? 'true' : 'false'}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
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

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedUser.telefono || ''}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        telefono: e.target.value
                      })}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Registro</Form.Label>
                    <Form.Control
                      type="text"
                      value={new Date(selectedUser.fechaCreacion).toLocaleString('es-ES')}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              {selectedUser.direccion && (
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    value={`${selectedUser.direccion.calle} ${selectedUser.direccion.numero}, ${selectedUser.direccion.ciudad}, ${selectedUser.direccion.provincia} (${selectedUser.direccion.codigoPostal})`}
                    disabled
                  />
                </Form.Group>
              )}

              {isEditing && (
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowUserModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
        {!isEditing && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;