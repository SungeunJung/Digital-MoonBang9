/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userImage');
        if(localStorage.getItem('newImage'))
          localStorage.removeItem('newImage')
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  //console.log(user.userData)

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login">
          <a href="/login">로그인</a>
        </Menu.Item>
        <Menu.Item key="register">
          <a href="/register">회원가입</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href={"/template/upload"}>등록하기</a>
        </Menu.Item>
        <Menu.Item key="mypage">
          <a href={"/mypage"}>마이페이지</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>로그아웃</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

