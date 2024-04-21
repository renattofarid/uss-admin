import axios from "axios";
import { config } from "../config/app";

const baseURL = config.apiUrl;
const baseURLCloudinary = 'https://api.cloudinary.com/v1_1/dndpjrsa5'
export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

export const apiCloudinary = axios.create({
    baseURL: baseURLCloudinary,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if ( token ) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
);

// export const apiLogin = axios.create({
//     baseURL: 'http://181.224.242.66:8080/cixdwp/api',
//     headers: {
//         'Content-Type': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest'
//     }
// })