import React from 'react';
import './login.css';
import user from '../icons/user.png'

export default function SignIn({email, password}) {

    function checkUser(email, password){
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }
          if (request.status === 200) {
            console.log('success', request.responseText);
            //this.showAlertRepeatedName();
          } else {
            console.warn('error');
            //this.createRoom(name, type, stage);
          } 
        };
        request.open('GET', 'http://localhost:5000/login?username=' + email + '&password=' + password);
        request.send();
    }

  return (
    <div className="form-usuario">
            <div className="contenedor-form sombra-dark">
                <img class="centrado" src={user} width="30%"/>
                <h1>Iniciar Sesión</h1>

                <form>
                    <div className="campo-form">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Tu Email"
                            value={email}
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