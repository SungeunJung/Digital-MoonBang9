import React, { useState } from 'react' 
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import KaKaoLogin from './KaKaoLogin';

const { Title } = Typography;

function LoginPage(props) {
    const dispatch = useDispatch()
    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
    const [rememberMe, setRememberMe] = useState(rememberMeChecked)
    const [formErrorMessage, setFormErrorMessage] = useState('')

    const handleRememberMe = () => {
        setRememberMe(!rememberMe)
    };
    
    const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

    const onFinish = (values) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };
        dispatch(loginUser(dataToSubmit))
            .then(response => {
                if (response.payload.loginSuccess) {
                    window.localStorage.setItem('userId', response.payload.userId);
                    if (rememberMe === true) {
                    window.localStorage.setItem('rememberMe', values.email);
                    } else {
                    localStorage.removeItem('rememberMe');
                    }
                    props.history.push("/");
                } else {
                    setFormErrorMessage('Check out your Account or Password again')
                }
            })
            .catch(err => {
                setFormErrorMessage('Check out your Account or Password again')
                setTimeout(() => {
                    setFormErrorMessage("")
                }, 3000);
            });
    }, 500);
  }

  return (
    <div className="app">
      <Title level={2}>Log In</Title>
      <Form
        name="normal_login"
        className="login-form"
        style={{ minWidth: '325px' }}
        initialValues={{
            email: initialEmail,
            password: '',
        }}
        onFinish={onFinish}
        >
        <Form.Item
            name="email"
            rules={[
            {
                required: true,
                message: 'Please input your E-mail!',
            },
            ]}
        >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
            name="password"
            rules={[
            {
                required: true,
                message: 'Please input your Password!',
            },
            ]}
        >
            <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            />
        </Form.Item>
        <Form.Item>
            <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }}>
            Log in
            </Button>
            <div>
            Or <a href="/register">register now!</a>
            </div>
        </Form.Item>
        </Form>
        <KaKaoLogin />
    </div>
    
  )
}

export default withRouter(LoginPage)