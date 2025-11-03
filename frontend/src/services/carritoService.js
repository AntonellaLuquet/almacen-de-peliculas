import apiClient from './apiClient';

/**
 * Servicio para la gestión del carrito de compras y el proceso de checkout
 */
class CarritoService {

  async getCarrito() {
    try {
      const response = await apiClient.get('/carrito');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  }

  async agregarItem(peliculaId, cantidad) {
    try {
      const response = await apiClient.post('/carrito/agregar', { peliculaId, cantidad });
      return response.data;
    } catch (error) {
      console.error('Error al agregar item al carrito:', error);
      throw error;
    }
  }

  async actualizarItem(itemId, cantidad) {
    try {
      const response = await apiClient.put(`/carrito/actualizar/${itemId}`, { cantidad });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar item del carrito:', error);
      throw error;
    }
  }

  async eliminarItem(itemId) {
    try {
      const response = await apiClient.delete(`/carrito/eliminar/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar item del carrito:', error);
      throw error;
    }
  }

  async vaciarCarrito() {
    try {
      const response = await apiClient.post('/carrito/vaciar');
      return response.data;
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      throw error;
    }
  }

  /**
   * Finaliza la compra y crea un pedido
   * @param {Object} datosPedido - Datos del formulario de checkout
   * @param {string} metodoPago - Método de pago seleccionado ('EFECTIVO', 'MERCADOPAGO')
   */
  async checkout(datosPedido, metodoPago) {
    try {
      const response = await apiClient.post('/carrito/checkout', { ...datosPedido, metodoPago });
      return response.data;
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      throw error;
    }
  }
}

export default new CarritoService();
