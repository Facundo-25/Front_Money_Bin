import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const RegistroEmpleado = () => {
  // Recuperar los datos almacenados en localStorage
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    rol: 1, // Rol por defecto (Cajero)
    nombre: '',
    apellido: '',
    telefono: '',
    fotografia: null,
    genero: 'Masculino',
    estadoCivil: 'Soltero',
    estado: 'alta',
  });

  const [error, setError] = useState(''); // Estado para almacenar errores

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
      contrasena: '',
      confirmarContrasena: '',
      rol: 1,
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

    // Validación de contraseñas
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return; // Evitar que se envíe el formulario si las contraseñas no coinciden
    }

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
        Contrasena: formData.contrasena,
        Rol: formData.rol, // Agregar el rol
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
      const response = await fetch(process.env.REACT_APP_API_URL + '/registrar', {
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
        alert(`Usuario registrado exitosamente: ${data.mensaje}`);
        resetForm();  // Limpiar el formulario después del registro exitoso
      } else {
        alert(`Error al registrar usuario: ${data.mensaje || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Hubo un error al intentar registrar el usuario.');
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
      <Sidebar role="Administrador" />
      <div style={{ flex: 1 }}>
        <Header title="Registrar Empleado" />
        <div style={{ padding: '20px' }}>
          <h2>Registrar Nuevo Empleado</h2>
          
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

            {/* Contraseña */}
            <div className="mb-3">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
            </div>

            {/* Confirmación de contraseña */}
            <div className="mb-3">
              <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
              <input type="password" className="form-control" id="confirmarContrasena" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange} required />
            </div>

            {/* Mostrar error si las contraseñas no coinciden */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Rol */}
            <div className="mb-3">
              <label htmlFor="rol" className="form-label">Rol</label>
              <select className="form-control" id="rol" name="rol" value={formData.rol} onChange={handleChange} required>
                <option value="1">Cajero</option>
                <option value="2">Atención al Cliente</option>
              </select>
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
            <button type="submit" className="btn btn-primary">Registrar Empleado</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroEmpleado;
