import api from './api';

/**
 * Servicio para gestión de usuarios.
 * 
 * Proporciona funciones para:
 * - Registro de nuevos usuarios
 * - Login y autenticación
 * - Obtención y actualización de perfil
 */
const usuarioService = {
  /**
   * Registra un nuevo usuario.
   */
  registro: async (userData) => {
    const response = await api.post('/usuarios/registro', userData);
    return response.data;
  },

  /**
   * Autentica un usuario y retorna el token.
   */
  login: async (credentials) => {
    const response = await api.post('/usuarios/login', credentials);
    return response.data;
  },

  /**
   * Obtiene el perfil del usuario autenticado.
   */
  obtenerPerfil: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario.
   */
  actualizarPerfil: async (userData) => {
    const response = await api.put('/usuarios/perfil', userData);
    return response.data;
  },
};

export default usuarioService;
