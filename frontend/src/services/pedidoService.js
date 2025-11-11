import apiClient from './apiClient';

/**
 * Servicio para la gestión de pedidos de los usuarios
 */
class PedidoService {

    // --- AÑADIR ESTA FUNCIÓN PARA PEDIDOS---
      /**
       * Obtiene todos los pedidos del sistema (requiere rol de admin).
       * @returns {Promise<Array>} - Lista de todos los pedidos.
       */
      async getAllPedidos() {
        try {
          // Llama al nuevo endpoint GET /pedidos que creamos en el backend
          const response = await apiClient.get('/pedidos/admin/todos');
          return response.data;
        } catch (error) {
          console.error('Error al obtener todos los pedidos:', error);
          throw error;
        }
      }

    // Agrega aquí la función que falta para actualizar el estado
      async updateEstadoPedido(pedidoId, nuevoEstado) {
        try {
          // Asumo que el endpoint será un PUT o PATCH. Vamos a usar PUT.
          const response = await apiClient.put(`/pedidos/${pedidoId}/estado`, { estado: nuevoEstado });
          return response.data;
        } catch (error) {
          console.error(`Error al actualizar el estado del pedido ${pedidoId}:`, error);
          throw error;
        }
      }

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
  async getPedidoById(pedidoId) {
    try {
      const response = await apiClient.get(`/pedidos/admin/${pedidoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el pedido ${pedidoId}:`, error);
      throw error;
    }
  }

}

export default new PedidoService();
