import { Link } from 'react-router-dom';

/**
 * Página de inicio.
 * 
 * Muestra la página principal con enlaces a las principales secciones.
 */
function Home() {
  return (
    <div className="home">
      <h1>Bienvenido al Almacén de Películas Online</h1>
      <p>Tu tienda de películas favorita</p>
      <div className="home-links">
        <Link to="/catalogo" className="btn btn-primary">Ver Catálogo</Link>
        <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
        <Link to="/registro" className="btn btn-secondary">Registrarse</Link>
      </div>
    </div>
  );
}

export default Home;
