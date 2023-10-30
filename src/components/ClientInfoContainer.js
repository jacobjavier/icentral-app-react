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
    const handlePauseService = async (id, appKeyString) => {
      const shouldPause = window.confirm('¿Estás seguro de que deseas suspender el servicio?');
      if (shouldPause) {
        try {
          await pauseService(id, appKeyString);
          // Llama a fetchData para obtener datos actualizados después de la pausa
          const updatedClientData = await fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard', 'Solicitud de datos del cliente fallida');
          const updatedOtherData1 = await fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client', 'Solicitud de datos adicionales 1 fallida');
          const updatedOtherData2 = await fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services', 'Credenciales no validas');

          setClientData(updatedClientData);
          setOtherData1(updatedOtherData1);
          setOtherData2(updatedOtherData2);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    // Función para manejar la reanudación del servicio
    const handleResumeService = async (id, appKeyString) => {
      const shouldResume = window.confirm('¿Estás seguro de que deseas reactivar el servicio?');
      if (shouldResume) {
        try {
          await resumeService(id, appKeyString);
          // Llama a fetchData para obtener datos actualizados después de la reanudación
          const updatedClientData = await fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/dashboard', 'Solicitud de datos del cliente fallida');
          const updatedOtherData1 = await fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/client', 'Solicitud de datos adicionales 1 fallida');
          const updatedOtherData2 = await fetchData('https://portal.icentral.com.mx/crm/api/v1.0/client-zone/services', 'Credenciales no validas');

          setClientData(updatedClientData);
          setOtherData1(updatedOtherData1);
          setOtherData2(updatedOtherData2);
        } catch (error) {
          setError(error.message);
        }
      }
    };

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

