import React, { createContext, useContext, useReducer, useEffect } from 'react';
import carritoService from '../services/carritoService'; // Usar el servicio de carrito
import { useAuth } from './AuthContext';

/**
 * Contexto del carrito para manejar el estado de compras
 */
const CartContext = createContext();

// Acciones del reducer
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CART: 'CLEAR_CART',
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
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case CART_ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    case CART_ACTIONS.CLEAR_CART:
      return { ...initialState };
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

  const updateStateWithCarrito = (carrito) => {
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
  };

  const loadCart = async () => {
    if (!isAuthenticated) return;
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const carrito = await carritoService.getCarrito();
      updateStateWithCarrito(carrito);
    } catch (error) {
      if (error.response?.status !== 404) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al cargar el carrito' });
      }
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const addItem = async (peliculaId, cantidad = 1) => {
    try {
      const carrito = await carritoService.agregarItem(peliculaId, cantidad);
      updateStateWithCarrito(carrito);
      return carrito;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al agregar item al carrito';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const updateItem = async (itemId, cantidad) => {
    try {
      const carrito = await carritoService.actualizarItem(itemId, cantidad);
      updateStateWithCarrito(carrito);
      return carrito;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar item';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const carrito = await carritoService.eliminarItem(itemId);
      updateStateWithCarrito(carrito);
      return carrito;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar item';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await carritoService.vaciarCarrito();
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al limpiar carrito';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const getItemQuantity = (peliculaId) => {
    const item = state.items.find(item => item.pelicula.id === peliculaId);
    return item ? item.cantidad : 0;
  };

  const isInCart = (peliculaId) => {
    return state.items.some(item => item.pelicula.id === peliculaId);
  };

  const clearError = () => {
    dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated]);

  const value = {
    ...state,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
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
