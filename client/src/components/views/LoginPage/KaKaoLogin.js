import React, { Component } from 'react';
import Kakao from 'kakaojs';
import axios from 'axios';

class KaKaoLogin extends Component{

    constructor(props) {
        super(props);
        this.Login = this.Login.bind(this);
    }  
    
    componentDidMount() {
        Kakao.init(process.env.REACT_APP_RESTAPI_KEY)
    }
      
    Login(props){
        Kakao.Auth.login(
            axios.get("/oauth/authorize?response_type=code&client_id=cee4acffb744e5be9c97d5bdb9fa0d5f&redirect_uri=http://localhost:3000/login"
            )
            .then(response => {
                console.log("성공");
            })
        )
        
    }
        
    render(){
        return (
          <div id="kakao-login-btn" >
           <img src={'/kakao_login.png'} onClick={this.Login} style={{ minWidth: '325px'}}></img>
          </div>
        );
      }
    }

export default KaKaoLogin
