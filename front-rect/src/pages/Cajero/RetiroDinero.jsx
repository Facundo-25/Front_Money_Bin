import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Importar jsPDF

const RetiroDinero = () => {
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    monto: '',
    tipoCuenta: 'monetario', // Por defecto es 'monetario'
    moneda: 'quetzales', // Por defecto es 'quetzales'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setExito(null);

    try {
      const { numeroCuenta, monto, tipoCuenta, moneda } = formData;
      const idEmpleado = 1; // Puede ser extraído de la sesión o contexto de la app

      const url = `${process.env.REACT_APP_API_URL}/retiroCuenta`;

      const response = await axios.post(url, {
        NoCuenta: numeroCuenta,
        Monto: parseFloat(monto), // Convertimos monto a flotante
        Tipo_Cuenta: tipoCuenta === 'monetario' ? 'Cuenta Monetaria' : 'Cuenta de Ahorro',
        Tipo_Moneda: moneda === 'quetzales' ? 'GTQ' : 'USD',
        Id_Empleado: idEmpleado,
      });

      setExito('Retiro realizado con éxito.');
      setLoading(false);

      // Generar el comprobante PDF
      generarComprobantePDF(response.data);
    } catch (error) {
      setError('Error al realizar el retiro. Verifique los detalles e intente nuevamente.');
      setLoading(false);
    }
  };

  const generarComprobantePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de Retiro de Dinero', 20, 20);

    doc.setFontSize(12);
    doc.text(`Número de Cuenta: ${formData.numeroCuenta}`, 20, 40);
    doc.text(`Monto Retirado: $${formData.monto}`, 20, 50);
    doc.text(`Tipo de Cuenta: ${formData.tipoCuenta === 'monetario' ? 'Cuenta Monetaria' : 'Cuenta de Ahorro'}`, 20, 60);
    doc.text(`Moneda: ${formData.moneda === 'quetzales' ? 'GTQ' : 'USD'}`, 20, 70);

    // Descargar el PDF
    doc.save('comprobante_retiro_dinero.pdf');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Cajero" />
      <div style={{ flex: 1 }}>
        <Header title="Retiro de Dinero" />
        <div style={{ padding: '20px' }}>
          <h2>Retiro de Dinero</h2>
          <p>Realiza retiros de dinero seleccionando la cuenta y el monto correspondiente.</p>

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto' }}>
            {/* Número de Cuenta */}
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

            {/* Monto a Retirar */}
            <div className="mb-3">
              <label htmlFor="monto" className="form-label">Monto a Retirar</label>
              <input
                type="number"
                className="form-control"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo de Cuenta (Monetario o Ahorro) */}
            <div className="mb-3">
              <label className="form-label">Tipo de Cuenta</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoCuenta"
                    id="monetario"
                    value="monetario"
                    checked={formData.tipoCuenta === 'monetario'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="monetario">Monetario</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoCuenta"
                    id="ahorro"
                    value="ahorro"
                    checked={formData.tipoCuenta === 'ahorro'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="ahorro">Ahorro</label>
                </div>
              </div>
            </div>

            {/* Moneda (Quetzales o Dólares) */}
            <div className="mb-3">
              <label className="form-label">Moneda</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="moneda"
                    id="quetzales"
                    value="quetzales"
                    checked={formData.moneda === 'quetzales'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="quetzales">Quetzales</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="moneda"
                    id="dolares"
                    value="dolares"
                    checked={formData.moneda === 'dolares'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="dolares">Dólares</label>
                </div>
              </div>
            </div>

            {/* Botón para enviar el formulario */}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Realizar Retiro'}
            </button>
          </form>

          {/* Mensajes de Error o Éxito */}
          {error && <div className="alert alert-danger">{error}</div>}
          {exito && <div className="alert alert-success">{exito}</div>}
        </div>
      </div>
    </div>
  );
};

export default RetiroDinero;
