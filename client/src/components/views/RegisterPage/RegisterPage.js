import React, { useState } from 'react' 
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Row, Col, Typography } from 'antd';

const { Title } = Typography;

var state = {
    createdAuthCode: "",
    authCodeCheck: false
}

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

function RegisterPage(props) {
    const dispatch = useDispatch()
    const [Email, setEmail] = useState("")
    const [AuthCode, setAuthCode] = useState("")
    const [Name, setName] = useState("")
    const [Nickname, setNickname] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")


    const onSendMailHandler = (event) => {
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

    //ant design
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        setTimeout(() => {

            let dataToSubmit = {
              email: values.email,
              password: values.password,
              name: values.name,
              nickname: values.nickname
            };
  
            dispatch(registerUser(dataToSubmit)).then(response => {
              if (response.payload.success) {
                props.history.push("/login");
              } else {
                alert(response.payload.err.errmsg)
              }
            })
  
          }, 500);
    };


    return (    
        <div className="app">
            <Title level={2}>Sign up</Title>
            <br/>
            <Form
                style={{ minWidth: '375px', maxWidth: '475px' }}
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    email: '',
                    name: '',
                    nickname: '',
                    authCode: '',
                    password: '',
                    confirm: ''
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    ]}
                >
                    <Input 
                        placeholder="Enter your E-mail"
                    />
                </Form.Item>

                <Form.Item required label="Auth Code">
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                name="authCode"
                                dependencies={[state.createdAuthCode]}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Auth Code!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                        if (!value || state.createdAuthCode === value) {
                                            return Promise.resolve();
                                        }
                
                                        return Promise.reject(new Error('Auth code is not correct!'));
                                        },
                                    }),
                                    ]}
                            >
                                <Input 
                                    placeholder="Auth Code"
                                />
                            </Form.Item>
                        </Col>
                        <Col span ={12}>
                            <Button onClick={onSendMailHandler}>Send Code</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item 
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="Enter your name"
                        type="text"
                    />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label="Nickname"
                    tooltip="What do you want others to call you?"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your nickname!',
                        whitespace: true,
                    },
                    ]}
                >
                    <Input 
                        placeholder="Enter your nickname"
                        type="text"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password 
                        placeholder="Enter your password"
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password 
                        placeholder="Confirm your password"
                    />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                    Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
      );
}

export default withRouter(RegisterPage)
