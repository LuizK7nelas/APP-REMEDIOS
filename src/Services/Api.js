import axios from 'axios';

const Api = axios.create({
    baseURL:'http://localhost:3000',
    //headers: {'allow': getEnvVars.apiKey}:
});

export default Api;