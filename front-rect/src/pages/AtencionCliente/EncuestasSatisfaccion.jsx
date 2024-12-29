import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const EncuestaSatisfaccion = () => {
  const [formData, setFormData] = useState({
    numeroCliente: '',
    calidadServicios: '',
    facilidadUso: '',
    rapidezTransacciones: '',
    seguridadPlataforma: '',
    recomendacion: '',
    fechaEncuesta: new Date().toLocaleString(),
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error

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
      Id_Cliente: formData.numeroCliente,
      Calidad_Servicios: formData.calidadServicios,
      Facilidad_Uso: formData.facilidadUso,
      Rapidez_Transacciones: formData.rapidezTransacciones,
      Seguridad_Plataforma: formData.seguridadPlataforma,
      Recomendacion: formData.recomendacion,
    };

    console.log('Payload enviado:', payload);

    setLoading(true);
    setSuccessMessage(''); // Resetear el mensaje de éxito antes de enviar
    setErrorMessage(''); // Resetear el mensaje de error antes de enviar

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insertar_encuesta`,
        payload
      );

      if (response.status === 200) {
        setSuccessMessage('Encuesta enviada exitosamente.');
      } else {
        setErrorMessage('Error inesperado al enviar la encuesta.');
      }
    } catch (error) {
      console.error('Error al enviar la encuesta:', error);
      setErrorMessage('Error de conexión al enviar la encuesta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Sidebar role="AtencionCliente" />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Header title="Encuesta de Satisfacción" />
        <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
          <h2>Encuesta de Satisfacción</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Número de Cliente (Opcional) */}
            <div className="mb-3">
              <label htmlFor="numeroCliente" className="form-label">Número de Cliente (Opcional)</label>
              <input
                type="text"
                className="form-control"
                id="numeroCliente"
                name="numeroCliente"
                value={formData.numeroCliente}
                onChange={handleChange}
              />
            </div>

            {/* Preguntas de la encuesta */}
            {['calidadServicios', 'facilidadUso', 'rapidezTransacciones', 'seguridadPlataforma', 'recomendacion'].map((question, index) => (
              <div className="mb-3" key={question}>
                <label htmlFor={question} className="form-label">
                  {[
                    '¿Qué te parece la calidad de los servicios bancarios que ofrece el banco?',
                    '¿Cómo calificarías la facilidad de uso de la plataforma?',
                    '¿Qué tan rápido fue el proceso de transacciones en la banca virtual?',
                    '¿La seguridad del banco en línea te parece confiable?',
                    '¿Recomendarías el banco a otras personas?',
                  ][index]}
                </label>
                <div>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={`${question}-${rating}`}>
                      <input
                        type="radio"
                        id={`${question}-${rating}`}
                        name={question}
                        value={rating}
                        checked={formData[question] === String(rating)}
                        onChange={handleChange}
                      />
                      <label htmlFor={`${question}-${rating}`}>{rating}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Fecha de la Encuesta */}
            <div className="mb-3">
              <label htmlFor="fechaEncuesta" className="form-label">Fecha y Hora de la Encuesta</label>
              <input
                type="text"
                className="form-control"
                id="fechaEncuesta"
                name="fechaEncuesta"
                value={formData.fechaEncuesta}
                readOnly
              />
            </div>

            <button type="submit" className="btn btn-primary" id="botonEnviarEncuesta" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Encuesta'}
            </button>

            {/* Mostrar el mensaje de éxito o error */}
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaSatisfaccion;
