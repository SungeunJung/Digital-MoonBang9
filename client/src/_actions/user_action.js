import axios from 'axios';
import {
    LOGIN_USER
} from './types';


export function loginUser(dataToSubmit) {

    const request = axios.post('/api/users/login', dataToSubmit) //server에 요청
            .then(response => response.data)

    return { //request를 reducer로 넘겨줌
        type: "LOGIN_USER",
        payload: request
    }
}