import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Importar jsPDF

const PagoPrestamos = () => {
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    numeroPrestamo: '',
    monto: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        Cuenta_Cliente: formData.numeroCuenta,
        Numero_Prestamo: formData.numeroPrestamo,
        Monto: parseFloat(formData.monto),
        Id_Empleado: 1,
      };

      const url = `${process.env.REACT_APP_API_URL}/actualizarPrestamo`;
      const response = await axios.post(url, payload);

      alert(`Pago realizado con éxito: ${response.data.message}`);
      console.log(response.data);

      // Llamar a la función para generar el PDF
      generarComprobantePDF(response.data);
    } catch (error) {
      console.error('Error al realizar el pago:', error.response?.data || error.message);
      alert(`Hubo un error: ${error.response?.data?.error || 'No se pudo procesar el pago'}`);
    }
  };

  // Función para generar y descargar el comprobante PDF
  const generarComprobantePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de Pago de Préstamo', 20, 20);

    doc.setFontSize(12);
    doc.text(`Número de Cuenta: ${formData.numeroCuenta}`, 20, 40);
    doc.text(`Número de Préstamo: ${formData.numeroPrestamo}`, 20, 50);
    doc.text(`Monto Pagado: Q${formData.monto}`, 20, 60);

    if (data) {
      doc.text(`Estado del Pago: ${data.estado || 'Completado'}`, 20, 70);
      doc.text(`Fecha de Pago: ${new Date().toLocaleString()}`, 20, 80);
    }

    // Descargar el PDF
    doc.save('comprobante_pago_prestamo.pdf');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Cajero" />
      <div style={{ flex: 1 }}>
        <Header title="Pago de Préstamos" />
        <div style={{ padding: '20px' }}>
          <h2>Pago de Préstamos</h2>
          <p>Permite a los clientes realizar pagos parciales o totales de préstamos adquiridos con el banco Money Bin.</p>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-3">
              <label htmlFor="numeroCuenta" className="form-label">Número de cuenta del cliente</label>
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

            <div className="mb-3">
              <label htmlFor="numeroPrestamo" className="form-label">Número de préstamo</label>
              <input
                type="text"
                className="form-control"
                id="numeroPrestamo"
                name="numeroPrestamo"
                value={formData.numeroPrestamo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="monto" className="form-label">Monto a pagar</label>
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

            <button type="submit" className="btn btn-primary">Realizar Pago</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagoPrestamos;
