import apiClient from './apiClient';

/**
 * Servicio para gestión de usuarios
 * Proporciona métodos para registro, login, perfil y administración de usuarios
 */
const usuarioService = {
  /**
   * Registra un nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise} - Promesa con los datos del usuario registrado
   */
  registrar: async (userData) => {
    const response = await apiClient.post('/usuarios/registro', userData);
    return response.data;
  },

  /**
   * Inicia sesión de usuario
   * @param {object} credentials - Credenciales (email y password)
   * @returns {Promise} - Promesa con token y datos del usuario
   */
  login: async (credentials) => {
    const response = await apiClient.post('/usuarios/login', credentials);
    return response.data;
  },

  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise} - Promesa con datos del perfil
   */
  obtenerPerfil: async () => {
    const response = await apiClient.get('/usuarios/perfil');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario
   * @param {object} profileData - Datos actualizados del perfil
   * @returns {Promise} - Promesa con datos actualizados
   */
  actualizarPerfil: async (profileData) => {
    const response = await apiClient.put('/usuarios/perfil', profileData);
    return response.data;
  },

  /**
   * Cambia el password del usuario
   * @param {object} passwordData - Password actual y nuevo
   * @returns {Promise} - Promesa con confirmación
   */
  cambiarPassword: async (passwordData) => {
    const response = await apiClient.put('/usuarios/password', passwordData);
    return response.data;
  },

  /**
   * Verifica si un email está disponible
   * @param {string} email - Email a verificar
   * @returns {Promise} - Promesa con disponibilidad
   */
  verificarEmailDisponible: async (email) => {
    const response = await apiClient.get(`/usuarios/email-disponible?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  /**
   * Lista usuarios (solo admin)
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con lista paginada de usuarios
   */
  listarUsuarios: async (params = {}) => {
    const response = await apiClient.get('/usuarios', { params });
    return response.data;
  },

  /**
   * Busca usuarios por término (solo admin)
   * @param {string} searchTerm - Término de búsqueda
   * @param {object} params - Parámetros de paginación
   * @returns {Promise} - Promesa con resultados de búsqueda
   */
  buscarUsuarios: async (searchTerm, params = {}) => {
    const response = await apiClient.get('/usuarios/buscar', { 
      params: { q: searchTerm, ...params }
    });
    return response.data;
  },

  /**
   * Desactiva un usuario (solo admin)
   * @param {number} userId - ID del usuario
   * @returns {Promise} - Promesa con confirmación
   */
  desactivarUsuario: async (userId) => {
    const response = await apiClient.delete(`/usuarios/${userId}`);
    return response.data;
  },

  /**
   * Reactiva un usuario (solo admin)
   * @param {number} userId - ID del usuario
   * @returns {Promise} - Promesa con confirmación
   */
  reactivarUsuario: async (userId) => {
    const response = await apiClient.put(`/usuarios/${userId}/reactivar`);
    return response.data;
  },

  /**
   * Obtiene estadísticas de usuarios (solo admin)
   * @returns {Promise} - Promesa con estadísticas
   */
  obtenerEstadisticas: async () => {
    const response = await apiClient.get('/usuarios/estadisticas');
    return response.data;
  },

  /**
   * Obtiene todos los usuarios (solo admin) - usa listarUsuarios con tamaño grande
   * @returns {Promise} - Promesa con lista de todos los usuarios
   */
  getAllUsuarios: async () => {
    const response = await usuarioService.listarUsuarios({ size: 1000 });
    return response.content || response; // Devuelve el contenido de la página
  }
};

export default usuarioService;