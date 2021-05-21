import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Button, Row, Col, Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title } = Typography

function MyPage(props) { 
    const [Image, setImage] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(()=> { 
        let abortController = new AbortController()
        const fetchData = async () => {
          try{
              const response = await fetch(
                'https://jsonplaceholder.typicode.com/todos/1',
                {
                  signal: abortController.signal,
                },
              )        
              setImage(user.userData.image)      
            } catch (error) {
              if(error.name === 'AbortError') {} 
            }
          }
          fetchData()
          return () => {
          abortController.abort()
          }     
        }
      )
   
    return (
        <div style={{ width: '80%', padding: '3rem 4rem', margin:'auto' }}>
            <div style={{ textAlign:'center', marginBottom:'4rem' }}>
                <Title level={2}>마이페이지</Title>
            </div>                   
            
            <Row gutter={40}>     
                <Col lg={8} md={16} xs={24} > 
                    <Avatar icon={<UserOutlined />} src={process.env.REACT_APP_S3_URL+`userProfile/${Image}`} size={250} style={{ width:'95%', height:'85%', alignItems:'center',backgroundColor:'#a5cbf0'}}/>
                    <Button type="default" block style={{height:'40px',backgroundColor:'#8e8f92', marginTop:'20px', borderRadius:'10px', fontSize:'20px'}}>
                        <Link to="/mypage/modifyinfo/">회원정보 수정</Link>
                    </Button>
                </Col> 
                <Col lg={8} md={16} xs={24} >
                    <Button type="default" block style={{height:'110px', marginTop:'20px', borderRadius:'10px' }}>
                        <Link to="/user/like" style={{fontSize:'25px'}}>찜하기 목록</Link>
                    </Button>
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px', fontSize:'25px' }}>
                        <Link to="/">방문 기록</Link>
                    </Button>
                </Col>
                <Col lg={8} md={16} xs={24}>
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px', fontSize:'25px'}} >
                        <Link to="/mypage/mypost">작성한 글</Link>
                    </Button>
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px', fontSize:'25px'}}>
                        <Link to="/">다운로드 기록</Link>
                    </Button>
                    <Button type="default" block style={{float: 'right', color: 'white', width:'230px',height:'50px',backgroundColor:'#8e8f92', marginTop:'40px',borderRadius:'10px', fontSize:'20px'}}>
                        1:1 문의하기
                    </Button>
                </Col>
            </Row>   
        </div>
    )
}

export default MyPage