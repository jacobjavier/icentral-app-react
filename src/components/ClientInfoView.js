// ClientInfoView.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientStyles.css';

function ClientInfoView({ clientData, otherData1, otherData2, error, handleLogout })

{
    
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

export default ClientInfoView;
