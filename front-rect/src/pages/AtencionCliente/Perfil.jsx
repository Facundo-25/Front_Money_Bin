import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const PerfilAtencion = () => {

  const [usuario, setUsuario] = useState({
    Nombre: 'Juan El atendedor al cliente',
    Apellido: 'Pérez',
    Correo_Electronico: 'juan.perez@example.com',
    Numero_Telefonico: '1234-5678',
    Foto: '', 
    Genero: 'Masculino',
    Estado_Civil: 'Soltero',
    Estado: 'Alta',
    Rol: 1 
  });

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="AtencionCliente" />
      <div style={{ flex: 1 }}>
        <Header title="Perfil" />
        <div style={{ padding: '20px' }}>
          <h2>Perfil de Usuario</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {usuario.Foto && (
              <img
                src={`data:image/jpeg;base64,${usuario.Foto}`}
                alt="Foto de Perfil"
                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
              />
            )}
            <div style={{ marginTop: '20px' }}>
              <p><strong>Nombre:</strong> {usuario.Nombre} {usuario.Apellido}</p>
              <p><strong>Correo Electrónico:</strong> {usuario.Correo_Electronico}</p>
              <p><strong>Teléfono:</strong> {usuario.Numero_Telefonico}</p>
              <p><strong>Género:</strong> {usuario.Genero}</p>
              <p><strong>Estado Civil:</strong> {usuario.Estado_Civil}</p>
              <p><strong>Estado:</strong> {usuario.Estado}</p>
              <p><strong>Rol:</strong> {usuario.Rol === 1 ? 'Cajero' : usuario.Rol === 2 ? 'Atención al Cliente' : usuario.Rol === 3 ? 'Administración' : 'Supervisor'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilAtencion;
