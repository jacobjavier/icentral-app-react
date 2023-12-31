import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDeviceToken } from './firebase';
import './ClientStyles.css';


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
    <div className="container mt-4">
      {error && <p className="text-danger">{error}</p>}

      {otherData1 && (
  <div className='row'>
    <h3 className='text-center my-3'>Hola, {otherData1.firstName}!</h3>
    <div className='card bg-client-color'>
      <h6 className='card-header list-group-item my-3'>No. de Cliente: CJ{otherData1.id}</h6>
      <ul className='list-group list-group-flush'>
        <div className="row">
          {otherData2 &&
            otherData2.map((data) => (
              <div className="col-md-6" key={data.id}>
                <div className={`card bg-service my-3 ${data.status === 1 ? 'text-success' : 'text-danger'}`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      Servicio: {data.name}
                    </h5>
                    <p className="card-text">
                      Dirección: { data.fullAddress }
                    </p>
                    {data.status === 1 ? (
                      <button className="btn btn-primary">Pausar Servicio</button>
                    ) : (
                      <button className="btn btn-danger">Reactivar Servicio</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ul>
    </div>
  </div>
)}



{clientData && (
  <div className="row bg-info-color my-3 justify-content-center text-center">
    <h2 className="col-12">Información de Facturación</h2>

    {otherData2 &&
      otherData2.map((data) => (
        <div className={`col-md-${12 / otherData2.length} my-3`} key={data.id}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Servicio: {data.name}</h5>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="card-text">
                    Fecha límite de pago:
                    <br />
                    {new Date(data.lastInvoicedDate).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h5 className="card-text">
                    Corte a partir:
                    <br />
                    {(() => {
                      const fechaOriginal = new Date(data.lastInvoicedDate);
                      const fechaNueva = new Date(fechaOriginal);
                      fechaNueva.setDate(fechaOriginal.getDate() + 4);
                      return fechaNueva.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                      });
                    })()}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
  </div>
)}





{clientData && (
  <div className="row bg-success-gradient">
    <h3 className="col-12 text-center">Estado de cuenta</h3>
    
    <div className="col-md-6 my-3">
      <div className="card bg-sc">
        <div className="card-body">
          <h5 className="card-title">Saldo</h5>
          <p className="card-text">
            ${clientData.accountBalance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>

    {clientData && (
  <div className="col-md-6 my-3">
    <div className="card bg-sc">
      <div className="card-body">
        <h5 className="card-title">Cuenta</h5>
        {otherData2 && otherData2.length > 1 && (
          <>
            <div className="row">
              <div className="col">
                <p className="card-text">
                  <strong>Servicios Activos:</strong>
                </p>
                {otherData2.map((data) => (
                  data.status === 1 && (
                    <div key={data.id}>
                      <span className="text-success">{data.name}</span>
                    </div>
                  )
                ))}
              </div>
              <div className="col">
                <p className="card-text">
                  <strong>Servicios Inactivos:</strong>
                </p>
                {otherData2.map((data) => (
                  data.status !== 1 && (
                    <div key={data.id}>
                      <span className="text-danger">{data.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </>
        )}
        {otherData2 && otherData2.length === 1 && otherData2[0].status === 1 && (
          <p className="card-text"> Activa</p>
        )}
      </div>
    </div>
  </div>
)}




  </div>
)}

<div className="">
      <div className="row justify-content-center">
        <div className="">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Métodos de Pago</h5>
              <div className="row">
                <div className="col-4">
                  <button className="btn btn-primary btn-block">Pago Online</button>
                </div>
                <div className="col-4">
                  <button className="btn btn-info btn-block">Pago en OXXO</button>
                </div>
                <div className="col-4">
                  <button className="btn btn-success btn-block">Transferencia Bancaria</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


      <button className="btn btn-danger my-3" onClick={handleLogout}>
        Cerrar Sesión
      </button>
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