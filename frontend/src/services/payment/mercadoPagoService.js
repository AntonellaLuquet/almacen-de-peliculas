import apiClient from '../apiClient';

/**
 * Servicio para manejo de pagos con Mercado Pago
 */
class MercadoPagoService {
  
  /**
   * Crea una preferencia de pago en Mercado Pago
   * @param {Object} datosPedido - Datos del pedido y envío
   * @returns {Promise<Object>} - Respuesta con preference_id y init_point
   */
  async crearPreferencia(datosPedido) {
    try {
      const response = await apiClient.post('/api/payments/mercadopago/create-preference', datosPedido);
      return response.data;
    } catch (error) {
      console.error('Error al crear preferencia de Mercado Pago:', error);
      throw error;
    }
  }

  /**
   * Verifica el estado de un pago
   * @param {string} paymentId - ID del pago de Mercado Pago
   * @returns {Promise<Object>} - Estado del pago
   */
  async verificarPago(paymentId) {
    try {
      const response = await apiClient.get(`/api/payments/mercadopago/verify/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar pago:', error);
      throw error;
    }
  }

  /**
   * Procesa el webhook de Mercado Pago
   * @param {Object} webhookData - Datos del webhook
   * @returns {Promise<Object>} - Respuesta del procesamiento
   */
  async procesarWebhook(webhookData) {
    try {
      const response = await apiClient.post('/api/payments/mercadopago/webhook', webhookData);
      return response.data;
    } catch (error) {
      console.error('Error al procesar webhook:', error);
      throw error;
    }
  }

  /**
   * Obtiene los métodos de pago disponibles
   * @returns {Promise<Array>} - Lista de métodos de pago
   */
  async obtenerMetodosPago() {
    try {
      const response = await apiClient.get('/api/payments/mercadopago/payment-methods');
      return response.data;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  }

  /**
   * Redirige al usuario al checkout de Mercado Pago
   * @param {string} initPoint - URL de inicio del checkout
   */
  redirigirACheckout(initPoint) {
    window.location.href = initPoint;
  }

  /**
   * Abre el checkout en una nueva ventana
   * @param {string} initPoint - URL de inicio del checkout
   * @returns {Window} - Referencia a la ventana abierta
   */
  abrirCheckoutEnVentana(initPoint) {
    const ventana = window.open(
      initPoint,
      'MercadoPagoCheckout',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );
    
    return ventana;
  }

  /**
   * Maneja el retorno desde Mercado Pago
   * @param {URLSearchParams} searchParams - Parámetros de la URL de retorno
   * @returns {Object} - Información del retorno
   */
  manejarRetorno(searchParams) {
    const collection_id = searchParams.get('collection_id');
    const collection_status = searchParams.get('collection_status');
    const payment_id = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const external_reference = searchParams.get('external_reference');
    const payment_type = searchParams.get('payment_type');
    const merchant_order_id = searchParams.get('merchant_order_id');
    const preference_id = searchParams.get('preference_id');
    const site_id = searchParams.get('site_id');
    const processing_mode = searchParams.get('processing_mode');
    const merchant_account_id = searchParams.get('merchant_account_id');

    return {
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
      payment_type,
      merchant_order_id,
      preference_id,
      site_id,
      processing_mode,
      merchant_account_id
    };
  }

  /**
   * Obtiene el estado del pago basado en los parámetros de retorno
   * @param {string} status - Estado del pago
   * @param {string} collection_status - Estado de la colección
   * @returns {Object} - Información del estado del pago
   */
  obtenerEstadoPago(status, collection_status) {
    const estadoFinal = status || collection_status;
    
    switch (estadoFinal) {
      case 'approved':
        return {
          estado: 'aprobado',
          mensaje: 'Pago aprobado exitosamente',
          tipo: 'success',
          icono: 'bi-check-circle'
        };
      
      case 'pending':
        return {
          estado: 'pendiente',
          mensaje: 'Pago pendiente de procesamiento',
          tipo: 'warning',
          icono: 'bi-clock'
        };
      
      case 'in_process':
        return {
          estado: 'en_proceso',
          mensaje: 'Pago en proceso de verificación',
          tipo: 'info',
          icono: 'bi-arrow-clockwise'
        };
      
      case 'rejected':
        return {
          estado: 'rechazado',
          mensaje: 'Pago rechazado',
          tipo: 'danger',
          icono: 'bi-x-circle'
        };
      
      case 'cancelled':
        return {
          estado: 'cancelado',
          mensaje: 'Pago cancelado por el usuario',
          tipo: 'secondary',
          icono: 'bi-x-circle'
        };
      
      default:
        return {
          estado: 'desconocido',
          mensaje: 'Estado de pago desconocido',
          tipo: 'warning',
          icono: 'bi-question-circle'
        };
    }
  }
}

export default new MercadoPagoService();