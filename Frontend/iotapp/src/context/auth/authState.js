
import React, { useReducer } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';

import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/token';

import { 
    OBTENER_USUARIO,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    CERRAR_SESION,
    REGISTRO_EXITOSO,
    REGISTRO_ERROR
} from '../../types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        autenticado: null,
        usuario: null, 
        msg: null, 
        cargando: true
    }

    const [ state, dispatch ] = useReducer(AuthReducer, initialState);

    const registrarUsuario = async datos => {
        try {
            console.log(datos);
            const respuesta = await clienteAxios.get('/insert?email=' + datos.email + "&password=" + datos.password + "&name=" + datos.name + "&stage=1&admin=1");
            console.log(respuesta.data);

            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data
            });

            // Obtener el usuario
            usuarioAutenticado();
        } catch (error) {
            // console.log(error.response.data.msg);
            const alerta = {
                msg: error.response.data.msg,
                categoria: 'alerta-error'
            }

            dispatch({
                type: REGISTRO_ERROR,
                payload: alerta
            })
        }
    }

    // Retorna el usuario autenticado
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token');
        if(token) {
            tokenAuth(token);
        }

        try {
            const respuesta = await clienteAxios.get('/auth');
            console.log(respuesta.data);
            dispatch({
                type: OBTENER_USUARIO,
                payload: respuesta.data.user
            });

        } catch (error) {
            console.log(error.response);
            dispatch({
                type: LOGIN_ERROR
            })
        }
    }

    // Cuando el usuario inicia sesión
    const iniciarSesion = async datos => {
        try {
            //console.log(datos)
            const respuesta = await clienteAxios.get('/login?email=' + datos.email + "&password=" + datos.password);
            console.log(respuesta);
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data
            });

            // Obtener el usuario
            usuarioAutenticado();
        } catch (error) {
            //console.log(error.response.data.msg);
            const alerta = {
                msg: "Los datos ingresados no son correctos",
                categoria: 'alerta-error'
            }

            dispatch({
                type: LOGIN_ERROR,
                payload: alerta
            })
        }
    }

    // Cierra la sesión del usuario
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    return(
        <AuthContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                msg: state.msg,
                cargando: state.cargando,
                iniciarSesion,
                usuarioAutenticado,
                registrarUsuario,
                cerrarSesion
            }}
        >{props.children}

        </AuthContext.Provider>
    )
}
export default AuthState;