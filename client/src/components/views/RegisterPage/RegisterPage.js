import React, { useState } from 'react' 
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Row, Col, Typography, message } from 'antd';
import './RegisterPage.css';

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
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onSendMailHandler = (values) => {
        state.createdAuthCode = Math.random().toString(36).substr(2,6);

        if(!form.getFieldValue('email')) 
            return message.warning('이메일을 입력해주세요.')
        let dataToSubmit = {
            email: form.getFieldValue('email'),
            auth: state.createdAuthCode
        }
        //console.log('authCode = '+state.createdAuthCode)
        axios.post("/api/users/sendEmail", dataToSubmit) // /api/users/sendEmail
        .then(response => {
            message.success('인증코드가 발송되었습니다.')
        })
    }

    const onFinish = (values) => {
        //console.log('Received values of form: ', values);
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
                message.error(response.payload.err.errmsg)
              }
            })
  
          }, 500);
    };


    return (    
        <div className="register-page"> 
        <div>
            <div className="register-header">회원가입</div>
            <br/>
            <Form
                className = 'register-form'
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
                    className="register-form-item"
                    name="email"
                    label="이메일"
                    rules={[
                    {
                        type: 'email',
                        message: '유효하지 않은 이메일입니다.',
                    },
                    {
                        required: true,
                        message: '이메일이 입력되지 않았습니다.',
                    },
                    ]}
                >
                    <Input 
                        placeholder="이메일을 입력해주세요."
                    />
                </Form.Item>

                <Form.Item required label="인증코드" style={{ marginBottom:"0px" }}>
                    <Row gutter={12}>
                        <Col span={14}>
                            <Form.Item
                                name="authCode"
                                dependencies={[state.createdAuthCode]}
                                style = {{ minwidth : "150px" }}
                                tooltip="이메일로 인증코드가 전송됩니다."
                                rules={[
                                    {
                                        required: true,
                                        message: '인증코드를 입력해주세요.',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                        if (!value || state.createdAuthCode === value) {
                                            return Promise.resolve();
                                        }
                
                                        return Promise.reject(new Error('인증코드가 일치하지 않습니다!'));
                                        },
                                    }),
                                    ]}
                            >
                                <Input 
                                    placeholder="인증코드"
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button onClick={onSendMailHandler}>코드 전송</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item 
                    name="name"
                    label="이름"
                    rules={[
                        {
                            required: true,
                            message: '이름이 입력되지 않았습니다.',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="이름을 입력해주세요."
                        type="text"
                    />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label="닉네임"
                    rules={[
                    {
                        required: true,
                        message: '닉네임이 입력되지 않았습니다.',
                        whitespace: true,
                    },
                    ]}
                >
                    <Input 
                        placeholder="닉네임을 입력해주세요."
                        type="text"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="비밀번호"
                    rules={[
                    {
                        required: true,
                        message: '비밀번호가 입력되지 않았습니다.',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password 
                        placeholder="비밀번호를 입력해주세요."
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="비밀번호 확인"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: '비밀번호를 확인해주세요.',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                        },
                    }),
                    ]}
                >
                    <Input.Password 
                        placeholder="비밀번호를 한 번 더 입력해주세요."
                    />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" className="register-submit">
                    확인
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </div>
      );
}

export default withRouter(RegisterPage)
