import { createContext, useState, useContext } from 'react';

/**
 * Contexto del carrito de compras.
 * 
 * Maneja el estado global del carrito y proporciona funciones para:
 * - Agregar películas al carrito
 * - Actualizar cantidades
 * - Eliminar películas
 * - Calcular totales
 */
const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const agregarAlCarrito = (pelicula, cantidad = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === pelicula.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === pelicula.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prevItems, { ...pelicula, cantidad }];
    });
  };

  const actualizarCantidad = (peliculaId, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(peliculaId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === peliculaId ? { ...item, cantidad } : item
      )
    );
  };

  const eliminarDelCarrito = (peliculaId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== peliculaId));
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const cantidadTotal = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        calcularTotal,
        cantidadTotal
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
