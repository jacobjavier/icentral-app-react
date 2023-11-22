const appKeyString = '+kU080mYecWh6qQ3i0FJSsA0FZ3RzTozxLI+mwibGiCd1mcP70VIQARhk7q/L4C5';

// Función para pausar el servicio
export const pauseService = async (id) => {
  const url = `https://portal.icentral.com.mx/crm/api/v1.0/clients/services/${id}/suspend`;
  const body = JSON.stringify({
    suspensionReasonId: 1, // Agrega los datos que necesitas en el cuerpo de la solicitud
  });

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-App-Key': appKeyString,
      },
      body,
    });

    if (response.status === 200) {
      return 'Servicio pausado con éxito';
    } else {
      throw  Error('No se pudo pausar el servicio');
    }
  } catch (error) {
    throw error;
  }
};

// Función para reanudar el servicio
export const resumeService = async (id) => {
  const url = `https://portal.icentral.com.mx/crm/api/v1.0/clients/services/${id}/cancel-suspend`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-App-Key': appKeyString,
      },
    });

    if (response.status === 200) {
      return 'Servicio reanudado con éxito';
    } else {
      throw  Error('No se pudo reanudar el servicio');
    }
  } catch (error) {
    throw error;
  }
};
