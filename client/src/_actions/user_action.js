import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    MODIFY_USER,
    ADD_TO_LIKE,
} from './types';
import { USER_SERVER } from '../components/Config.js';


export function registerUser(dataToSubmit) {

    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit) //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {

    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit) //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: LOGIN_USER,
        payload: request
    }
}

export function auth() {

    const request = axios.get(`${USER_SERVER}/auth`) //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function modifyUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/modifyinfo`,dataToSubmit)
    .then(response => response.data);

    return {
        type: MODIFY_USER,
        payload: request
    }
}
export function addToLike(id) {
    let body = {
         templateId: id
     }
     const request = axios.post(`${USER_SERVER}/addToLike`, body)
         .then(response => response.data);
 
     return {
         type: ADD_TO_LIKE,
         payload: request
     }
 }
