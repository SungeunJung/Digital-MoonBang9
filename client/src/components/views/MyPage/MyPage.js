import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import { Typography, Button, Row, Col, Form, Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Title } = Typography;


function MyPage(props) {
    
    

    return (
        <div style={{ width: '80%', padding: '3rem 4rem', margin:'auto' }}>
            <div style={{ textAlign:'center', marginBottom:'4rem' }}>
                <Title level={2}>마이페이지</Title>
            </div>         
            

            <Row gutter={[40,16]}>     
                <Col span={8}> 
                    <Avatar icon={<UserOutlined />} size={200} style={{backgroundColor:'#a5cbf0'}}/>
                    <Button >
                        <a href="/mypage/modifyinfo">회원정보 수정</a>
                    </Button>
                </Col> 
                <Col lg={8} xs={24} >
                    <Button type="primary" block style={{height:'110px'}}>
                        찜하기 목록
                    </Button>
                </Col>
                <Col lg={8} xs={24}>
                    <Button type="primary" block style={{height:'110px'}} >
                        작성한 글
                    </Button>
                </Col>
                
                <Col lg={8} xs={24} offset={8}>
                    <Button type="primary" block style={{height:'110px'}}>
                        방문 기록
                    </Button>
                </Col>
                <Col lg={8}  xs={24} >
                    <Button type="primary" block style={{height:'110px'}}>
                        다운로드 기록
                    </Button>
                </Col>
            </Row>
            
            
        </div>
    )
}

export default withRouter(MyPage)