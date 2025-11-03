import apiClient from './apiClient';

/**
 * Servicio para la gestión de pedidos de los usuarios
 */
class PedidoService {

  /**
   * Obtiene la lista de pedidos del usuario autenticado
   * @returns {Promise<Array>} - Lista de pedidos
   */
  async obtenerMisPedidos() {
    try {
      const response = await apiClient.get('/pedidos/mis-pedidos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis pedidos:', error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de un pedido específico por su ID
   * @param {number} pedidoId - ID del pedido
   * @returns {Promise<Object>} - Detalles del pedido
   */
  async obtenerPedidoPorId(pedidoId) {
    try {
      const response = await apiClient.get(`/pedidos/${pedidoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el pedido ${pedidoId}:`, error);
      throw error;
    }
  }

}

export default new PedidoService();
