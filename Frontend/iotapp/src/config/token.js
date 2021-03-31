import clienteAxios from './axios';

const tokenAuth = token => {
    if(token) {
        clienteAxios.Authorization = `Bearer ${token}`
    } else {
        delete clienteAxios.Authorization;
    }
}

export default tokenAuth;