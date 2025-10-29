/**
 * Utilidades y constantes para la aplicación
 */

// URL base de la API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Clave para almacenar el token en localStorage
export const TOKEN_KEY = 'almacen_token';

// Clave para almacenar datos del usuario en localStorage
export const USER_KEY = 'almacen_user';

/**
 * Formatea un precio como moneda
 * @param {number} precio - El precio a formatear
 * @returns {string} - Precio formateado
 */
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(precio);
};

/**
 * Formatea una fecha
 * @param {string|Date} fecha - La fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null} - Token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Guarda el token de autenticación en localStorage
 * @param {string} token - Token JWT
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Elimina el token de autenticación del localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Obtiene los datos del usuario del localStorage
 * @returns {object|null} - Datos del usuario o null si no existe
 */
export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Guarda los datos del usuario en localStorage
 * @param {object} user - Datos del usuario
 */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Elimina los datos del usuario del localStorage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Limpia toda la información de autenticación
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si está autenticado
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

/**
 * Verifica si el usuario es administrador
 * @returns {boolean} - true si es administrador
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.rol === 'ADMIN';
};

/**
 * Convierte los géneros del backend a formato legible
 * @param {string} genero - Género en formato backend
 * @returns {string} - Género formateado
 */
export const formatearGenero = (genero) => {
  const generos = {
    'ACCION': 'Acción',
    'AVENTURA': 'Aventura',
    'CIENCIA_FICCION': 'Ciencia Ficción',
    'COMEDIA': 'Comedia',
    'DRAMA': 'Drama',
    'FANTASIA': 'Fantasía',
    'HORROR': 'Horror',
    'MUSICAL': 'Musical',
    'ROMANCE': 'Romance',
    'THRILLER': 'Thriller',
    'WESTERN': 'Western',
    'DOCUMENTAL': 'Documental',
    'ANIMACION': 'Animación',
    'BIOGRAFIA': 'Biografía',
    'CRIMEN': 'Crimen',
    'FAMILIAR': 'Familiar',
    'GUERRA': 'Guerra',
    'HISTORIA': 'Historia',
    'MISTERIO': 'Misterio',
    'DEPORTES': 'Deportes'
  };
  
  return generos[genero] || genero;
};

/**
 * Maneja errores de respuesta HTTP
 * @param {object} error - Error de axios
 * @returns {string} - Mensaje de error legible
 */
export const handleHttpError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de error
    const { status, data } = error.response;
    
    if (status === 401) {
      return 'No estás autorizado. Por favor, inicia sesión.';
    }
    
    if (status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }
    
    if (status === 404) {
      return 'El recurso solicitado no fue encontrado.';
    }
    
    if (status === 500) {
      return 'Error interno del servidor. Por favor, inténtalo más tarde.';
    }
    
    // Devolver mensaje del servidor si está disponible
    return data?.message || data?.error || `Error ${status}`;
  }
  
  if (error.request) {
    // La petición se hizo pero no se recibió respuesta
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  }
  
  // Error en la configuración de la petición
  return 'Error inesperado. Por favor, inténtalo de nuevo.';
};

/**
 * Debounce función - retrasa la ejecución de una función
 * @param {function} func - Función a ejecutar
 * @param {number} delay - Tiempo de retraso en ms
 * @returns {function} - Función con debounce aplicado
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valida un password
 * @param {string} password - Password a validar
 * @returns {object} - Resultado de validación con errores
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Debe tener al menos 6 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe tener al menos una mayúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Debe tener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};