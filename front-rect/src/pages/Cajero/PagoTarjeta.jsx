import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Importar jsPDF

const PagoTarjeta = () => {
  const [formData, setFormData] = useState({
    IdTarjeta: '',
    Monto: '',
  });

  const [pago, setPago] = useState(null); 
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
      const { IdTarjeta, Monto } = formData;
      const idEmpleado = 1; // Asumimos que el ID del empleado siempre es 1

      // Realizar la solicitud POST al endpoint
      const url = `${process.env.REACT_APP_API_URL}/pagoTarjetaCredito`; 
      const response = await axios.post(url, { 
        Id_Tarjeta: IdTarjeta, 
        Monto: parseFloat(Monto),
        Id_Empleado: idEmpleado 
      });

      setPago(response.data); // Guardamos la respuesta de la API
      setLoading(false); 

      // Generar el comprobante PDF
      generarComprobantePDF(response.data);
    } catch (error) {
      setError('Hubo un error al procesar el pago de la tarjeta.');
      setLoading(false);
    }
  };

  const generarComprobantePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de Pago de Tarjeta de Crédito', 20, 20);

    doc.setFontSize(12);
    doc.text(`ID de Tarjeta: ${formData.IdTarjeta}`, 20, 40);
    doc.text(`Monto Pagado: $${formData.Monto}`, 20, 50);
    doc.text(`Saldo Restante: $${data.Saldo}`, 20, 60);
    doc.text(`Tipo de Cuenta: ${data.Tipo_Cuenta}`, 20, 70);
    doc.text(`Moneda: ${data.Moneda}`, 20, 80);
    doc.text(`Próxima Fecha de Pago: ${new Date(data.Proxima_Fecha_Pago).toLocaleDateString()}`, 20, 90);

    // Descargar el PDF
    doc.save('comprobante_pago_tarjeta.pdf');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Cajero" />
      <div style={{ flex: 1 }}>
        <Header title="Pago de Tarjeta de Crédito" />
        <div style={{ padding: '20px' }}>
          <h2>Pago de Tarjeta de Crédito</h2>
          <p>Realiza el pago de tu tarjeta de crédito ingresando el número de tarjeta y monto a pagar.</p>

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto' }}>
            {/* Campo de ID de Tarjeta */}
            <div className="mb-3">
              <label htmlFor="IdTarjeta" className="form-label">ID de Tarjeta</label>
              <input
                type="text"
                className="form-control"
                id="IdTarjeta"
                name="IdTarjeta"
                value={formData.IdTarjeta}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo de Monto a Pagar */}
            <div className="mb-3">
              <label htmlFor="Monto" className="form-label">Monto a Pagar</label>
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
              {loading ? 'Procesando...' : 'Realizar Pago'}
            </button>
          </form>

          {/* Mostrar mensaje de error si ocurre */}
          {error && <div className="alert alert-danger">{error}</div>} 

          {/* Mostrar la respuesta si la transacción es exitosa */}
          {pago && (
            <div>
              <h3>Resultado del Pago</h3>
              <p><strong>Monto Pagado:</strong> ${pago.data.Monto_Pagado}</p>
              <p><strong>Saldo Restante:</strong> ${pago.data.Saldo}</p>
              <p><strong>Tipo de Cuenta:</strong> {pago.data.Tipo_Cuenta}</p>
              <p><strong>Moneda:</strong> {pago.data.Moneda}</p>
              <p><strong>Próxima Fecha de Pago:</strong> {new Date(pago.data.Proxima_Fecha_Pago).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagoTarjeta;
