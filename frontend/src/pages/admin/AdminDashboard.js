import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Table, Alert } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import usuarioService from '../../services/usuarioService';
import peliculasService from '../../services/peliculasService';
import pedidoService from '../../services/pedidoService';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

/**
 * Dashboard principal de administración con métricas y gráficos
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topMovies: [],
    userRegistrations: [],
    ordersByStatus: {},
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas básicas
      const [users, movies, orders] = await Promise.all([
        usuarioService.listarUsuarios(),
        peliculasService.searchPeliculas({}),
        pedidoService.getAllPedidos()
      ]);

      // Calcular métricas
      const totalRevenue = orders.reduce((sum, order) => 
        order.estadoPedido === 'ENTREGADO' ? sum + order.total : sum, 0
      );

      // Pedidos por estado
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.estadoPedido] = (acc[order.estadoPedido] || 0) + 1;
        return acc;
      }, {});

      // Top 5 películas más vendidas
      const movieSales = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          movieSales[item.pelicula.titulo] = 
            (movieSales[item.pelicula.titulo] || 0) + item.cantidad;
        });
      });

      const topMovies = Object.entries(movieSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([titulo, ventas]) => ({ titulo, ventas }));

      // Registros de usuarios por mes (últimos 6 meses)
      const userRegistrations = generateMonthlyData(users, 'fechaCreacion');
      
      // Ingresos mensuales (últimos 6 meses)
      const monthlyRevenue = generateMonthlyRevenue(orders);

      setStats({
        totalUsers: users.length,
        totalMovies: movies.content?.length || movies.length || 0,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders: orders.slice(0, 10),
        topMovies,
        userRegistrations,
        ordersByStatus,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (data, dateField) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        count: 0
      });
    }

    data.forEach(item => {
      const itemDate = new Date(item[dateField]);
      const monthIndex = months.findIndex(m => {
        const [monthName, year] = m.month.split(' ');
        const monthDate = new Date(year, getMonthNumber(monthName), 1);
        return itemDate.getMonth() === monthDate.getMonth() && 
               itemDate.getFullYear() === monthDate.getFullYear();
      });
      
      if (monthIndex !== -1) {
        months[monthIndex].count++;
      }
    });

    return months;
  };

  const generateMonthlyRevenue = (orders) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        revenue: 0
      });
    }

    orders.forEach(order => {
      if (order.estadoPedido === 'ENTREGADO') {
        const orderDate = new Date(order.fechaPedido);
        const monthIndex = months.findIndex(m => {
          const [monthName, year] = m.month.split(' ');
          const monthDate = new Date(year, getMonthNumber(monthName), 1);
          return orderDate.getMonth() === monthDate.getMonth() && 
                 orderDate.getFullYear() === monthDate.getFullYear();
        });
        
        if (monthIndex !== -1) {
          months[monthIndex].revenue += order.total;
        }
      }
    });

    return months;
  };

  const getMonthNumber = (monthName) => {
    const months = {
      'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3,
      'may': 4, 'jun': 5, 'jul': 6, 'ago': 7,
      'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };
    return months[monthName] || 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
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

  // Configuración de gráficos
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución Mensual'
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Estados de Pedidos'
      },
    },
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div>
      {/* Métricas principales */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-primary">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats.totalUsers}</h3>
                  <p className="text-muted mb-0">Usuarios Registrados</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-success">
                    <i className="bi bi-film"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats.totalMovies}</h3>
                  <p className="text-muted mb-0">Películas en Catálogo</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-info">
                    <i className="bi bi-bag-check"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats.totalOrders}</h3>
                  <p className="text-muted mb-0">Pedidos Realizados</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-warning">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{formatCurrency(stats.totalRevenue)}</h3>
                  <p className="text-muted mb-0">Ingresos Totales</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Evolución de Registros e Ingresos
              </h5>
            </Card.Header>
            <Card.Body>
              <Line
                data={{
                  labels: stats.userRegistrations.map(item => item.month),
                  datasets: [
                    {
                      label: 'Nuevos Usuarios',
                      data: stats.userRegistrations.map(item => item.count),
                      borderColor: 'rgb(53, 162, 235)',
                      backgroundColor: 'rgba(53, 162, 235, 0.2)',
                      yAxisID: 'y',
                    },
                    {
                      label: 'Ingresos (ARS)',
                      data: stats.monthlyRevenue.map(item => item.revenue),
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      yAxisID: 'y1',
                    },
                  ],
                }}
                options={{
                  ...lineChartOptions,
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Estado de Pedidos
              </h5>
            </Card.Header>
            <Card.Body>
              <Doughnut
                data={{
                  labels: Object.keys(stats.ordersByStatus),
                  datasets: [
                    {
                      data: Object.values(stats.ordersByStatus),
                      backgroundColor: [
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(13, 202, 240, 0.8)',
                        'rgba(13, 110, 253, 0.8)',
                        'rgba(25, 135, 84, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                      ],
                      borderColor: [
                        'rgba(255, 193, 7, 1)',
                        'rgba(13, 202, 240, 1)',
                        'rgba(13, 110, 253, 1)',
                        'rgba(25, 135, 84, 1)',
                        'rgba(220, 53, 69, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Películas más vendidas y pedidos recientes */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-trophy me-2"></i>
                Películas Más Vendidas
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.topMovies.length > 0 ? (
                <Bar
                  data={{
                    labels: stats.topMovies.map(movie => movie.titulo),
                    datasets: [
                      {
                        label: 'Unidades Vendidas',
                        data: stats.topMovies.map(movie => movie.ventas),
                        backgroundColor: 'rgba(25, 135, 84, 0.8)',
                        borderColor: 'rgba(25, 135, 84, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-film fs-1"></i>
                  <p>No hay datos de ventas disponibles</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Pedidos Recientes
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.recentOrders.length > 0 ? (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table striped hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.usuario.nombre}</td>
                          <td>{formatCurrency(order.total)}</td>
                          <td>{getStatusBadge(order.estadoPedido)}</td>
                          <td>
                            {new Date(order.fechaPedido).toLocaleDateString('es-ES')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-bag fs-1"></i>
                  <p>No hay pedidos recientes</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;