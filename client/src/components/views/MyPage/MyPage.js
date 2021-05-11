import React, {useState} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Button, Row, Col, Form, Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;


function MyPage(props) {
   
    
    return (
        <div style={{ width: '80%', padding: '3rem 4rem', margin:'auto' }}>
            <div style={{ textAlign:'center', marginBottom:'4rem' }}>
                <Title level={2}>마이페이지</Title>
            </div>         
            

            <Row gutter={[40]}>     
                <Col lg={8} xs={24} > 
                    <Avatar icon={<UserOutlined />} size={250} style={{marginLeft:'45px',backgroundColor:'#a5cbf0'}}/>
                    <Button type="default" block style={{height:'40px',backgroundColor:'#8e8f92', marginTop:'20px', borderRadius:'10px',fontSize:'20px'}}>
                        <Link to="/mypage/modifyinfo/">회원정보 수정</Link>
                    </Button>
                </Col> 
                <Col lg={8} xs={24} >
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px' }}>
                        <Link to="/user/like" style={{fontSize:'25px'}}>찜하기 목록</Link>
                    </Button>
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px', fontSize:'25px' }}>
                        방문 기록
                    </Button>
                </Col>
                <Col lg={8} xs={24}>
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px', fontSize:'25px'}} >
                        작성한 글
                    </Button>
                    <Button type="default" block style={{height:'110px', marginTop:'20px',borderRadius:'10px', fontSize:'25px'}}>
                        다운로드 기록
                    </Button>
                    <Button type="default" block style={{height:'40px',backgroundColor:'#8e8f92', marginTop:'40px',borderRadius:'10px', fontSize:'20px'}}>
                        1:1 문의하기
                    </Button>
                </Col>
                
                
            </Row>
            
            
        </div>
    )
}

export default withRouter(MyPage)