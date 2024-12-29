import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Para que los componentes interactivos funcionen

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/*Cajero*/ 
import Perfil from './pages/Cajero/Perfil';
import BuscarCuenta from './pages/Cajero/BuscarCuenta'; 
import CambiarMoneda from './pages/Cajero/CambiarMoneda'; 
import DepositoDinero from './pages/Cajero/DepositoDinero'; 
import MostrarSaldo from './pages/Cajero/MostrarSaldo'; 
import PagoPrestamos from './pages/Cajero/PagoPrestamos'; 
import PagoServicios from './pages/Cajero/PagoServicios'; 
import PagoTarjeta from './pages/Cajero/PagoTarjeta'; 
import RetiroDinero from './pages/Cajero/RetiroDinero'; 
/*Atencion al cliente*/ 
import CreacionCuenta from './pages/AtencionCliente/CreacionCuenta'; 
import EncuestasSatisfaccion from './pages/AtencionCliente/EncuestasSatisfaccion';
import ActualizacionCliente from './pages/AtencionCliente/ActualizacionCliente';
import PerfilAtencion from './pages/AtencionCliente/Perfil';
import RegistroQuejas from './pages/AtencionCliente/RegistroQuejas';
import AbrirCuentaDolares from './pages/AtencionCliente/AbrirCuentaDolares';
/*Administrador*/ 
import RegistroEmpleado from './pages/Administrador/RegistroEmpleado';
import PerfilAdmin from './pages/Administrador/Perfil';
import GestionCopias from './pages/Administrador/GestionCopias';

/*Supervisor*/  
import Login from './pages/Login/Login'; 
import PerfilSupervisor from './pages/Supervisor/Perfil';
import EncuestaSatisfaccion from './pages/Supervisor/EncuestasSatisfaccion';
import GestionInventario from './pages/Supervisor/GestionInventarios';
import Monitoreo from './pages/Supervisor/Monitoreo';
import VerQuejas from './pages/Supervisor/VerQuejas';
import RegistrarAdmin from './pages/Supervisor/RegistrarAdmin';
import InfoAdmin from './pages/Supervisor/InfoAdmin';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        /*cajero*/
        <Route path="/cajero/perfil" element={<Perfil/>} />
        <Route path="/cajero/buscar-cuenta" element={<BuscarCuenta />} />
        <Route path="/cajero/cambiar-moneda" element={<CambiarMoneda />} />
        <Route path="/cajero/deposito-dinero" element={<DepositoDinero />} />
        <Route path="/cajero/mostrar-saldo" element={<MostrarSaldo />} />
        <Route path="/cajero/pago-prestamos" element={<PagoPrestamos />} />
        <Route path="/cajero/pago-servicios" element={<PagoServicios />} />
        <Route path="/cajero/pago-tarjeta" element={<PagoTarjeta />} />
        <Route path="/cajero/retiro-dinero" element={<RetiroDinero />} />

        /*atencion al cliente*/
        <Route path="/atencion-cliente/perfil" element={<PerfilAtencion/>} />
        <Route path="/atencion-cliente/creacion-cuenta" element={<CreacionCuenta/>} />
        <Route path="/atencion-cliente/actualizacion-cliente" element={<ActualizacionCliente/>} />
        <Route path="/atencion-cliente/encuesta-satisfaccion" element={<EncuestasSatisfaccion/>} />
        <Route path="/atencion-cliente/permitir-cuenta-dolares" element={<AbrirCuentaDolares/>} />
        <Route path="/atencion-cliente/registro-quejas" element={<RegistroQuejas/>} />

        /*administrador*/
        <Route path="/administrador/perfil" element={<PerfilAdmin />} />
        <Route path="/administrador/registro-empleado" element={<RegistroEmpleado/>} />
        <Route path="/administrador/gestion-copias" element={<GestionCopias/>} />

        /*supervisor*/
        <Route path="/supervisor/encuestas" element={<EncuestaSatisfaccion />} />
        <Route path="/supervisor/gestion-inventario" element={<GestionInventario />} />
        <Route path="/supervisor/info-admin" element={<InfoAdmin />} />
        <Route path="/supervisor/monitoreo" element={<Monitoreo/>} />
        <Route path="/supervisor/perfil" element={<PerfilSupervisor />} />
        <Route path="/supervisor/quejas" element={<VerQuejas />} />
        <Route path="/supervisor/registrar-admin" element={<RegistrarAdmin />} />

        
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
