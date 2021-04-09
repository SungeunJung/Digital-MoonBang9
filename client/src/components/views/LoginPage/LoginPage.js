import axios from 'axios'
import React, { useState } from 'react' 
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch()
    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
    const [rememberMe, setRememberMe] = useState(rememberMeChecked)

    const handleRememberMe = () => {
        setRememberMe(!rememberMe)
      };
    
      const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

    const [Email, setEmail] = useState(initialEmail)
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); //page refresh 막아줌
    
        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body)) //loginUser = action
            .then(response => {
                if(response.payload.loginSuccess) {
                    if (rememberMe === true) {
                        window.localStorage.setItem('rememberMe', body.email);
                      } else {
                        localStorage.removeItem('rememberMe');
                      }
                    props.history.push('/') //LandingPage로 이동
                } else {
                    alert('Error')
                }
            })
    }

    return (
        <div style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <h2>LoginPage</h2>
                 <br/>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br/>
                <label>이메일 저장하기 <input id="rememberMe" type="checkbox" onChange={handleRememberMe} checked={rememberMe} /></label>
                <br/>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)