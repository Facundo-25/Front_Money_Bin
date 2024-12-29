import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const MostrarSaldo = () => {
  const [formData, setFormData] = useState({
    idCuenta: '',
    cui: '',
    idUsuario: '',
  });
  const [searchType, setSearchType] = useState('cuenta'); // Default a 'cuenta'
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maneja el cambio en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Cambia el tipo de búsqueda (CUI o Cuenta)
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setFormData({ idCuenta: '', cui: '', idUsuario: '' });
    setSaldo(null);
    setError(null);
  };

  // Maneja el envío del formulario
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaldo(null);

    try {
      let payload;
      let endpoint;

      if (searchType === 'cui') {
        // Consulta por CUI
        payload = { CUI: formData.cui, Id_Empleado: formData.idUsuario };
        endpoint = `${process.env.REACT_APP_API_URL}/buscarPorCui`;
      } else {
        // Consulta por Cuenta
        payload = { Id_Cuenta: formData.idCuenta, Id_Empleado: formData.idUsuario };
        endpoint = `${process.env.REACT_APP_API_URL}/buscarPorCuenta`;
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
          <p>Consulta el saldo de un cliente o un empleado.</p>

          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '20px auto' }}>
            <div className="mb-3">
              <label className="form-label">Seleccionar tipo de consulta</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="searchType"
                    id="cui"
                    value="cui"
                    checked={searchType === 'cui'}
                    onChange={handleSearchTypeChange}
                  />
                  <label className="form-check-label" htmlFor="cui">Por CUI</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="searchType"
                    id="cuenta"
                    value="cuenta"
                    checked={searchType === 'cuenta'}
                    onChange={handleSearchTypeChange}
                  />
                  <label className="form-check-label" htmlFor="cuenta">Por Cuenta</label>
                </div>
              </div>
            </div>

            {/* Campos comunes */}
            <div className="mb-3">
              <label htmlFor="idUsuario" className="form-label">ID de Usuario (Empleado)</label>
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

            {/* Si la búsqueda es por Cuenta */}
            {searchType === 'cuenta' && (
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
            )}

            {/* Si la búsqueda es por CUI */}
            {searchType === 'cui' && (
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

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Consultando...' : 'Consultar Saldo'}
            </button>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          {saldo && (
            <div>
              <h3>Detalles del Saldo</h3>
              {saldo.map((cliente) => (
                <div key={cliente.Id_Cliente}>
                  <h4>Cliente: {cliente.Nombre} {cliente.Apellido}</h4>
                  <p><strong>Teléfono:</strong> {cliente.Telefono}</p>
                  <p><strong>Correo:</strong> {cliente.Correo_Electronico}</p>
                  <h5>Cuentas:</h5>
                  {cliente.Cuenta.map((cuenta) => (
                    <div key={cuenta.Id_Cuenta}>
                      <h6>ID de Cuenta: {cuenta.Id_Cuenta}</h6>
                      <ul>
                        {cuenta.Transaccions.map((transaccion, index) => (
                          <li key={index}>
                            <p>{transaccion.Descripcion} - ${transaccion.Monto}</p>
                            <p><strong>Forma de pago:</strong> {transaccion.Forma_Pago}</p>
                            <p><strong>Fecha:</strong> {new Date(transaccion.Fecha_Hora_Transaccion).toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MostrarSaldo;
