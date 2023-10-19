import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDeviceToken } from './firebase';  

function ClientInfo() {
  const [clientData, setClientData] = useState(null);
  const [otherData1, setOtherData1] = useState(null);
  const [otherData2, setOtherData2] = useState(null);
  const [error, setError] = useState(null);

  const getCookieValue = (name) => {
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return match ? match.pop() : '';
  };

  useEffect(() => {


    const authenticationKey = getCookieValue('authenticationKey');

    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          console.log('Permiso de notificaciones concedido.');
          getDeviceToken();  // Llama a la función para obtener el token
        } else {
          console.log('Permiso de notificaciones no concedido.');
        }
      })
      .catch((err) => {
        console.log('Error al solicitar permiso:', err);
      });
    
    const fetchData = async (url, setData, errorMsg) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-App-Key': authenticationKey,
          },
        });

        if (!response.ok) {
          throw new Error(errorMsg);
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard', setClientData, 'Solicitud de datos del cliente fallida');
    fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client', setOtherData1, 'Solicitud de datos adicionales 1 fallida');
    fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services?limit=1&offset=1', setOtherData2, 'Solicitud de datos adicionales 2 fallida');
  }, []);

  const handleLogout = () => {
    document.cookie = 'authenticationKey=; max-age=0; path=/';
    window.location.href = '/';
  };

  return (
    <div className="container mt-4">
      {error && <p className="text-danger">{error}</p>}

      {otherData1 && (
        <div>
          <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
          <h1>Hola, {otherData1.firstName}!</h1>
          <ul>
            <li>No. de Cliente: CJ{otherData1.id}</li>
            {otherData2 && otherData2.map((data) => (
              <React.Fragment key={data.id}>
                <li>servicio: {data.name}</li>
                <li>Dirección: {data.fullAddress}</li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {clientData && (
        <div>
          <h2>Información del Cliente</h2>
          <p>Nombre del Cliente: {clientData.firstName}</p>
          <p>Correo Electrónico: {clientData.email}</p>
        </div>
      )}

      {otherData1 && (
        <div>
          <h3>Nombre del cliente: {otherData1.firstName}</h3>
        </div>
      )}

      {otherData2 && (
        <div>
          <h3>Datos Adicionales 2</h3>
          {otherData2.map((data) => (
            <div key={data.id}>servicio: {data.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientInfo;
 




/* 
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Crea una estructura de recurso basada en Suspense
const createResource = (promise) => {
  let status = 'pending';
  let result;

  return {
    read() {
      if (status === 'success' || status === 'error') {
        return result;
      } else {
        throw promise.then(
          data => {
            status = 'success';
            result = data;
          },
          error => {
            status = 'error';
            result = error;
          }
        );
      }
    },
  };
};

const ClientInfoResource = {
  clientData: createResource(fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard').then(res => res.json())),
  otherData1: createResource(fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client').then(res => res.json())),
  otherData2: createResource(fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services?limit=1&offset=1').then(res => res.json()))
};

function ClientInfo() {
  const clientData = ClientInfoResource.clientData.read();
  const otherData1 = ClientInfoResource.otherData1.read();
  const otherData2 = ClientInfoResource.otherData2.read();

  const handleLogout = () => {
    document.cookie = 'authenticationKey=; max-age=0; path=/';
    window.location.href = '/';
  };

  return (
    <div className="container mt-4">
      {otherData1 && (
        <div>
          <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
          <h1>Hola, {otherData1.firstName}!</h1>
          <ul>
            <li>No. de Cliente: CJ{otherData1.id}</li>
            {otherData2 && otherData2.map((data) => (
              <React.Fragment key={data.id}>
                <li>servicio: {data.name}</li>
                <li>Dirección: {data.fullAddress}</li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {clientData && (
        <div>
          <h2>Información del Cliente</h2>
          <p>Nombre del Cliente: {clientData.firstName}</p>
          <p>Correo Electrónico: {clientData.email}</p>
        </div>
      )}

      {otherData1 && (
        <div>
          <h3>Nombre del cliente: {otherData1.firstName}</h3>
        </div>
      )}

      {otherData2 && (
        <div>
          <h3>Datos Adicionales 2</h3>
          {otherData2.map((data) => (
            <div key={data.id}>servicio: {data.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <ClientInfo />
    </React.Suspense>
  );
}

export default App;
 */