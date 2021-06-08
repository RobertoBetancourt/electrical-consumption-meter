import axios from 'axios';

const clienteAxios = axios.create({
    baseURL : 'https://arcane-garden-46177.herokuapp.com'
});

export default clienteAxios;