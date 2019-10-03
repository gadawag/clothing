import axios from 'axios';

const getUrlForAxios = () => {
    return process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://gadawag-clothing-server.herokuapp.com';
}

const instance = axios.create({
    baseURL: getUrlForAxios()
});

export default instance;