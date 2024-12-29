import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const RegistrarAdmin = () => {
  // Recuperar los datos almacenados en localStorage
  const token = localStorage.getItem('token');
  const userId = 1;
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    nombre: '',
    apellido: '',
    telefono: '',
    fotografia: null,
    genero: 'Masculino',
    estadoCivil: 'Soltero',
    estado: 'alta',
  });

  const [error, setError] = useState(''); // Estado para almacenar errores
  const [successMessage, setSuccessMessage] = useState(''); // Estado para mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensaje de error

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Limpiar mensaje de error cuando el usuario cambia el valor
  };

  // Restablecer el formulario a su estado inicial
  const resetForm = () => {
    setFormData({
      nombreUsuario: '',
      correo: '',
      nombre: '',
      apellido: '',
      telefono: '',
      fotografia: null,
      genero: 'Masculino',
      estadoCivil: 'Soltero',
      estado: 'alta',
    });
    setError(''); // Limpiar cualquier error al restablecer el formulario
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir la fotografía a base64
      const fotoBase64 = await toBase64(formData.fotografia);

      // Generar la firma digital (se puede personalizar si es necesario)
      const firmaDigital = `Firma_${formData.nombreUsuario}`;

      // Crear el payload
      const payload = {
        Id_Usuario_Crea: userId, 
        Nombre_Usuario: formData.nombreUsuario,
        Correo_Electronico: formData.correo,
        Firma_Digital: firmaDigital,
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        Numero_Telefonico: formData.telefono,
        Foto: fotoBase64,
        Genero: formData.genero,
        Estado_Civil: formData.estadoCivil,
        Estado: formData.estado,
      };

      // Llamada al endpoint
      const response = await fetch(process.env.REACT_APP_API_URL + '/registrarAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir el token JWT en los headers
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(payload);

      if (response.ok) {
        setSuccessMessage(`Usuario registrado exitosamente: ${data.mensaje}`);
        setErrorMessage(''); // Limpiar el mensaje de error si es exitoso
        resetForm();  // Limpiar el formulario después del registro exitoso
      } else {
        setErrorMessage(`Error al registrar usuario: ${data.mensaje || 'Error desconocido'}`);
        setSuccessMessage(''); // Limpiar el mensaje de éxito si hay un error
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setErrorMessage('Hubo un error al intentar registrar el usuario.');
      setSuccessMessage(''); // Limpiar el mensaje de éxito si hay un error
    }
  };

  // Convertir archivo a Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Supervisor" />
      <div style={{ flex: 1 }}>
        <Header title="Registrar Admin" />
        <div style={{ padding: '20px' }}>
          <h2>Registrar Nuevo Empleado Administrador</h2>

          {/* Mensajes de éxito y error con Bootstrap */}
          {successMessage && (
            <div className="alert alert-success" role="alert" style={{ marginBottom: '20px' }}>
              <strong>Éxito: </strong>{successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert" style={{ marginBottom: '20px' }}>
              <strong>Error: </strong>{errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Nombre de usuario */}
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
              <input type="text" className="form-control" id="nombreUsuario" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
            </div>

            {/* Correo electrónico */}
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>

            {/* Firma Digital (se genera automáticamente) */}
            <div className="mb-3">
              <label htmlFor="firmaDigital" className="form-label">Firma Digital</label>
              <input type="text" className="form-control" id="firmaDigital" value={`Firma_${formData.nombreUsuario}`} disabled />
            </div>

            {/* Nombre */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            {/* Apellido */}
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input type="text" className="form-control" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>

            {/* Número de teléfono */}
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Número de Teléfono</label>
              <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>

            {/* Foto */}
            <div className="mb-3">
              <label htmlFor="fotografia" className="form-label">Foto</label>
              <input type="file" className="form-control" id="fotografia" name="fotografia" onChange={(e) => setFormData({ ...formData, fotografia: e.target.files[0] })} required />
            </div>

            {/* Género */}
            <div className="mb-3">
              <label htmlFor="genero" className="form-label">Género</label>
              <select className="form-control" id="genero" name="genero" value={formData.genero} onChange={handleChange} required>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Estado Civil */}
            <div className="mb-3">
              <label htmlFor="estadoCivil" className="form-label">Estado Civil</label>
              <select className="form-control" id="estadoCivil" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} required>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
              </select>
            </div>

            {/* Estado */}
            <div className="mb-3">
              <label htmlFor="estado" className="form-label">Estado</label>
              <select className="form-control" id="estado" name="estado" value={formData.estado} onChange={handleChange} required>
                <option value="Alta">Alta</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            {/* Botón de envío */}
            <button type="submit" id="registrarAdministrador" className="btn btn-primary">Registrar Administrador</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarAdmin;
