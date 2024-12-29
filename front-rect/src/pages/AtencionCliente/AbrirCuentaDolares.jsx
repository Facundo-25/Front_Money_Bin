import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const AbrirCuentaDolares = () => {
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    tipoCuenta: 'Monetario',
    fechaApertura: new Date().toLocaleString(),
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log(formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/abrir_cuenta_dolares`,
        formData
      );

      if (response.status === 200) {
        setMensaje('Cuenta en dólares abierta exitosamente.');
      } else if (response.status === 400) {
        setMensaje('Hubo un error al abrir la cuenta en dólares.');
      }
    } catch (error) {
      setMensaje('Error al procesar la solicitud.');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="AtencionCliente" />
      <div style={{ flex: 1 }}>
        <Header title="Abrir Cuenta en Dólares" />
        <div style={{ padding: '20px' }}>
          <h2>Abrir Cuenta en Dólares</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Número de cuenta */}
            <div className="mb-3">
              <label htmlFor="numeroCuenta" className="form-label">Número de Cuenta</label>
              <input
                type="text"
                className="form-control"
                id="numeroCuenta"
                name="numeroCuenta"
                value={formData.numeroCuenta}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo de cuenta */}
            <div className="mb-3">
              <label htmlFor="tipoCuenta" className="form-label">Tipo de Cuenta</label>
              <select
                className="form-control"
                id="tipoCuenta"
                name="tipoCuenta"
                value={formData.tipoCuenta}
                onChange={handleChange}
                required
              >
                <option value="Monetario">Monetario</option>
                <option value="Ahorro">Ahorro</option>
              </select>
            </div>

            {/* Fecha de apertura */}
            <div className="mb-3">
              <label htmlFor="fechaApertura" className="form-label">Fecha y Hora de Apertura</label>
              <input
                type="text"
                className="form-control"
                id="fechaApertura"
                name="fechaApertura"
                value={formData.fechaApertura}
                readOnly
              />
            </div>

            <button type="submit" className="btn btn-primary">Abrir Cuenta</button>
          </form>

          {/* Mostrar mensaje de respuesta */}
          {mensaje && (
            <div style={{ marginTop: '20px', color: mensaje.includes('error') ? 'red' : 'green' }}>
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbrirCuentaDolares;
