import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Alert } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import usuarioService from '../../services/usuarioService';
import peliculasService from '../../services/peliculasService';
import pedidoService from '../../services/pedidoService';

/**
 * Página de estadísticas avanzadas del sistema
 */
const AdminStats = () => {
  const [stats, setStats] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      usersByRole: {}
    },
    movieStats: {
      totalMovies: 0,
      activeMovies: 0,
      moviesByGenre: {},
      averagePrice: 0,
      totalStock: 0
    },
    orderStats: {
      totalOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      ordersByStatus: {},
      revenueByMonth: [],
      topSellingMovies: []
    },
    performanceMetrics: {
      conversionRate: 0,
      averageItemsPerOrder: 0,
      returnCustomerRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('12'); // meses

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      const [users, movies, orders] = await Promise.all([
        usuarioService.listarUsuarios(),
        peliculasService.searchPeliculas({}),
        pedidoService.getAllPedidos()
      ]);

      const usersArray = users.content || users || [];
      const moviesArray = movies.content || movies || [];
      const ordersArray = orders.content || orders || [];

      // Calcular estadísticas de usuarios
      const userStats = calculateUserStats(usersArray);
      
      // Calcular estadísticas de películas
      const movieStats = calculateMovieStats(moviesArray);
      
      // Calcular estadísticas de pedidos
      const orderStats = calculateOrderStats(ordersArray);
      
      // Calcular métricas de rendimiento
      const performanceMetrics = calculatePerformanceMetrics(users, orders);

      setStats({
        userStats,
        movieStats,
        orderStats,
        performanceMetrics
      });

    } catch (error) {
      console.error('Error loading statistics:', error);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (users) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const usersByRole = users.reduce((acc, user) => {
      acc[user.rol] = (acc[user.rol] || 0) + 1;
      return acc;
    }, {});

    const newUsersThisMonth = users.filter(user => 
      new Date(user.fechaCreacion) >= thisMonth
    ).length;

    const activeUsers = users.filter(user => user.activo).length;

    return {
      totalUsers: users.length,
      activeUsers,
      newUsersThisMonth,
      usersByRole
    };
  };

  const calculateMovieStats = (movies) => {
    const moviesByGenre = {};
    let totalPrice = 0;
    let totalStock = 0;
    let activeMovies = 0;

    movies.forEach(movie => {
      if (movie.activo) activeMovies++;
      
      totalPrice += movie.precio || 0;
      totalStock += movie.stock || 0;
      
      if (movie.generos) {
        movie.generos.forEach(genre => {
          moviesByGenre[genre] = (moviesByGenre[genre] || 0) + 1;
        });
      }
    });

    const averagePrice = movies.length > 0 ? totalPrice / movies.length : 0;

    return {
      totalMovies: movies.length,
      activeMovies,
      moviesByGenre,
      averagePrice,
      totalStock
    };
  };

  const calculateOrderStats = (orders) => {
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.estado] = (acc[order.estado] || 0) + 1;
      return acc;
    }, {});

    const completedOrders = orders.filter(order => order.estado === 'ENTREGADO');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Ingresos por mes (últimos 12 meses)
    const revenueByMonth = generateMonthlyRevenue(completedOrders, parseInt(timeRange));
    
    // Películas más vendidas
    const movieSales = {};
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const movieTitle = item.pelicula.titulo;
          if (!movieSales[movieTitle]) {
            movieSales[movieTitle] = {
              title: movieTitle,
              quantity: 0,
              revenue: 0
            };
          }
          movieSales[movieTitle].quantity += item.cantidad;
          movieSales[movieTitle].revenue += item.cantidad * item.precio;
        });
      }
    });

    const topSellingMovies = Object.values(movieSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      revenueByMonth,
      topSellingMovies
    };
  };

  const calculatePerformanceMetrics = (users, orders) => {
    const totalUsers = users.length;
    const usersWithOrders = new Set(orders.map(order => order.usuario.id)).size;
    const conversionRate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;

    const totalItems = orders.reduce((sum, order) => 
      sum + (order.items?.length || 0), 0
    );
    const averageItemsPerOrder = orders.length > 0 ? totalItems / orders.length : 0;

    // Clientes que han realizado más de un pedido
    const customerOrderCounts = orders.reduce((acc, order) => {
      acc[order.usuario.id] = (acc[order.usuario.id] || 0) + 1;
      return acc;
    }, {});
    
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
    const returnCustomerRate = usersWithOrders > 0 ? (repeatCustomers / usersWithOrders) * 100 : 0;

    return {
      conversionRate,
      averageItemsPerOrder,
      returnCustomerRate
    };
  };

  const generateMonthlyRevenue = (orders, months) => {
    const monthlyData = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyData.push({
        month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        revenue: 0,
        orders: 0
      });
    }

    orders.forEach(order => {
      if (order.estado === 'ENTREGADO') {
        const orderDate = new Date(order.fechaPedido);
        const monthIndex = monthlyData.findIndex(m => {
          const [monthName, year] = m.month.split(' ');
          const monthDate = new Date(year, getMonthNumber(monthName), 1);
          return orderDate.getMonth() === monthDate.getMonth() && 
                 orderDate.getFullYear() === monthDate.getFullYear();
        });
        
        if (monthIndex !== -1) {
          monthlyData[monthIndex].revenue += order.total;
          monthlyData[monthIndex].orders += 1;
        }
      }
    });

    return monthlyData;
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

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Configuraciones de gráficos
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución de Ingresos Mensuales'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Películas Más Vendidas'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
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
                  <h3 className="mb-0">{stats.userStats.totalUsers}</h3>
                  <p className="text-muted mb-0">Usuarios Totales</p>
                  <small className="text-success">
                    +{stats.userStats.newUsersThisMonth} este mes
                  </small>
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
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{formatCurrency(stats.orderStats.totalRevenue)}</h3>
                  <p className="text-muted mb-0">Ingresos Totales</p>
                  <small className="text-info">
                    Promedio: {formatCurrency(stats.orderStats.averageOrderValue)}
                  </small>
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
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{formatPercentage(stats.performanceMetrics.conversionRate)}</h3>
                  <p className="text-muted mb-0">Tasa Conversión</p>
                  <small className="text-warning">
                    Retorno: {formatPercentage(stats.performanceMetrics.returnCustomerRate)}
                  </small>
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
                    <i className="bi bi-bag-check"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats.orderStats.completedOrders}</h3>
                  <p className="text-muted mb-0">Pedidos Completados</p>
                  <small className="text-success">
                    {stats.orderStats.totalOrders} totales
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos de ingresos y ventas */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Ingresos Mensuales
              </h5>
              <select 
                className="form-select form-select-sm w-auto"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="6">Últimos 6 meses</option>
                <option value="12">Últimos 12 meses</option>
                <option value="24">Últimos 24 meses</option>
              </select>
            </Card.Header>
            <Card.Body>
              <Line
                data={{
                  labels: stats.orderStats.revenueByMonth.map(item => item.month),
                  datasets: [
                    {
                      label: 'Ingresos',
                      data: stats.orderStats.revenueByMonth.map(item => item.revenue),
                      borderColor: 'rgb(25, 135, 84)',
                      backgroundColor: 'rgba(25, 135, 84, 0.1)',
                      fill: true,
                    },
                  ],
                }}
                options={lineChartOptions}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Usuarios por Rol
              </h5>
            </Card.Header>
            <Card.Body>
              <Doughnut
                data={{
                  labels: Object.keys(stats.userStats.usersByRole),
                  datasets: [
                    {
                      data: Object.values(stats.userStats.usersByRole),
                      backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(13, 110, 253, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                      ],
                      borderColor: [
                        'rgba(220, 53, 69, 1)',
                        'rgba(13, 110, 253, 1)',
                        'rgba(255, 193, 7, 1)',
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

      {/* Gráficos de películas y géneros */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-trophy me-2"></i>
                Top Películas Vendidas
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.orderStats.topSellingMovies.length > 0 ? (
                <Bar
                  data={{
                    labels: stats.orderStats.topSellingMovies
                      .slice(0, 6)
                      .map(movie => movie.title.length > 15 ? 
                        movie.title.substring(0, 15) + '...' : movie.title),
                    datasets: [
                      {
                        label: 'Unidades Vendidas',
                        data: stats.orderStats.topSellingMovies
                          .slice(0, 6)
                          .map(movie => movie.quantity),
                        backgroundColor: 'rgba(13, 110, 253, 0.8)',
                        borderColor: 'rgba(13, 110, 253, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={barChartOptions}
                />
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-film fs-1"></i>
                  <p>No hay datos de ventas</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-collection me-2"></i>
                Distribución por Géneros
              </h5>
            </Card.Header>
            <Card.Body>
              {Object.keys(stats.movieStats.moviesByGenre).length > 0 ? (
                <Doughnut
                  data={{
                    labels: Object.keys(stats.movieStats.moviesByGenre)
                      .map(genre => genre.replace('_', ' ')),
                    datasets: [
                      {
                        data: Object.values(stats.movieStats.moviesByGenre),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(54, 162, 235, 0.8)',
                          'rgba(255, 205, 86, 0.8)',
                          'rgba(75, 192, 192, 0.8)',
                          'rgba(153, 102, 255, 0.8)',
                          'rgba(255, 159, 64, 0.8)',
                          'rgba(199, 199, 199, 0.8)',
                          'rgba(83, 102, 255, 0.8)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={doughnutOptions}
                />
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-tags fs-1"></i>
                  <p>No hay datos de géneros</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de métricas detalladas */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Resumen de Inventario
              </h5>
            </Card.Header>
            <Card.Body>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td><strong>Total de Películas:</strong></td>
                    <td>{stats.movieStats.totalMovies}</td>
                  </tr>
                  <tr>
                    <td><strong>Películas Activas:</strong></td>
                    <td>{stats.movieStats.activeMovies}</td>
                  </tr>
                  <tr>
                    <td><strong>Stock Total:</strong></td>
                    <td>{stats.movieStats.totalStock} unidades</td>
                  </tr>
                  <tr>
                    <td><strong>Precio Promedio:</strong></td>
                    <td>{formatCurrency(stats.movieStats.averagePrice)}</td>
                  </tr>
                  <tr>
                    <td><strong>Items por Pedido:</strong></td>
                    <td>{stats.performanceMetrics.averageItemsPerOrder.toFixed(1)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                Estados de Pedidos
              </h5>
            </Card.Header>
            <Card.Body>
              <Table size="sm">
                <tbody>
                  {Object.entries(stats.orderStats.ordersByStatus).map(([status, count]) => (
                    <tr key={status}>
                      <td><strong>{status}:</strong></td>
                      <td>{count} pedidos</td>
                      <td>
                        <div className="progress" style={{height: '8px'}}>
                          <div 
                            className="progress-bar" 
                            style={{
                              width: `${(count / stats.orderStats.totalOrders) * 100}%`,
                              backgroundColor: getStatusColor(status)
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Función auxiliar para colores de estado
const getStatusColor = (status) => {
  const colors = {
    'PENDIENTE': '#ffc107',
    'PROCESANDO': '#17a2b8',
    'ENVIADO': '#007bff',
    'ENTREGADO': '#28a745',
    'CANCELADO': '#dc3545'
  };
  return colors[status] || '#6c757d';
};

export default AdminStats;