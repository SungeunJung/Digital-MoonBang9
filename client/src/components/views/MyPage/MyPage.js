import React, { useEffect } from 'react';
import axios from 'axios';
//import { response } from 'express';
import { useDispatch } from 'react-redux';
import { auth } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

let user = {
    name: "",
    id: "",
    email: "",
}

function MyPage(props) {
    
    const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)
                user.name = response.payload.name
                user.id = response.payload.id
                user.email = response.payload.email
            })
        }, [])
    

    return (
        <div style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: '100vh' }}>
            <h2>MyPage</h2> <br/>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <b>이름</b>    {user.name} <br/>
                <b>아이디</b>  {user.id} <br/>
                <b>이메일</b>  {user.email} <br/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button>찜하기 목록</button><br/>
                <button>방문 기록</button><br/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button>작성한 글</button><br/>
                <button>다운로드 기록</button><br/>
            </div>
        </div>
    )
}

export default withRouter(MyPage)