import React from 'react';
import user from '../icons/user.png'
import './login.css';

const Register = () => {
    return (  
        <div className="form-usuario">
            <div className="contenedor-form sombra-dark">
                <img class="centrado" src={user} width="30%"/>
                <h1>Nuevo usuario</h1>

                <form>

                    <div className="campo-form">
                        <label htmlFor="text">Nombre</label>
                        <input
                            type="text"
                            id="text"
                            name="text"
                            placeholder="Nombre"
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                        />
                    </div>

                    <div className="campo-form">
                        <input
                            type="submit" 
                            className="btn btn-primario btn-block" 
                            value="Crear cuenta" />
                    </div>
                    <div class="campo acciones">
                        <a href="/">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default Register;
