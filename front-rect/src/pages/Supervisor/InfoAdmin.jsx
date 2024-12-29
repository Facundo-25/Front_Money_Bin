import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const InfoAdmin = () => {
  const [admins, setAdmins] = useState([]); // Almacena la lista de administradores
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Almacena el administrador seleccionado para edición
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal

  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

  // Obtener administradores al cargar el componente
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/obtener_administradores`, 
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
            },
          }
        );
        setAdmins(response.data);
      } catch (error) {
        console.error('Error al obtener administradores:', error);
      }
    };

    fetchAdmins();
  }, []);

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAdmin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Guardar cambios del administrador
  const saveChanges = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/editar_administrador/${selectedAdmin.Id_Usuario}`, selectedAdmin);
      alert('Datos actualizados correctamente');
      setIsModalOpen(false);

      // Actualizar la lista de administradores
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.Id_Usuario === selectedAdmin.Id_Usuario ? selectedAdmin : admin
        )
      );
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar los cambios');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Supervisor" />
      <div style={{ flex: 1 }}>
        <Header title="Información del Administrador" />
        <div style={{ padding: '20px' }}>
          <h2>Lista de Administradores</h2>

          {/* Tabla de administradores */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo Electrónico</th>
                <th>Teléfono</th>
                <th>Género</th>
                <th>Estado Civil</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.Id_Usuario}>
                  <td>{admin.Nombre}</td>
                  <td>{admin.Apellido}</td>
                  <td>{admin.Correo_Electronico}</td>
                  <td>{admin.Numero_Telefonico}</td>
                  <td>{admin.Genero}</td>
                  <td>{admin.Estado_Civil}</td>
                  <td>{admin.Estado}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setIsModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal para edición */}
          {isModalOpen && selectedAdmin && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Editar Administrador</h5>
                    <button className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        name="Nombre"
                        value={selectedAdmin.Nombre}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Apellido</label>
                      <input
                        type="text"
                        name="Apellido"
                        value={selectedAdmin.Apellido}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo Electrónico</label>
                      <input
                        type="email"
                        name="Correo_Electronico"
                        value={selectedAdmin.Correo_Electronico}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="text"
                        name="Numero_Telefonico"
                        value={selectedAdmin.Numero_Telefonico}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </button>
                    <button className="btn btn-success" onClick={saveChanges}>
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoAdmin;
