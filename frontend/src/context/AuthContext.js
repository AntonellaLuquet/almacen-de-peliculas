import React, { createContext, useContext, useReducer, useEffect } from 'react';
import usuarioService from '../services/usuarioService';
import { getUser, setUser, getToken, setToken, clearAuth, isAuthenticated } from '../utils/helpers';

/**
 * Contexto de autenticación para manejar el estado del usuario
 */
const AuthContext = createContext();

// Estados y acciones del reducer
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Estado inicial
const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null
};

// Reducer para manejar las acciones de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

/**
 * Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Inicia sesión del usuario
   * @param {object} credentials - Credenciales de login
   */
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await usuarioService.login(credentials);
      const { token, usuario } = response;
      
      // Guardar en localStorage
      setToken(token);
      setUser(usuario);
      
      // Actualizar estado
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: usuario, token }
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Registra un nuevo usuario
   * @param {object} userData - Datos del usuario
   */
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await usuarioService.registrar(userData);
      
      // Después del registro, hacer login automático
      await login({
        email: userData.email,
        password: userData.password
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Cierra sesión del usuario
   */
  const logout = () => {
    clearAuth();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  /**
   * Actualiza el perfil del usuario
   * @param {object} profileData - Datos actualizados del perfil
   */
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const updatedUser = await usuarioService.actualizarPerfil(profileData);
      
      // Actualizar en localStorage
      setUser(updatedUser);
      
      // Actualizar estado
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser
      });
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Cambia el password del usuario
   * @param {object} passwordData - Datos del password
   */
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await usuarioService.cambiarPassword(passwordData);
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar password';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Limpia errores del estado
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      if (state.isAuthenticated && state.token) {
        try {
          // Verificar que el token siga siendo válido obteniendo el perfil
          const userProfile = await usuarioService.obtenerPerfil();
          
          // Actualizar datos del usuario si es necesario
          if (JSON.stringify(userProfile) !== JSON.stringify(state.user)) {
            setUser(userProfile);
            dispatch({
              type: AUTH_ACTIONS.UPDATE_USER,
              payload: userProfile
            });
          }
        } catch (error) {
          // Token inválido o expirado
          console.log('Token inválido, cerrando sesión');
          logout();
        }
      }
    };

    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    
    // Métodos
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;