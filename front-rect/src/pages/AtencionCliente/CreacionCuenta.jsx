import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const CreacionCuenta = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cui: '',
    telefono: '',
    correoElectronico: '',
    fechaNacimiento: '',
    genero: 'Masculino',
    foto: '',
    preguntaSeguridad: '',
    respuestaSeguridad: '',
    idUsuarioCrea: '',
    tipoCuenta: 'monetaria',
    moneda: 'GTQ',
    saldo: '',
    limiteCambioMoneda: 10000,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const payload = {
      Nombre: formData.nombre,
      Apellido: formData.apellido,
      CUI: formData.cui,
      Telefono: formData.telefono,
      Correo_Electronico: formData.correoElectronico,
      Fecha_Nacimiento: formData.fechaNacimiento,
      Genero: formData.genero,
      Foto: formData.foto,
      Pregunta_Seguridad: formData.preguntaSeguridad,
      Respuesta_Seguridad: formData.respuestaSeguridad,
      Id_Usuario_Crea: parseInt(formData.idUsuarioCrea),
      Tipo_Cuenta: formData.tipoCuenta,
      Moneda: formData.moneda,
      Saldo: parseFloat(formData.saldo),
      Limite_Cambio_Moneda: parseInt(formData.limiteCambioMoneda),
    };

    console.log(payload);

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/crear_cuenta', payload);
      setMessage(response.data.mensaje || 'Cuenta creada exitosamente.');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.mensaje || 'Hubo un error al procesar la solicitud.');
      } else {
        setMessage('Error al conectar con el servidor.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="AtencionCliente" />
      <div style={{ flex: 1 }}>
        <Header title="Creación de Cuenta" />
        <div style={{ padding: '20px', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          <h2>Creación de Cuenta</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="correoElectronico" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="correoElectronico"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="genero" className="form-label">Género</label>
              <select
                id="genero"
                name="genero"
                className="form-control"
                value={formData.genero}
                onChange={handleChange}
                required
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="foto" className="form-label">Foto (Base64)</label>
              <input
                type="text"
                className="form-control"
                id="foto"
                name="foto"
                value={formData.foto}
                onChange={handleChange}
                required
              />
            </div>
            {/* Campos de la cuenta */}
            <div className="mb-3">
              <label htmlFor="idUsuarioCrea" className="form-label">ID Usuario que Crea</label>
              <input
                type="number"
                className="form-control"
                id="idUsuarioCrea"
                name="idUsuarioCrea"
                value={formData.idUsuarioCrea}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tipoCuenta" className="form-label">Tipo de Cuenta</label>
              <select
                id="tipoCuenta"
                name="tipoCuenta"
                className="form-control"
                value={formData.tipoCuenta}
                onChange={handleChange}
                required
              >
                <option value="monetaria">Monetaria</option>
                <option value="ahorro">Ahorro</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="moneda" className="form-label">Moneda</label>
              <select
                id="moneda"
                name="moneda"
                className="form-control"
                value={formData.moneda}
                onChange={handleChange}
                required
              >
                <option value="GTQ">GTQ</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="saldo" className="form-label">Saldo Inicial</label>
              <input
                type="number"
                className="form-control"
                id="saldo"
                name="saldo"
                value={formData.saldo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="limiteCambioMoneda" className="form-label">Límite de Cambio de Moneda</label>
              <input
                type="number"
                className="form-control"
                id="limiteCambioMoneda"
                name="limiteCambioMoneda"
                value={formData.limiteCambioMoneda}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="preguntaSeguridad" className="form-label">Pregunta de Seguridad</label>
              <input
                type="text"
                className="form-control"
                id="preguntaSeguridad"
                name="preguntaSeguridad"
                value={formData.preguntaSeguridad}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="respuestaSeguridad" className="form-label">Respuesta de Seguridad</label>
              <input
                type="text"
                className="form-control"
                id="respuestaSeguridad"
                name="respuestaSeguridad"
                value={formData.respuestaSeguridad}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creando Cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreacionCuenta;
