import api from './api';

/**
 * Servicio para gestión de películas.
 * 
 * Proporciona funciones para:
 * - Listar catálogo de películas
 * - Obtener detalles de una película
 * - Buscar y filtrar películas
 */
const peliculasService = {
  /**
   * Obtiene el catálogo completo de películas.
   */
  obtenerCatalogo: async (params = {}) => {
    const response = await api.get('/peliculas', { params });
    return response.data;
  },

  /**
   * Obtiene los detalles de una película específica.
   */
  obtenerPelicula: async (id) => {
    const response = await api.get(`/peliculas/${id}`);
    return response.data;
  },

  /**
   * Busca películas por título, género u otros criterios.
   */
  buscarPeliculas: async (criterio) => {
    const response = await api.get('/peliculas/buscar', { params: criterio });
    return response.data;
  },

  /**
   * Crea una nueva película (solo ADMIN).
   */
  crearPelicula: async (peliculaData) => {
    const response = await api.post('/peliculas', peliculaData);
    return response.data;
  },

  /**
   * Actualiza una película existente (solo ADMIN).
   */
  actualizarPelicula: async (id, peliculaData) => {
    const response = await api.put(`/peliculas/${id}`, peliculaData);
    return response.data;
  },
};

export default peliculasService;
