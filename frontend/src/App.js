import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import TestPage from './TestPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import MovieDetailPage from './pages/MovieDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import CheckoutFailure from './pages/checkout/CheckoutFailure';
import CheckoutPending from './pages/checkout/CheckoutPending';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

/**
 * Componente principal de la aplicación
 * Configura las rutas y proveedores de contexto
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/catalogo" element={<CatalogPage />} />
                <Route path="/pelicula/:id" element={<MovieDetailPage />} />
                
                {/* Rutas protegidas - requieren autenticación */}
                <Route path="/carrito" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/checkout/success" element={
                  <ProtectedRoute>
                    <CheckoutSuccess />
                  </ProtectedRoute>
                } />
                
                <Route path="/checkout/failure" element={
                  <ProtectedRoute>
                    <CheckoutFailure />
                  </ProtectedRoute>
                } />
                
                <Route path="/checkout/pending" element={
                  <ProtectedRoute>
                    <CheckoutPending />
                  </ProtectedRoute>
                } />
                
                <Route path="/perfil" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/mis-pedidos" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                
                {/* Rutas de administrador */}
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } />
                
                {/* Ruta 404 */}
                <Route path="/404" element={<NotFoundPage />} />
                
                {/* Redirección para rutas no encontradas */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;