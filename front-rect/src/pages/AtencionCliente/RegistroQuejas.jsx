import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const RegistroQuejas = () => {
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    detallesQueja: '',
    tipoQueja: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito
  const [mensajeError, setMensajeError] = useState(''); // Estado para el mensaje de error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Id_Cliente: formData.numeroCuenta, 
      Descripcion_Queja: formData.detallesQueja,
      Tipo_Queja: formData.tipoQueja, 
    };

    setLoading(true);
    setMensajeExito(''); // Limpiar mensaje de éxito antes de enviar
    setMensajeError(''); // Limpiar mensaje de error antes de enviar

    try {
      console.log('QUEJA:', payload);
      const response = await axios.post(process.env.REACT_APP_API_URL + '/crear_queja', payload);
      
      if (response.status === 200) {
        setMensajeExito(response.data.mensaje || 'Queja creada exitosamente.');
        setFormData({ numeroCuenta: '', detallesQueja: '', tipoQueja: '' }); 
      } else {
        setMensajeError('Error inesperado al registrar la queja.');
      }
    } catch (error) {
      console.error('Error al registrar la queja:', error);

      if (error.response && error.response.status === 400) {
        setMensajeError(error.response.data.mensaje || 'Error al crear la queja.');
      } else {
        setMensajeError('Error de conexión al registrar la queja.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="AtencionCliente" />
      <div style={{ flex: 1 }}>
        <Header title="Registro de Quejas" />
        <div style={{ padding: '20px' }}>
          <h2>Registro de Quejas</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Número de Cuenta o Identificación */}
            <div className="mb-3">
              <label htmlFor="numeroCuenta" className="form-label">Número de Cuenta o Identificación</label>
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

            {/* Detalles de la Queja */}
            <div className="mb-3">
              <label htmlFor="detallesQueja" className="form-label">Detalles de la Queja</label>
              <textarea
                className="form-control"
                id="detallesQueja"
                name="detallesQueja"
                rows="4"
                value={formData.detallesQueja}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Tipo de Queja */}
            <div className="mb-3">
              <label htmlFor="tipoQueja" className="form-label">Tipo de Queja</label>
              <select
                className="form-select"
                id="tipoQueja"
                name="tipoQueja"
                value={formData.tipoQueja}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el tipo de queja</option>
                <option value="Servicio">Servicio</option>
                <option value="Producto">Producto</option>
                <option value="Atencion al Cliente">Atención al Cliente</option>
              </select>
            </div>

            {/* Botón con ID agregado */}
            <button
              type="submit"
              className="btn btn-primary"
              id="btnRegistrarQueja"  // ID agregado al botón
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Queja'}
            </button>
          </form>

          {/* Mostrar mensaje de éxito o error */}
          {mensajeExito && <div className="alert alert-success mt-3">{mensajeExito}</div>}
          {mensajeError && <div className="alert alert-danger mt-3">{mensajeError}</div>}
        </div>
      </div>
    </div>
  );
};

export default RegistroQuejas;
