import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
//import { response } from 'express';

export default function (SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {
        let user = useSelector(state => state.user);
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
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
            <SpecificComponent {...props} user={user}/>
        )
    }


    return AuthenticationCheck
}