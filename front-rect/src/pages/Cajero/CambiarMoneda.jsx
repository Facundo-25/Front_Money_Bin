import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Importar jsPDF

const CambioMoneda = () => {
  const [formData, setFormData] = useState({
    NoCuenta: '',
    Monto: '',
  });

  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const { NoCuenta, Monto } = formData;
      const idEmpleado = 1; // ID del empleado (siempre es 1 en este caso)

      // Realizar la solicitud POST al endpoint
      const url = `${process.env.REACT_APP_API_URL}/cambiarMoneda`; 
      const response = await axios.post(url, { 
        NoCuenta, 
        Monto: parseFloat(Monto), 
        Id_Empleado: idEmpleado 
      });

      setConversion(response.data); // Guardar la respuesta de la conversión
      setLoading(false);
    } catch (error) {
      setError('Error al realizar el cambio de moneda.');
      setLoading(false);
    }
  };

  // Función para generar y descargar el PDF
  const generarComprobantePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de Cambio de Moneda', 20, 20);

    doc.setFontSize(12);
    doc.text(`Número de Cuenta: ${formData.NoCuenta}`, 20, 40);
    doc.text(`Monto en Quetzales: Q${formData.Monto}`, 20, 50);
    
    if (conversion) {
      doc.text(`Monto en Dólares: $${conversion.data.SaldoDolares.toFixed(2)}`, 20, 60);
      doc.text(`Fecha de Actualización: ${new Date(conversion.data.Fecha_Actualizacion).toLocaleString()}`, 20, 70);
    }

    // Descargar el PDF
    doc.save('comprobante_cambio_moneda.pdf');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Cajero" />
      <div style={{ flex: 1 }}>
        <Header title="Cambio de Moneda" />
        <div style={{ padding: '20px' }}>
          <h2>Cambio de Moneda (Quetzales a Dólares)</h2>
          <p>Ingresa el monto en quetzales que deseas cambiar a dólares.</p>

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto' }}>
            {/* Número de Cuenta */}
            <div className="mb-3">
              <label htmlFor="NoCuenta" className="form-label">Número de Cuenta</label>
              <input
                type="text"
                className="form-control"
                id="NoCuenta"
                name="NoCuenta"
                value={formData.NoCuenta}
                onChange={handleChange}
                required
              />
            </div>

            {/* Monto en Quetzales */}
            <div className="mb-3">
              <label htmlFor="Monto" className="form-label">Monto en Quetzales</label>
              <input
                type="number"
                className="form-control"
                id="Monto"
                name="Monto"
                value={formData.Monto}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Realizar Cambio'}
            </button>
          </form>

          {/* Mensaje de error, si hay uno */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Mostrar la respuesta de la conversión si existe */}
          {conversion && (
            <div>
              <h3>Resultado de la Conversión</h3>
              <p><strong>Monto en Dólares:</strong> ${conversion.data.SaldoDolares.toFixed(2)}</p>
              <p><strong>Fecha de Actualización:</strong> {new Date(conversion.data.Fecha_Actualizacion).toLocaleString()}</p>

              {/* Botón para generar el comprobante PDF */}
              <button className="btn btn-success" onClick={generarComprobantePDF}>
                Descargar Comprobante PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CambioMoneda;
