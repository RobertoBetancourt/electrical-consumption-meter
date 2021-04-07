import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AlertaContext from '../context/alertas/alertaContext';
import AuthContext from '../context/auth/authContext';
import user from '../icons/user.png'
import './login.css';

const Register = (props) => {

    //Extraer los valores del context
    const alertaContext = useContext(AlertaContext);
    const { alerta, mostrarAlerta } = alertaContext;
 
    const authContext = useContext(AuthContext);
    const { mensaje, autenticado, registrarUsuario } = authContext;

    //En caso de que el usuario se haya autenticado o registrado o sea un registro duplicado
    useEffect(() => {

        if (autenticado) {
            mostrarAlerta('Usuario agregado correctamente', 'alerta-exito');
            props.history.push('/homepage');
        }

        if (mensaje) {
            mostrarAlerta(mensaje.msg, mensaje.categoria);
        }
        
        //eslint-disable-next-line
    }, [mensaje, autenticado, props.history]);

    //State para iniciar sesion
    const [usuario, setUsuario] = useState ({
        name: '',
        email:'',
        password:'',
        confirmar: ''
    });

    //Extraer de usuario
    const {name, email, password, confirmar} = usuario;

    const onChange = (e) =>{
         setUsuario({
             ...usuario,
             [e.target.name] : e.target.value
         })
    }

    //Cuando el usuaro quiere iniciar sesion
    const onSubmit = e => {
        e.preventDefault();

        //Validar que no haya campos vacios
        if (name.trim() === '' || password.trim() === '' || confirmar.trim() === '' || email.trim() === '') {
            mostrarAlerta('Todos los campos son obligatorios', 'alerta-error');
            return;
        }

        //Password minimo 6 caracteres
        if (password.length < 6) {
            mostrarAlerta('El password debe ser minimo de 6 caracteres', 'alerta-error');
            return;
        }

        //Ambos passwords iguales
        if (password !== confirmar) {
            mostrarAlerta('Los passwords no son iguales', 'alerta-error');
            return;
        }

        //Pasarlo al action
        registrarUsuario({
            name,
            email,
            password
        })
    }

    return (  
        <div className="form-usuario">
            { alerta ? ( <div className = {`alerta ${alerta.categoria}`}> { alerta.msg }</div>) : null }
            <div className="contenedor-form sombra-dark">
                <img class="centrado" src={user} width="30%"/>
                <h1>Nuevo usuario</h1>

                <form onSubmit = {onSubmit}>

                    <div className="campo-form">
                        <label htmlFor="text">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nombre"
                            value = {name}
                            onChange = {onChange}
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value = {email}
                            onChange = {onChange}
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value = {password}
                            onChange = {onChange}
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="password">Confirmar Password</label>
                        <input
                            type="password"
                            id="confirmar"
                            name="confirmar"
                            placeholder="Confirmar Password"
                            value = {confirmar}
                            onChange = {onChange}
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
