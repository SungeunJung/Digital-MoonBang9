import React, {useState,useEffect} from 'react';
import { Typography, Col, Row, Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { modifyUser } from '../../../_actions/user_action';
import UserImageEdit from '../../utils/UserImageEdit';
import axios from 'axios';
import './ModifyUserInfoPage.css';

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
        if(!form.getFieldValue('nickname')) 
            return message.warning('닉네임을 입력해주세요.')
        let dataToSubmit = {
            nickname: form.getFieldValue('nickname')
        }
        
        axios.post("/api/users/duplicateCheck", dataToSubmit) 
        .then(response => {
            if(response.data.success) {
                message.success('사용 가능한 닉네임입니다.')
            } else {         
                message.warning('')       
                form.resetFields();
            }
        })
    }

    const onFinish = (values) => {
        setTimeout(() => {
            let dataToSubmit = {                
                password: values.password,                
                nickname: values.nickname,
                image: Image,           
            };
            //DB 저장용
            dispatch(modifyUser(dataToSubmit)).then(response => {
              if (response.payload.success) {
                message.success('수정을 완료했습니다.')
                props.history.push("/mypage");
              } else {
                  message.error(response.payload.err.errmsg)
              }
            })
          }, 500);
    };
    
    const updateImage = (newImage) =>{
        setImage(newImage)
    }
    
    return (
        <div className="appMod" style={{ fontFamily: "cookie-regular"}}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
                <Title level={2}>회원정보 수정</Title>
            </div>
            
            <UserImageEdit refreshFunction={updateImage}/>                           
                               
            <br />
            <p style={{fontSize:'15pt'}}>{Email}</p>
            <br />           
            

            <Form
                className="modForm"
                style={{ minWidth: '320px'}}
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

            <Form.Item required label="닉네임" style={{ marginBottom:"0px" }}>
                    <Row gutter={12}>
                        <Col span={14}>
                            <Form.Item
                                name="nickname"
                                style = {{ minwidth : "150px" }}
                                rules={[
                                    {
                                        required: false,
                                        message: '닉네임이 입력되지 않았습니다.',
                                        whitespace: true,
                                    }
                                ]}
                            >
                                <Input 
                                    placeholder='입력해주세요.'
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
                    required: false,
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
                    placeholder="한 번 더 입력해주세요."
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
