import React, { createContext, useContext, useReducer, useEffect } from 'react';
import pedidoService from '../services/pedidoService';
import { useAuth } from './AuthContext';

/**
 * Contexto del carrito para manejar el estado de compras
 */
const CartContext = createContext();

// Acciones del reducer
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Estado inicial
const initialState = {
  items: [],
  subtotal: 0,
  impuestos: 0,
  total: 0,
  totalItems: 0,
  loading: false,
  error: null
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    
    case CART_ACTIONS.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false,
        error: null
      };
    
    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
        error: null
      };
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        loading: false,
        error: null
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...initialState
      };
    
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    case CART_ACTIONS.SET_ERROR:
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
 * Proveedor del contexto del carrito
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  /**
   * Carga el carrito desde el servidor
   */
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const carrito = await pedidoService.obtenerCarrito();
      
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: {
          items: carrito.items || [],
          subtotal: carrito.subtotal || 0,
          impuestos: carrito.impuestos || 0,
          total: carrito.total || 0,
          totalItems: carrito.totalItems || 0
        }
      });
    } catch (error) {
      // Si no existe carrito, no es error
      if (error.response?.status !== 404) {
        console.error('Error al cargar carrito:', error);
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: 'Error al cargar el carrito'
        });
      } else {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      }
    }
  };

  /**
   * Agrega un item al carrito
   * @param {number} peliculaId - ID de la película
   * @param {number} cantidad - Cantidad a agregar
   */
  const addItem = async (peliculaId, cantidad = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const carrito = await pedidoService.agregarItemCarrito(peliculaId, cantidad);
      
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: {
          items: carrito.items || [],
          subtotal: carrito.subtotal || 0,
          impuestos: carrito.impuestos || 0,
          total: carrito.total || 0,
          totalItems: carrito.totalItems || 0
        }
      });
      
      return carrito;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al agregar item al carrito';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Actualiza la cantidad de un item
   * @param {number} itemId - ID del item
   * @param {number} cantidad - Nueva cantidad
   */
  const updateItem = async (itemId, cantidad) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const carrito = await pedidoService.actualizarItemCarrito(itemId, cantidad);
      
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: {
          items: carrito.items || [],
          subtotal: carrito.subtotal || 0,
          impuestos: carrito.impuestos || 0,
          total: carrito.total || 0,
          totalItems: carrito.totalItems || 0
        }
      });
      
      return carrito;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar item';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Elimina un item del carrito
   * @param {number} itemId - ID del item
   */
  const removeItem = async (itemId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const carrito = await pedidoService.eliminarItemCarrito(itemId);
      
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: {
          items: carrito.items || [],
          subtotal: carrito.subtotal || 0,
          impuestos: carrito.impuestos || 0,
          total: carrito.total || 0,
          totalItems: carrito.totalItems || 0
        }
      });
      
      return carrito;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar item';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Vacía el carrito completamente
   */
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      await pedidoService.limpiarCarrito();
      
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al limpiar carrito';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Crea un pedido a partir del carrito actual
   * @param {object} datosEnvio - Datos de envío y pago
   */
  const createOrder = async (datosEnvio) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const pedido = await pedidoService.crearPedido(datosEnvio);
      
      // Limpiar carrito después de crear el pedido
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      
      return pedido;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear pedido';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  /**
   * Obtiene el número de items de una película específica en el carrito
   * @param {number} peliculaId - ID de la película
   * @returns {number} - Cantidad de items de la película
   */
  const getItemQuantity = (peliculaId) => {
    const item = state.items.find(item => item.pelicula.id === peliculaId);
    return item ? item.cantidad : 0;
  };

  /**
   * Verifica si una película está en el carrito
   * @param {number} peliculaId - ID de la película
   * @returns {boolean} - true si está en el carrito
   */
  const isInCart = (peliculaId) => {
    return state.items.some(item => item.pelicula.id === peliculaId);
  };

  /**
   * Limpia errores del estado
   */
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null });
  };

  // Cargar carrito cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Limpiar carrito si no está autenticado
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated]);

  const value = {
    // Estado
    items: state.items,
    subtotal: state.subtotal,
    impuestos: state.impuestos,
    total: state.total,
    totalItems: state.totalItems,
    loading: state.loading,
    error: state.error,
    
    // Métodos
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    createOrder,
    getItemQuantity,
    isInCart,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook para usar el contexto del carrito
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export default CartContext;