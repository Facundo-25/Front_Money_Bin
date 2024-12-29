import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap
import { Link } from 'react-router-dom';
import { FaUser, FaMoneyBillAlt, FaCreditCard, FaSearch, FaHome, FaSignOutAlt } from 'react-icons/fa'; // Ejemplo de importación de iconos

// Menú del Sidebar que usarás en el Offcanvas
const menu = {
  Cajero: [
    { name: 'Perfil', path: '/cajero/perfil', icon: <FaUser /> },
    { name: 'Pago de Servicios', path: '/cajero/pago-servicios', icon: <FaMoneyBillAlt /> },
    { name: 'Pago de Préstamos', path: '/cajero/pago-prestamos', icon: <FaMoneyBillAlt /> },
    { name: 'Buscar Cuenta', path: '/cajero/buscar-cuenta', icon: <FaSearch /> },
    { name: 'Mostrar Saldo', path: '/cajero/mostrar-saldo', icon: <FaMoneyBillAlt /> },
    { name: 'Retiro de Dinero', path: '/cajero/retiro-dinero', icon: <FaMoneyBillAlt /> },
    { name: 'Depositar Dinero', path: '/cajero/deposito-dinero', icon: <FaMoneyBillAlt /> },
    { name: 'Cambiar Moneda', path: '/cajero/cambiar-moneda', icon: <FaMoneyBillAlt /> },
    { name: 'Pago Tarjeta de Crédito', path: '/cajero/pago-tarjeta', icon: <FaCreditCard /> },
    { name: 'Cerrar Sesión', path: '/', icon: <FaSignOutAlt /> },
  ],
  AtencionCliente: [
    { name: 'Perfil', path: '/atencion-cliente/perfil', icon: <FaUser /> },
    { name: 'Creación de Cuenta', path: '/atencion-cliente/creacion-cuenta', icon: <FaUser /> },
    { name: 'Actualización Cliente', path: '/atencion-cliente/actualizacion-cliente', icon: <FaUser /> },
    { name: 'Encuestas Satisfacción', path: '/atencion-cliente/encuesta-satisfaccion', icon: <FaSearch /> },
    { name: 'Registro de Quejas', path: '/atencion-cliente/registro-quejas', icon: <FaHome /> },
    { name: 'Permitir Cuenta Dolares', path: '/atencion-cliente/permitir-cuenta-dolares', icon: <FaHome /> },
    { name: 'Cerrar Sesión', path: '/', icon: <FaSignOutAlt /> },
  ],
  Administrador: [
    { name: 'Cambiar Rol', path: '/administrador/perfil', icon: <FaUser /> },
    { name: 'Registro Empleado', path: '/administrador/registro-empleado', icon: <FaHome /> },
    { name: 'Gestión de Copias', path: '/administrador/gestion-copias', icon: <FaHome /> },
    { name: 'Cerrar Sesión', path: '/', icon: <FaSignOutAlt /> },
  ],
  Supervisor: [
    { name: 'Perfil', path: '/supervisor/perfil', icon: <FaUser /> },
    { name: 'Encuestas Satisfacción', path: '/supervisor/encuestas', icon: <FaSearch /> },
    { name: 'Gestion de Inventario', path: '/supervisor/gestion-inventario', icon: <FaSearch /> },
    { name: 'Información de Administrador', path: '/supervisor/info-admin', icon: <FaSearch /> },
    { name: 'Registro de Quejas', path: '/supervisor/quejas', icon: <FaHome /> },
    { name: 'Registrar Admin', path: '/supervisor/registrar-admin', icon: <FaHome /> },
    { name: 'Monitoreo', path: '/supervisor/monitoreo', icon: <FaHome /> },
    { name: 'Cerrar Sesión', path: '/', icon: <FaSignOutAlt /> },
  ],
};

const Header = ({ title, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirige al Login
  };

  return (
    <div>
      {/* Navbar con Offcanvas */}
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Banco Money</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Menú</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {menu[role]?.map((item, index) => (
                  <li className="nav-item" key={index}>
                    <Link className="nav-link" to={item.path}>
                      {/* Icono a la izquierda del texto */}
                      <span className="me-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
