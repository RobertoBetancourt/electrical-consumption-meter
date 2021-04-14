import React, {useContext, useEffect} from 'react';
import AuthContext from '../../context/auth/authContext';
import { useHistory } from 'react-router-dom';
import './header.css';

const Header = () => {

    // Extraer la información de autenticación
    const authContext = useContext(AuthContext);
    const { usuario, usuarioAutenticado, cerrarSesion  } = authContext;

    const history = useHistory();

    useEffect(() => {
        usuarioAutenticado();
        // eslint-disable-next-line
    }, []);



    return ( 
                <button
                    className="btn1 btn1-blank cerrar-sesion"
                    onClick={ () => {
                        cerrarSesion();
                        history.push('/');
                    }}
                >Cerrar Sesión</button>
                )
}
 
export default Header;
