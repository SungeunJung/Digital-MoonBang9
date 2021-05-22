import React, {useState,useEffect} from 'react';
import { Typography, Col, Row, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { modifyUser } from '../../../_actions/user_action';
import UserImageEdit from '../../utils/UserImageEdit';
import axios from 'axios';

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
    const [Image, setImage] = useState("");
    const user = useSelector((state)=> state.user); 
    const [Email, setEmail] = useState([]);

    useEffect(()=> { let abortController = new AbortController()
        const fetchData = async () => {
          try{
            const response = await fetch(
              'https://jsonplaceholder.typicode.com/todos/1',
              {
                signal: abortController.signal,
              },
            )            
            setEmail(user.userData.email) 
          } catch (error) {
            if(error.name === 'AbortError') {
            }
          }
        }
        fetchData()
        return () => {
         abortController.abort()
        }     
        }
    )

    const onCancel = (events) => {
        props.history.push("/mypage");
    }

    const onDuplicateCheckHandler = (values) => {
        if(!form.getFieldValue('nickname')) return alert("닉네임을 입력해주세요.")
        
        let dataToSubmit = {
            nickname: form.getFieldValue('nickname')
        }
        
        axios.post("/api/users/duplicateCheck", dataToSubmit) 
        .then(response => {
            console.log(response.data.success)
            if(response.data.success) {
                alert('사용 가능한 닉네임입니다');
            } else {                
                alert('이미 사용중인 닉네임입니다')
                form.resetFields();
            }
        })
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        
        setTimeout(() => {
            let dataToSubmit = {                
                password: values.password,                
                nickname: values.nickname,
                image: Image,           
            };
            //DB 저장용
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
    
    const updateImage = (newImage) =>{
        console.log(newImage)
        setImage(newImage)
    }
    
    return (
        <div className="app" style={{ width: '80%', padding: '3rem 4rem', margin:'auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>회원정보 수정</Title>
            </div>
            
            <UserImageEdit refreshFunction={updateImage}/>                           
                               
            <br />
            <p style={{fontSize:'15pt'}}>{Email}</p>
            <br />           
            

            <Form
                style={{ minWidth: '375px', maxWidth: '475px' }}
                {...formItemLayout}
                form={form}
                name="modifyinfo"
                onFinish={onFinish}
                initialValues={{ //여기에 원래 user데이터 넣어야할듯
                    nickname: "",
                    password: "",
                    confirm: ""
                }}
                scrollToFirstError
            >

            <Form.Item required label="별명" style={{ marginBottom:"0px" }}>
                    <Row gutter={12}>
                        <Col span={14}>
                            <Form.Item
                                name="nickname"
                                tooltip="What do you want others to call you?"
                                style = {{ minwidth : "150px" }}
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input your nickname!',
                                        whitespace: true,
                                    }
                                ]}
                            >
                                <Input 
                                    placeholder='Nickname'
                                    type="text"
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button onClick={onDuplicateCheckHandler}>중복 확인</Button>
                        </Col>
                    </Row>
                </Form.Item>
            
            <Form.Item
                name="password"
                label="새 비밀번호"
                rules={[
                {
                    required: false,
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
                label="비밀번호 확인"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    required: false,
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
                <Button type="primary" htmlType="submit" style={{marginRight:'10px'}}>
                    확인 
                </Button>
                
                <Button onClick={onCancel}>
                    취소
                </Button>
            </Form.Item>
        </Form>
    </div>
)}



export default ModifyUserInfoPage
