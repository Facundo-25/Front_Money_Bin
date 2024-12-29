import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const PerfilAdmin = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [nuevoRol, setNuevoRol] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito

  const token = localStorage.getItem('token'); // Obtener el token desde el localStorage

  const handleUsuarioChange = (event) => {
    setNombreUsuario(event.target.value);
  };

  const handleRolChange = (event) => {
    setNuevoRol(event.target.value);
  };

  const actualizarRol = async () => {
    if (!nombreUsuario || !nuevoRol) {
      setMensaje('Por favor ingresa tanto el nombre de usuario como el nuevo rol.');
      setMensajeExito('');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cambiarRolUsuario`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviando el token JWT en el encabezado
        },
        body: JSON.stringify({
          Nombre_Usuario: nombreUsuario,
          Nuevo_Rol: parseInt(nuevoRol, 10), // Convertir el valor de nuevoRol a número
        }),
      });

      const data = await response.json();
      if (data.mensaje === 'Rol del usuario actualizado exitosamente') {
        setMensaje('');
        setMensajeExito('Rol actualizado exitosamente.');
      } else {
        setMensaje('Error: Rol no válido.');
        setMensajeExito('');
      }
    } catch (error) {
      setMensaje('Hubo un error al actualizar el rol.');
      setMensajeExito('');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Administrador" />
      <div style={{ flex: 1 }}>
        <Header title="Cambiar Rol" />
        <div style={{ padding: '20px' }}>
          <h2>Cambiar Rol de Usuario</h2>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="nombreUsuario">Nombre de Usuario: </label>
              <input
                type="text"
                id="nombreUsuario"
                value={nombreUsuario}
                onChange={handleUsuarioChange}
                placeholder="Ingresa el nombre de usuario"
                style={{ padding: '8px', marginLeft: '10px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="nuevoRol">Nuevo Rol: </label>
              <select
                id="nuevoRol"
                value={nuevoRol}
                onChange={handleRolChange}
                style={{ padding: '8px', marginLeft: '10px' }}
              >
                <option value="">Selecciona un rol</option>
                <option value="1">Cajero</option>
                <option value="2">Atención al Cliente</option>
              </select>
            </div>
            <button
              onClick={actualizarRol}
              id="btnActualizarRol" // Asignamos un id único al botón
              style={{
                padding: '10px 20px',
                backgroundColor: '#007BFF', // Cambié el color a azul para hacerlo más informativo
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Actualizar Rol
            </button>

            {/* Mostrar el mensaje de éxito si existe */}
            {mensajeExito && (
              <div className="alert alert-success mt-3" role="alert">
                {mensajeExito} {/* Estilo de éxito */}
              </div>
            )}

            {/* Mostrar el mensaje de error si existe */}
            {mensaje && (
              <div className="alert alert-danger mt-3" role="alert">
                {mensaje} {/* Estilo de error */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin;
