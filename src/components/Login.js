/* import React, { useState } from 'react';
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

 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginStyles.css';
import { messaging, getDeviceToken } from './firebase'; // Importa el objeto de mensajería desde tu archivo firebase.js

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const loginData = {
      username,
      password,
      expiration: 604800,
      sliding: 1,
      deviceName: 'My Phone Model',
    };

    try {
      const response = await fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Asegúrate de agregar cualquier otra cabecera si es necesario
        },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (data.authenticationKey) {
        document.cookie = `authenticationKey=${data.authenticationKey}; max-age=604800; path=/`;
        
        // Solicita el token de notificación FCM y almacénalo en tu servidor
        const currentToken = await getDeviceToken(messaging);
        console.log('Token de FCM:', currentToken);
        
       
       
       
        // Redirige a la página de información del cliente
        navigate('/client-info');
      } else {
        setError('Datos inválidos');
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      setError('Error en la autenticación');
    }
  }, [username, password, navigate]);

  return (
    <div className="loginBackground">
      <div className="loginContainer">
        <div className="loginHeader">
          <h2>Acceso a cuenta</h2>
        </div>
        <form onSubmit={handleLogin} className="loginForm">
          {error && <p className="errorMessage">{error}</p>}
          <div className="formGroup">
            <label>Email:</label>
            <input type="text" className="formInput" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="formGroup">
            <label>Contraseña:</label>
            <input type="password" className="formInput" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit" className="loginButton">Ingresar</button>
          <div className="extraOptions">
            Crear cuenta / Recuperar contraseña
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;