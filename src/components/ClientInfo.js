import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function ClientInfo() {
  const [clientData, setClientData] = useState(null);
  const [otherData1, setOtherData1] = useState(null);
  const [otherData2, setOtherData2] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mueve la lógica de recuperación de authenticationKey aquí
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const authenticationKey = cookies.authenticationKey;

    // Realiza la solicitud para obtener datos del cliente
    fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-App-Key': authenticationKey,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Solicitud de datos del cliente fallida');
        }
        return response.json();
      })
      .then((data) => {
        setClientData(data);
        // Registra los datos en la consola
        console.log('Datos del cliente:', data);
      })
      .catch((error) => {
        setError('Error al obtener los datos del cliente');
      });

    // Realiza la primera solicitud para obtener datos adicionales
    fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-App-Key': authenticationKey,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Solicitud de datos adicionales 1 fallida');
            }
            return response.json();
        })
        .then((data) => {
        setOtherData1(data);
        // Registra los datos en la consola
        console.log('Datos adicionales 1:', data);
      })
      .catch((error) => {
        setError('Error al obtener datos adicionales 1');
      });

    // Realiza la segunda solicitud para obtener datos adicionales
    fetch('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services?limit=1&offset=1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-App-Key': authenticationKey,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Solicitud de datos adicionales 2 fallida');
        }
        return response.json();
      })
      .then((data) => {
        setOtherData2(data);
        // Registra los datos en la consola
        console.log('Datos adicionales 2:', data);
      })
      .catch((error) => {
        setError('Error al obtener datos adicionales 2');
      });
  }, []); // Asegúrate de que no haya dependencias para evitar el error

  return (
    
    <div className="container mt-4">
{otherData1 && (
    <div>
      <h3>Hola, {otherData1.firstName}!</h3>
      <ul>
        <li> No. de Cliente: CJ{otherData1.id}</li>
        <li>Fecha de Nacimiento: {otherData1.birthDate}</li>
        <li>Fecha de Registro: {otherData1.registerDate}</li>
      </ul>
    </div>
  )}


  <h2>Información del Cliente</h2>
  {error && <p className="text-danger">{error}</p>}
  {clientData && (
    <div>
      <p className=''>Nombre del Cliente: {clientData.firstName}</p>
      <p>Correo Electrónico: {clientData.email}</p>
      {/* Mostrar otros datos del cliente según la respuesta de la API */}
    </div>
  )}
  {otherData1 && (
    <div>
      <h3>Nombre del cliente {otherData1.firstName}</h3>
      {/* Mostrar datos adicionales 1 según la respuesta de la API */}
    </div>
  )}
  {otherData2 && (
    <div>
      <h3>Datos Adicionales 2 {otherData2.name}</h3>
      {/* Mostrar datos adicionales 2 según la respuesta de la API */
      otherData2.map((data) => (<div>servicio {data.name}</div>))
      }
    </div>
  )}
</div>

  );
}

export default ClientInfo;
