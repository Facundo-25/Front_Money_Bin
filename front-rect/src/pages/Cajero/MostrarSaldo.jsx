import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const MostrarSaldo = () => {
  const [formData, setFormData] = useState({
    idCuenta: '',
    cui: '',         // Campo CUI para Cliente
    idUsuario: '',   // Campo ID de Usuario para Empleado
    idEmpleado: '',  // ID de empleado que realiza la consulta
  });
  const [userType, setUserType] = useState('cliente'); // Por defecto es 'cliente'
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData({ idCuenta: '', cui: '', idUsuario: '', idEmpleado: '' });
    setSaldo(null);
    setError(null);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaldo(null);

    try {
      let payload;
      let endpoint;

      if (userType === 'cliente') {
        // Para Cliente
        payload = { 
          Id_Cuenta: formData.idCuenta, 
          CUI: formData.cui, 
          Id_Empleado: formData.idEmpleado // El empleado que realiza la consulta
        };
        endpoint = `${process.env.REACT_APP_API_URL}/saldoCliente`;
      } else {
        // Para Empleado
        payload = { 
          Id_Cuenta: formData.idCuenta, 
          Id_Usuario: formData.idUsuario, 
          Id_Empleado: formData.idEmpleado // El empleado que realiza la consulta
        };
        endpoint = `${process.env.REACT_APP_API_URL}/saldoEmpleado`;
      }

      const response = await axios.post(endpoint, payload);
      setSaldo(response.data.data);
    } catch (error) {
      console.error('Error al consultar el saldo:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'No se pudo obtener el saldo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Cajero" />
      <div style={{ flex: 1 }}>
        <Header title="Mostrar Saldo" />
        <div style={{ padding: '20px' }}>
          <h2>Mostrar Saldo</h2>
          <p>Consulta el saldo de un cliente o empleado seleccionando el tipo y proporcionando la información requerida.</p>

          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '20px auto' }}>
            <div className="mb-3">
              <label htmlFor="userType" className="form-label">Seleccionar tipo de usuario</label>
              <select
                className="form-select"
                id="userType"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <option value="cliente">Cliente</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="idCuenta" className="form-label">ID de Cuenta</label>
              <input
                type="text"
                className="form-control"
                id="idCuenta"
                name="idCuenta"
                value={formData.idCuenta}
                onChange={handleChange}
                required
              />
            </div>

            {/* Si es cliente, mostramos el campo CUI */}
            {userType === 'cliente' && (
              <div className="mb-3">
                <label htmlFor="cui" className="form-label">CUI</label>
                <input
                  type="text"
                  className="form-control"
                  id="cui"
                  name="cui"
                  value={formData.cui}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Si es empleado, mostramos el campo ID de Usuario */}
            {userType === 'empleado' && (
              <div className="mb-3">
                <label htmlFor="idUsuario" className="form-label">ID de Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="idUsuario"
                  name="idUsuario"
                  value={formData.idUsuario}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* En ambos casos, necesitamos saber el empleado que realiza la consulta */}
            <div className="mb-3">
              <label htmlFor="idEmpleado" className="form-label">ID de Empleado (quien realiza la consulta)</label>
              <input
                type="text"
                className="form-control"
                id="idEmpleado"
                name="idEmpleado"
                value={formData.idEmpleado}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Consultando...' : 'Consultar Saldo'}
            </button>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Si se tiene saldo, lo mostramos */}
          {saldo && (
            <div>
              <h3>Detalles del Saldo</h3>
              <p><strong>Saldo Actual:</strong> ${saldo.Saldo}</p>
              <p>
                <strong>Última Actualización:</strong> {(() => {
                  const fechaActualizacion = saldo?.Fecha_Ultima_Actualizacion
                    ? new Date(saldo.Fecha_Ultima_Actualizacion)
                    : null;

                  const fechaLegible = fechaActualizacion instanceof Date && !isNaN(fechaActualizacion)
                    ? fechaActualizacion.toLocaleString()
                    : 'Fecha inválida';

                  return fechaLegible;
                })()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MostrarSaldo;
