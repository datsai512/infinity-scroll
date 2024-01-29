import axios from 'axios';


const baseURL = 'https://dummyjson.com/';
const headers = { 'Content-Type': 'application/json' }

const request = axios.create({
    baseURL,
    timeout: 15000,
    headers
});


export default request;
