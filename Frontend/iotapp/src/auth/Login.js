import React, {useContext, useEffect, useState} from 'react';
import './login.css';
import user from '../icons/user.png'
import AuthContext from '../context/auth/authContext';

export default function SignIn(props) {

    // extraer los valores del context
    const authContext = useContext(AuthContext);
    const { msg, autenticado, iniciarSesion } = authContext;

      useEffect(() => {
        if(autenticado) {
            props.history.push('/homepage');
        }

        // eslint-disable-next-line
    }, [msg, autenticado, props.history]);

    // State para iniciar sesión
    const [usuario, guardarUsuario] = useState({
        email: '',
        password: ''
    });

    // extraer de usuario
    const { email, password } = usuario;

    const onChange = e => {
        guardarUsuario({
            ...usuario,
            [e.target.name] : e.target.value
        })
    }

    // Cuando el usuario quiere iniciar sesión
    const onSubmit = e => {
        e.preventDefault();

        // Validar que no haya campos vacios
        if(email.trim() === '' || password.trim() === '') {
            return;
        }
        
        console.log(email, password);    
        // Pasarlo al action
        iniciarSesion({ email, password });
    }

  return (
    <div className="form-usuario">
            <div className="contenedor-form sombra-dark">
                <img class="centrado" src={user} width="30%"/>
                <h1>Iniciar Sesión</h1>

                <form onSubmit={onSubmit}>
                    <div className="campo-form">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Tu Email"
                            value={email}
                            onChange={onChange}
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                        />
                    </div>

                    <div className="campo-form">
                        <input
                            type="submit" 
                            className="btn btn-primario btn-block" 
                            value="Iniciar Sesión" />
                    </div>
                    <div class="campo acciones">
                        <a href="·">Crear cuenta</a>
                        <a href="#">Olvidé mi contraseña</a>
                    </div>
                </form>
            </div>
        </div>
  );
}