import React, { useState } from 'react' 
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

var state = {
    createdAuthCode: "",
    authCodeCheck: false
}

function RegisterPage(props) {
    const dispatch = useDispatch()
    const [Email, setEmail] = useState("")
    const [AuthCode, setAuthCode] = useState("")
    const [Name, setName] = useState("")
    const [ID, setID] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onAuthCodeHandler = (event) => {
        setAuthCode(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onIDHandler = (event) => {
        setID(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSendMailHandler = (event) => {
        event.preventDefault();
        
        state.createdAuthCode = Math.random().toString(36).substr(2,6);

        const dataToSubmit = {
            name: Name,
            email: Email,
            auth: state.createdAuthCode
        }
        console.log('authCode = '+state.createdAuthCode)
        axios.post("/api/users/sendEmail", dataToSubmit) // /api/users/sendEmail
        .then(response => {
            alert("인증코드가 발송되었습니다.")
        })
    }
    const onCheckHandler = (event) => {
        event.preventDefault(); //page refresh 막아줌

        console.log(state.createdAuthCode +" == "+AuthCode)

        if(state.createdAuthCode == AuthCode) {
            state.authCodeCheck = true;
            alert("이메일 인증에 성공하셨습니다")
        }
        else {
            state.authCodeCheck = false;
            alert("인증 코드가 일치하지 않습니다.")
        }
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); //page refresh 막아줌
    
        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }

        let body = {
            email: Email,
            name: Name,
            id: ID,
            password: Password
        }

        console.log(body)
        console.log(state.authCodeCheck)
        dispatch(registerUser(body)) //loginUser = action
            .then(response => {
                if(response.payload.success&&state.authCodeCheck) {
                    props.history.push("/login")
                } else {
                    alert("Failed to sign up")
                }
            })
    }

    return (
        <div style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: '100vh' }}>
            <div >
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSendMailHandler}>
                <h2>RegisterPage</h2>
                <br/>
                <label>Email</label>
                <div>
                    <input type="email" value={Email} onChange={onEmailHandler} required/>
                    <button type="submit">
                        send code
                    </button>
                </div>
            </form>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onCheckHandler}
            >
                <label>Authentication Code</label>
                <div>
                    <input type="text" value={AuthCode} onChange={onAuthCodeHandler} required/>
                    <button type="submit">
                        check
                    </button>
                </div>
            </form>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} required/>
                <label>User ID</label>
                <input type="text" value={ID} onChange={onIDHandler} required/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} required/>
                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} required/>
                <br/>
                <button type="submit">
                    Sign Up
                </button>
            </form>
            </div>
        </div>
    )
}

export default withRouter(RegisterPage)
