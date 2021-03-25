import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';


export function loginUser(dataToSubmit) {

    const request = axios.post('/api/users/login', dataToSubmit) //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: "LOGIN_USER",
        payload: request
    }
}

export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit) //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: "REGISTER_USER",
        payload: request
    }
}

export function auth() {

    const request = axios.get('/api/users/auth') //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: "AUTH_USER",
        payload: request
    }
}