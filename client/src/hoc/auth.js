import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
//import { response } from 'express';

export default function (SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) { //option이 true인 페이지 진입하려고 하면
                        props.history.push('/login') //LoginPage로 보냄
                    }
                } else {
                    //로그인 상태
                    if(adminRoute && !response.payload.isAdmin) { //admin이 아닌 사람이 admin 페이지에 진입하려고 하면
                        props.history.push('/')
                    } else {
                        if(option === false) 
                            props.history.push('/')
                    }
                }
            })
        }, [])
        //axios.get('/api/users/auth')

        return (
            <SpecificComponent />
        )
    }


    return AuthenticationCheck
}