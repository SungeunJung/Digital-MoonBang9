import {
    LOGIN_USER, 
    REGISTER_USER, 
    AUTH_USER,
    LOGOUT_USER,
    MODIFY_USER,
    ADD_TO_LIKE,
} from '../_actions/types';

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case MODIFY_USER:
            return {...state, userData: action.payload }
        case ADD_TO_LIKE:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    like: action.payload
                }
            }
        default:
            return state;
    }
}