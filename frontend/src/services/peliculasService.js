import apiClient from './apiClient';

/**
 * Servicio para gestión de películas
 * Proporciona métodos para CRUD, búsqueda y filtrado de películas
 */
const peliculasService = {
  /**
   * Obtiene todas las películas disponibles
   * @param {object} params - Parámetros de paginación y filtros
   * @returns {Promise} - Promesa con lista paginada de películas
   */
  obtenerPeliculas: async (params = {}) => {
    const response = await apiClient.get('/peliculas', { params });
    return response.data;
  },

  /**
   * Obtiene una película por ID
   * @param {number} peliculaId - ID de la película
   * @returns {Promise} - Promesa con datos de la película
   */
  obtenerPeliculaPorId: async (peliculaId) => {
    const response = await apiClient.get(`/peliculas/${peliculaId}`);
    return response.data;
  },

  /**
   * Crea una nueva película (solo admin)
   * @param {object} peliculaData - Datos de la película
   * @returns {Promise} - Promesa con datos de la película creada
   */
  crearPelicula: async (peliculaData) => {
    const response = await apiClient.post('/peliculas', peliculaData);
    return response.data;
  },

  /**
   * Actualiza una película existente (solo admin)
   * @param {number} peliculaId - ID de la película
   * @param {object} peliculaData - Datos actualizados
   * @returns {Promise} - Promesa con datos actualizados
   */
  actualizarPelicula: async (peliculaId, peliculaData) => {
    const response = await apiClient.put(`/peliculas/${peliculaId}`, peliculaData);
    return response.data;
  },

  /**
   * Elimina una película (solo admin)
   * @param {number} peliculaId - ID de la película
   * @returns {Promise} - Promesa con confirmación
   */
  eliminarPelicula: async (peliculaId) => {
    const response = await apiClient.delete(`/peliculas/${peliculaId}`);
    return response.data;
  },

  /**
   * Busca películas por término general
   * @param {string} searchTerm - Término de búsqueda
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con resultados de búsqueda
   */
  buscarPeliculas: async (searchTerm, params = {}) => {
    const response = await apiClient.get('/peliculas/buscar', {
      params: { q: searchTerm, ...params }
    });
    return response.data;
  },

  /**
   * Búsqueda avanzada con filtros múltiples
   * @param {object} filtros - Filtros de búsqueda
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con resultados filtrados
   */
  buscarConFiltros: async (filtros, params = {}) => {
    const response = await apiClient.get('/peliculas/filtrar', {
      params: { ...filtros, ...params }
    });
    return response.data;
  },

  /**
   * Obtiene películas por género
   * @param {string} genero - Género de películas
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con películas del género
   */
  obtenerPeliculasPorGenero: async (genero, params = {}) => {
    const response = await apiClient.get(`/peliculas/genero/${genero}`, { params });
    return response.data;
  },

  /**
   * Obtiene películas más recientes
   * @param {number} limit - Límite de resultados
   * @returns {Promise} - Promesa con películas recientes
   */
  obtenerPeliculasRecientes: async (limit = 10) => {
    const response = await apiClient.get('/peliculas/recientes', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Obtiene películas más populares
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con películas populares
   */
  obtenerPeliculasPopulares: async (params = {}) => {
    const response = await apiClient.get('/peliculas/populares', { params });
    return response.data;
  },

  /**
   * Actualiza el stock de una película (solo admin)
   * @param {number} peliculaId - ID de la película
   * @param {number} nuevoStock - Nuevo valor de stock
   * @returns {Promise} - Promesa con confirmación
   */
  actualizarStock: async (peliculaId, nuevoStock) => {
    const response = await apiClient.put(`/peliculas/${peliculaId}/stock`, {
      stock: nuevoStock
    });
    return response.data;
  },

  /**
   * Obtiene géneros disponibles
   * @returns {Promise} - Promesa con lista de géneros
   */
  obtenerGeneros: async () => {
    const response = await apiClient.get('/peliculas/generos');
    return response.data;
  },

  /**
   * Obtiene años disponibles
   * @returns {Promise} - Promesa con lista de años
   */
  obtenerAnios: async () => {
    const response = await apiClient.get('/peliculas/anios');
    return response.data;
  },

  /**
   * Obtiene estadísticas del catálogo (solo admin)
   * @returns {Promise} - Promesa con estadísticas
   */
  obtenerEstadisticas: async () => {
    const response = await apiClient.get('/peliculas/estadisticas');
    return response.data;
  },

  /**
   * Obtiene películas con stock bajo (solo admin)
   * @param {number} stockMinimo - Umbral de stock bajo
   * @returns {Promise} - Promesa con películas con stock bajo
   */
  obtenerPeliculasStockBajo: async (stockMinimo = 5) => {
    const response = await apiClient.get('/peliculas/stock-bajo', {
      params: { stockMinimo }
    });
    return response.data;
  },

  /**
   * Búsqueda general de películas (alias para compatibilidad)
   * @param {object} filtros - Filtros de búsqueda
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con resultados filtrados
   */
  searchPeliculas: async (filtros = {}, params = {}) => {
    // Si no hay filtros específicos, usar obtenerPeliculas
    if (Object.keys(filtros).length === 0) {
      return await peliculasService.obtenerPeliculas(params);
    }
    
    // Si hay filtros, usar buscarConFiltros
    return await peliculasService.buscarConFiltros(filtros, params);
  },

  // Alias adicionales para compatibilidad
  createPelicula: async (peliculaData) => {
    return await peliculasService.crearPelicula(peliculaData);
  },

  updatePelicula: async (peliculaId, peliculaData) => {
    return await peliculasService.actualizarPelicula(peliculaId, peliculaData);
  },

  deletePelicula: async (peliculaId) => {
    return await peliculasService.eliminarPelicula(peliculaId);
  },

  obtenerPelicula: async (peliculaId) => {
    return await peliculasService.obtenerPeliculaPorId(peliculaId);
  }
};

export default peliculasService;