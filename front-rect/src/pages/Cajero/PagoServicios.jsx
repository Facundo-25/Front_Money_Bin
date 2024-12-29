import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Importar jsPDF

const PagoServicios = () => {
  const [formData, setFormData] = useState({
    nombrePagador: '',
    tipoServicio: '',
    monto: '',
    numeroCuenta: '',
    dpi: '',
    esPagoConCuenta: false,
  });

  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = formData.esPagoConCuenta
      ? {
          Nombre_Pagador: formData.nombrePagador,
          Servicio: formData.tipoServicio,
          Monto: parseFloat(formData.monto),
          NoCuenta: formData.numeroCuenta,
          CUI: formData.dpi,
          Id_Empleado: 1,
        }
      : {
          Nombre_Pagador: formData.nombrePagador,
          Servicio: formData.tipoServicio,
          Monto: parseFloat(formData.monto),
          Fecha_Hora_Transaccion: new Date().toISOString(),
          Id_Empleado: 1,
        };

    const url = formData.esPagoConCuenta
      ? process.env.REACT_APP_API_URL + '/pagoServicioCuentaBancaria'
      : process.env.REACT_APP_API_URL + '/pagoServicioCajero';

    setLoading(true);
    setSuccessMessage(''); // Limpiar el mensaje de éxito antes de realizar la solicitud

    try {
      const response = await axios.post(url, payload);
      setSuccessMessage('Pago realizado con éxito.');

      // Llamar a la función para generar el PDF del comprobante
      generarComprobantePDF(response.data);
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      setSuccessMessage('Hubo un error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  // Función para generar y descargar el comprobante PDF
  const generarComprobantePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de Pago de Servicio', 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre del Pagador: ${formData.nombrePagador}`, 20, 40);
    doc.text(`Tipo de Servicio: ${formData.tipoServicio}`, 20, 50);
    doc.text(`Monto Pagado: Q${formData.monto}`, 20, 60);

    if (formData.esPagoConCuenta) {
      doc.text(`Número de Cuenta: ${formData.numeroCuenta}`, 20, 70);
      doc.text(`Número de DPI: ${formData.dpi}`, 20, 80);
    }

    doc.text(`Fecha de Pago: ${new Date().toLocaleString()}`, 20, 90);

    // Si tienes algún detalle extra, lo puedes agregar aquí, como el estado de la transacción
    if (data) {
      doc.text(`Estado de la Transacción: ${data.estado || 'Completado'}`, 20, 100);
    }

    // Descargar el PDF
    doc.save('comprobante_pago_servicio.pdf');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Cajero" />
      <div style={{ flex: 1 }}>
        <Header title="Pago de Servicios" />
        <div style={{ padding: '20px' }}>
          <h2>Pago de Servicios</h2>
          <p>El cajero puede realizar pagos de servicios básicos en nombre de los clientes desde el sistema del banco.</p>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-3">
              <label htmlFor="nombrePagador" className="form-label">Nombre del Pagador</label>
              <input
                type="text"
                className="form-control"
                id="nombrePagador"
                name="nombrePagador"
                value={formData.nombrePagador}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tipoServicio" className="form-label">Tipo de Servicio</label>
              <select
                className="form-select"
                id="tipoServicio"
                name="tipoServicio"
                value={formData.tipoServicio}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un servicio</option>
                <option value="Agua">Agua</option>
                <option value="Luz">Luz</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Internet">Internet</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="monto" className="form-label">Monto a Pagar</label>
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

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="esPagoConCuenta"
                name="esPagoConCuenta"
                checked={formData.esPagoConCuenta}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="esPagoConCuenta">
                ¿Pagar desde cuenta bancaria?
              </label>
            </div>

            {formData.esPagoConCuenta && (
              <>
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

                <div className="mb-3">
                  <label htmlFor="dpi" className="form-label">Número de DPI</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dpi"
                    name="dpi"
                    value={formData.dpi}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" id="submitPago" disabled={loading}>
              {loading ? 'Procesando...' : 'Realizar Pago'}
            </button>
          </form>

          {/* Mostrar el mensaje de éxito o error */}
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default PagoServicios;
