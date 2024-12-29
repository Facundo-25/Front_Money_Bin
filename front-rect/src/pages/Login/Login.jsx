import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [useUsername, setUseUsername] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [supervisorPassword, setSupervisorPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.ayd')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSupervisorPassword(reader.result.trim());
      };
      reader.readAsText(file);
    } else {
      setError('Por favor, selecciona un archivo .ayd válido');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const requestBody = {
      Correo_Electronico: !useUsername ? email : undefined,
      Nombre_Usuario: useUsername ? username : undefined,
      Contrasena: password,
      ContrasenaS: isSupervisor ? supervisorPassword : undefined,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, requestBody);

      const data = response.data;

      // Almacena los datos del usuario en localStorage 
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.usuario.Nombre_Usuario);
      localStorage.setItem('userId', data.usuario.Id_Usuario);
      localStorage.setItem('role', data.usuario.Rol);

      // Redirige al perfil correspondiente según el rol
      switch (data.usuario.Rol) {
        case 1:
          navigate('/cajero/perfil');
          break;
        case 2:
          navigate('/atencion-cliente/perfil');
          break;
        case 3:
          navigate('/administrador/perfil');
          break;
        case 4:
          navigate('/supervisor/perfil');
          break;
        default:
          setError('Rol no válido');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error en el inicio de sesión');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '0 auto' }}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={useUsername}
              onChange={() => setUseUsername((prev) => !prev)}
            />
            Utilizar Nombre de Usuario
          </label>
        </div>
        {useUsername ? (
          <div>
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isSupervisor}
              onChange={() => setIsSupervisor((prev) => !prev)}
            />
            Supervisor
          </label>
        </div>
        {isSupervisor && (
          <div>
            <label htmlFor="supervisorPassword">Cargar Contraseña de Supervisor:</label>
            <input
              type="file"
              id="supervisorPassword"
              accept=".ayd"
              onChange={handleFileUpload}
              style={{ display: 'block', width: '100%', marginTop: '8px' }}  // Asegura que el botón no se salga
            />
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '20px' }}>Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
