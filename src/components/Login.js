import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = () => {
    const loginData = {
      username,
      password,
      expiration: 604800,
      sliding: 0,
      deviceName: 'My Phone Model',
    };

    fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         // Reemplaza 'authenticationKey' con el valor adecuado
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticationKey) {
            console.log(data.authenticationKey);
          // El valor necesario se encuentra en data.authenticationKey
          const authKey = data.authenticationKey;

          // Almacena el valor en las cookies
          document.cookie = `authenticationKey=${authKey}; max-age=604800; path=/`;

          // Redirige a la vista de información del cliente
          navigate('/client-info');
        } else {
          setError('Datos inválidos'); // Mostrar mensaje de error en caso de autenticación fallida
        }
      })
      .catch((error) => {
        console.error('Error en la autenticación:', error);
        setError('Error en la autenticación'); // Mostrar mensaje de error en caso de error en la solicitud
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

