import React from 'react';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { useSelector } from "react-redux";
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import './Buttons.css';

function Buttons(props) {
    const user = useSelector(state => state.user)

    const logoutHandler = (props) => {
        axios.get(`${USER_SERVER}/logout`).then(response => {
            if (response.status === 200) {
                props.state.history.push("/login");
            } else {
                alert('Log Out Failed')
            }
        });
    };

    const alertHandler = () => {
        alert('로그인 부터 하세요')
    }

    if (user.userData && !user.userData.isAuth) {
        return (
            <div mode={props.state.mode} className="btn_container">
                <Button className="uploadbtn">           
                    <a href="/login" onClick={alertHandler}>등록하기</a>
                </Button>
                <Button type="primary" className="logbtn">           
                    <a href="/login">로그인</a>
                </Button>
            </div>
        )
      } else {
        return (
            <div mode={props.state.mode} className="btn_container">
                <Button className="uploadbtn">           
                    <a href="/template/upload">등록하기</a>
                </Button>
                <Button type="primary" className="logbtn">           
                    <a href="/login" onClick={logoutHandler}>로그아웃</a>
                </Button>  
            </div>        
        )
      }
    
}

export default withRouter(Buttons)
