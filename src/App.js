import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Cambia "Switch" a "Routes"
import Login from './components/Login';
import ClientInfo from './components/ClientInfoContainer';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes> {/* Cambia "Switch" a "Routes" */}
          <Route path="/" element={<Login />} /> {/* Cambia "component" a "element" */}
          <Route path="/client-info" element={<ClientInfo />} /> {/* Cambia "component" a "element" */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
