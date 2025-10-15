import api from './api';

/**
 * Servicio para gestión de pedidos y carrito.
 * 
 * Proporciona funciones para:
 * - Gestión del carrito de compras
 * - Procesamiento de pedidos
 * - Consulta de historial de pedidos
 */
const pedidoService = {
  /**
   * Obtiene el carrito del usuario actual.
   */
  obtenerCarrito: async () => {
    const response = await api.get('/pedidos/carrito');
    return response.data;
  },

  /**
   * Agrega un ítem al carrito.
   */
  agregarAlCarrito: async (peliculaId, cantidad) => {
    const response = await api.post('/pedidos/carrito/items', {
      peliculaId,
      cantidad,
    });
    return response.data;
  },

  /**
   * Actualiza la cantidad de un ítem en el carrito.
   */
  actualizarItemCarrito: async (itemId, cantidad) => {
    const response = await api.put(`/pedidos/carrito/items/${itemId}`, {
      cantidad,
    });
    return response.data;
  },

  /**
   * Elimina un ítem del carrito.
   */
  eliminarItemCarrito: async (itemId) => {
    const response = await api.delete(`/pedidos/carrito/items/${itemId}`);
    return response.data;
  },

  /**
   * Procesa la compra y crea un pedido.
   */
  confirmarPedido: async (pedidoData) => {
    const response = await api.post('/pedidos/confirmar', pedidoData);
    return response.data;
  },

  /**
   * Obtiene el historial de pedidos del usuario.
   */
  obtenerPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  /**
   * Obtiene los detalles de un pedido específico.
   */
  obtenerPedido: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },
};

export default pedidoService;
