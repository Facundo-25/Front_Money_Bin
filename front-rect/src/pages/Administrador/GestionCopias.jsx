import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const GestionCopias = () => {
  const token = localStorage.getItem('token'); // Obteniendo el token del localStorage
  const userId = localStorage.getItem('userId'); // Obteniendo el userId del localStorage
  const username = localStorage.getItem('username'); // Obteniendo el username del localStorage
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [backups, setBackups] = useState([]);

  // Cargar los backups existentes al iniciar la página
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/obtenerBackups`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Enviando el token JWT en el encabezado
          },
        });
        const data = await response.json();
        if (data.mensaje === 'Registros de backups obtenidos con éxito') {
          setBackups(data.backups);
        }
      } catch (error) {
        console.error('Error al obtener los backups:', error);
      }
    };
    fetchBackups();
  }, [token]); // El hook ahora depende del token para recargar si cambia

  // Manejar la creación de un backup
  const handleBackup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviando el token JWT en el encabezado
        },
        body: JSON.stringify({
          id_usuario: userId, // Usando el userId del localStorage
          nombre_usuario: username, // Usando el username del localStorage
        }),
      });

      const data = await response.json();
      if (data.mensaje === 'Backup realizado con éxito') {
        setSuccess(true);
        // Actualizar el listado de backups
        setBackups((prevBackups) => [
          ...prevBackups,
          {
            Nombre_Backup: data.archivo,
            Fecha_Hora_Creacion: new Date().toISOString(),
            Nombre_Usuario_Crea: username,
          },
        ]);
      } else {
        throw new Error('Error al generar la copia de seguridad');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Administrador" />
      <div style={{ flex: 1 }}>
        <Header title="Gestión de Copias de Seguridad" />
        <div style={{ padding: '20px' }}>
          <h2>Gestión de Copias de Seguridad</h2>
          <p>Como administrador, puedes generar una copia de seguridad de la base de datos del banco.</p>

          {/* Botón para generar una copia de seguridad */}
          <button 
            onClick={handleBackup} 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Generando copia...' : 'Generar Copia de Seguridad'}
          </button>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">¡Copia de seguridad generada con éxito!</div>}

          <h3 className="mt-5">Copias de Seguridad Generadas</h3>
          {backups.length > 0 ? (
            <ul className="list-group">
              {backups.map((backup, index) => (
                <li key={index} className="list-group-item">
                  <strong>{backup.Nombre_Backup}</strong><br />
                  Creado por: {backup.Nombre_Usuario_Crea}<br />
                  Fecha y Hora: {new Date(backup.Fecha_Hora_Creacion).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay copias de seguridad disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionCopias;
