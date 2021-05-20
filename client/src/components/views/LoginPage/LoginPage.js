import React, { useState } from 'react' 
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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
    <div className="app" style={{marginBottom:"200px"}}>
      <Title level={2}>로그인</Title>
      <Form
        name="normal_login"
        className="login-form"
        style={{ minWidth: '325px', marginTop: '30px' }}
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
            <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>이메일 저장</Checkbox>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }}>
            Log in
            </Button>
            <div>
            <Link to="/register">회원가입 </Link>하러가기
            </div>
        </Form.Item>
        </Form>
    </div>
    
  )
}

export default withRouter(LoginPage)