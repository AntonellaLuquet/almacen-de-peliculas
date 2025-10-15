import apiClient from './apiClient';

/**
 * Servicio para gestión del carrito y pedidos
 * Proporciona métodos para manejar el carrito de compras y crear pedidos
 */
const pedidoService = {
  /**
   * Obtiene el carrito del usuario autenticado
   * @returns {Promise} - Promesa con datos del carrito
   */
  obtenerCarrito: async () => {
    const response = await apiClient.get('/carrito');
    return response.data;
  },

  /**
   * Agrega un item al carrito
   * @param {number} peliculaId - ID de la película
   * @param {number} cantidad - Cantidad a agregar
   * @returns {Promise} - Promesa con carrito actualizado
   */
  agregarItemCarrito: async (peliculaId, cantidad = 1) => {
    const response = await apiClient.post('/carrito/items', {
      peliculaId,
      cantidad
    });
    return response.data;
  },

  /**
   * Actualiza la cantidad de un item en el carrito
   * @param {number} itemId - ID del item
   * @param {number} cantidad - Nueva cantidad
   * @returns {Promise} - Promesa con carrito actualizado
   */
  actualizarItemCarrito: async (itemId, cantidad) => {
    const response = await apiClient.put(`/carrito/items/${itemId}`, {
      cantidad
    });
    return response.data;
  },

  /**
   * Elimina un item del carrito
   * @param {number} itemId - ID del item
   * @returns {Promise} - Promesa con carrito actualizado
   */
  eliminarItemCarrito: async (itemId) => {
    const response = await apiClient.delete(`/carrito/items/${itemId}`);
    return response.data;
  },

  /**
   * Vacía completamente el carrito
   * @returns {Promise} - Promesa con confirmación
   */
  limpiarCarrito: async () => {
    const response = await apiClient.delete('/carrito');
    return response.data;
  },

  /**
   * Crea un pedido a partir del carrito actual
   * @param {object} datosEnvio - Datos de envío y pago
   * @returns {Promise} - Promesa con datos del pedido creado
   */
  crearPedido: async (datosEnvio) => {
    const response = await apiClient.post('/pedidos', datosEnvio);
    return response.data;
  },

  /**
   * Obtiene los pedidos del usuario
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con lista de pedidos
   */
  obtenerPedidos: async (params = {}) => {
    const response = await apiClient.get('/pedidos', { params });
    return response.data;
  },

  /**
   * Obtiene un pedido específico por ID
   * @param {number} pedidoId - ID del pedido
   * @returns {Promise} - Promesa con datos del pedido
   */
  obtenerPedidoPorId: async (pedidoId) => {
    const response = await apiClient.get(`/pedidos/${pedidoId}`);
    return response.data;
  },

  /**
   * Cancela un pedido
   * @param {number} pedidoId - ID del pedido
   * @returns {Promise} - Promesa con confirmación
   */
  cancelarPedido: async (pedidoId) => {
    const response = await apiClient.put(`/pedidos/${pedidoId}/cancelar`);
    return response.data;
  },

  /**
   * Obtiene todos los pedidos (solo admin)
   * @param {object} params - Parámetros de paginación y filtros
   * @returns {Promise} - Promesa con lista de todos los pedidos
   */
  obtenerTodosPedidos: async (params = {}) => {
    const response = await apiClient.get('/pedidos/admin/todos', { params });
    return response.data;
  },

  /**
   * Actualiza el estado de un pedido (solo admin)
   * @param {number} pedidoId - ID del pedido
   * @param {string} nuevoEstado - Nuevo estado del pedido
   * @returns {Promise} - Promesa con pedido actualizado
   */
  actualizarEstadoPedido: async (pedidoId, nuevoEstado) => {
    const response = await apiClient.put(`/pedidos/admin/${pedidoId}/estado`, {
      estado: nuevoEstado
    });
    return response.data;
  },

  /**
   * Obtiene estadísticas de pedidos (solo admin)
   * @returns {Promise} - Promesa con estadísticas
   */
  obtenerEstadisticasPedidos: async () => {
    const response = await apiClient.get('/pedidos/admin/estadisticas');
    return response.data;
  }
};

export default pedidoService;