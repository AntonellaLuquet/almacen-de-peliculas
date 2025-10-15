import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Catalogo from './pages/Catalogo';
import DetallePelicula from './pages/DetallePelicula';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import './styles/App.css';

/**
 * Componente principal de la aplicación.
 * 
 * Configura el enrutamiento y los providers de contexto para:
 * - Autenticación de usuarios
 * - Gestión del carrito de compras
 */
function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/pelicula/:id" element={<DetallePelicula />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/perfil" element={<Perfil />} />
            </Routes>
          </div>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
