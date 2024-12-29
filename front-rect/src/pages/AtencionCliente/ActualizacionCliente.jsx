import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

const ActualizarCliente = () => {
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    telefono: '',
    direccion: '',
    correo: '',
    preguntaSeguridad: '',
    respuestaSeguridad: '',
    fechaActualizacion: new Date().toLocaleString(),
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

    try {
      console.log('formData:', formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/modficacion_datos_cliente`, 
        formData
      );
      
      // Asumiendo que el servidor responde con un JSON en el formato: { "mensaje": "" }
      const { mensaje } = response.data;

      if (response.status === 200) {
        setMensaje(mensaje || 'Los datos del cliente se actualizaron correctamente.');
      } else if (response.status === 400) {
        setMensaje(mensaje || 'Hubo un error al actualizar los datos.');
      }
    } catch (error) {
      setMensaje('Error de conexión o al enviar los datos.');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="AtencionCliente" />
      <div style={{ flex: 1 }}>
        <Header title="Actualizar Datos del Cliente" />
        <div style={{ padding: '20px' }}>
          <h2>Actualizar Datos del Cliente</h2>
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

            {/* Teléfono */}
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                
              />
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                
              />
            </div>

            {/* Correo electrónico */}
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                
              />
            </div>

            {/* Pregunta de seguridad */}
            <div className="mb-3">
              <label htmlFor="preguntaSeguridad" className="form-label">Pregunta de Seguridad</label>
              <input
                type="text"
                className="form-control"
                id="preguntaSeguridad"
                name="preguntaSeguridad"
                value={formData.preguntaSeguridad}
                onChange={handleChange}
                
              />
            </div>

            {/* Respuesta de seguridad */}
            <div className="mb-3">
              <label htmlFor="respuestaSeguridad" className="form-label">Respuesta de Seguridad</label>
              <input
                type="text"
                className="form-control"
                id="respuestaSeguridad"
                name="respuestaSeguridad"
                value={formData.respuestaSeguridad}
                onChange={handleChange}
                
              />
            </div>

            {/* Fecha de actualización */}
            <div className="mb-3">
              <label htmlFor="fechaActualizacion" className="form-label">Fecha y Hora de Actualización</label>
              <input
                type="text"
                className="form-control"
                id="fechaActualizacion"
                name="fechaActualizacion"
                value={formData.fechaActualizacion}
                readOnly
              />
            </div>

            <button type="submit" className="btn btn-primary">Actualizar Información</button>
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

export default ActualizarCliente;
