// ClientInfoContainer.js
import React, { useEffect, useState } from 'react';
import { getDeviceToken } from './firebase';
import ClientInfoView from './ClientInfoView';

function ClientInfoContainer() {
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
          getDeviceToken(); // Llama a la función para obtener el token
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

    fetchData(
      'https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard',
      setClientData,
      'Solicitud de datos del cliente fallida'
    );
    fetchData(
      'https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client',
      setOtherData1,
      'Solicitud de datos adicionales 1 fallida'
    );
    fetchData(
      'https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services',
      setOtherData2,
      'Credenciales no validas'
    );
  }, []);

  const handleLogout = () => {
    document.cookie = 'authenticationKey=; max-age=0; path=/';
    window.location.href = '/';
  };

  return (
    <ClientInfoView
      clientData={clientData}
      otherData1={otherData1}
      otherData2={otherData2}
      error={error}
      handleLogout={handleLogout}
    />
  );
}

export default ClientInfoContainer;
