import React, { useEffect, useState } from 'react';
import { getDeviceToken } from './firebase';
import ClientInfoView from './ClientInfoView';
import { pauseService, resumeService } from './Apig';

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

    const fetchData = async (url, errorMsg) => {
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

        return response.json();
      } catch (error) {
        throw error;
      }
    };

    // Función para manejar la pausa del servicio

    // Función para manejar la reanudación del servicio

    // Llama a fetchData para cargar los datos iniciales
        fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard', 'Solicitud de datos del cliente fallida')
            .then((data) => setClientData(data))
            .catch((error) => setError(error.message));

        fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client', 'Solicitud de datos adicionales 1 fallida')
            .then((data) => setOtherData1(data))
            .catch((error) => setError(error.message));

        fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services', 'Credenciales no validas')
            .then((data) => setOtherData2(data))
            .catch((error) => setError(error.message));
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
      handlePauseService={pauseService}
        handleResumeService={resumeService}
    />
  );
}

export default ClientInfoContainer;

