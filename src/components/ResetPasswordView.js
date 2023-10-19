import React, { useState } from 'react';

const ResetPasswordView = (props) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        var request = new XMLHttpRequest();
        request.open('PATCH', 'https://portal.icentral.com.mx/crm/api/v1.0/client-zone/reset-password');
        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                alert(`Status: ${request.status}\nBody: ${request.responseText}`);
                props.history.push("/login"); // redirigir a la página de login
            }
        };

        var body = {
            'username': email
        };

        request.send(JSON.stringify(body));
    }

    return (
        <div className="reset-password-container">
            <h2>Resetear Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit">Resetear</button>
            </form>
        </div>
    );
}

export default ResetPasswordView;

