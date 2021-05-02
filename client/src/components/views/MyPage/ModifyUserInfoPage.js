import React, {useState} from 'react';
import { Typography, Avatar, Form, Input, Button, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { modifyUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';


const { Title } = Typography;

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

function ModifyUserInfoPage(props) {

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onCancel = (events) => {
        props.history.push("/mypage");
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        setTimeout(() => {

            let dataToSubmit = {              
              password: values.password,              
              nickname: values.nickname
            };
  
            dispatch(modifyUser(dataToSubmit)).then(response => {
              if (response.payload.success) {
                alert("수정을 완료했습니다.");
                props.history.push("/mypage");
              } else {
                alert(response.payload.err.errmsg)
              }
            })
  
          }, 500);
    };

    return (
        <div className="app" style={{ width: '80%', padding: '3rem 4rem', margin:'auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>회원정보 수정</Title>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Avatar icon={<UserOutlined />} size={160} style={{backgroundColor:'#a5cbf0'}}/>                
            </div>
            props.user.userData.email
            <br />
           
            <br />

            <Form
                style={{ minWidth: '375px', maxWidth: '475px' }}
                {...formItemLayout}
                form={form}
                name="modifyinfo"
                onFinish={onFinish}
                initialValues={{ //여기에 원래 user데이터 넣어야할듯
                    nickname: '',
                    password: '',
                    confirm: ''
                }}
                scrollToFirstError
            >

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
                    placeholder='props.user.userData.nickname'
                    type="text"
                />
            </Form.Item>

            <Form.Item
                name="password"
                label="New Password"
                rules={[
                {
                    required: true,
                    message: 'Please input your new password!',
                },
                ]}
                hasFeedback
            >
                <Input.Password 
                    placeholder="Enter your new password"
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
                    확인 
                </Button>
                
                <Button type="default" onClick={onCancel}>
                    취소
                </Button>
            </Form.Item>
        </Form>
    </div>
    )}



export default withRouter(ModifyUserInfoPage)
