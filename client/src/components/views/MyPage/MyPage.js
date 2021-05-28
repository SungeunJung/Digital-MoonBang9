import React, { useState, useEffect } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Typography, Button, Row, Col, Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import './MyPage.css';

const { Title } = Typography;

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
        <div className='myPage'>
            <Title>
                <div className="Mypage-pageheader">
                    마이페이지
                </div> 
            </Title>                  
           
                <Row className="Mypage-content">     
                    <Col lg={8} md={16} xs={24} > 
                        <Avatar icon={<UserOutlined />} size={250}
                                src={process.env.REACT_APP_S3_URL+`userProfile/${Image}`} 
                                className="Mypage-avatar"
                                />
                        <Button type="default" block className="Mypage-modify">
                            <Link to="/mypage/modifyinfo/" >회원정보 수정</Link>
                        </Button>
                    </Col> 
                    <Col lg={8} md={16} xs={24} >
                        <Button type="default" block className="Mypage-button">
                            <Link to="/user/like" className="Mypage-link">찜하기 목록</Link>
                        </Button>
                        <Button type="default" block className="Mypage-button">
                            <Link to="/mypage/history" className="Mypage-link">방문 기록</Link>
                        </Button>
                    </Col>
                    <Col lg={8} md={16} xs={24}>
                        <Button type="default" block className="Mypage-button">
                            <Link to="/mypage/mypost" className="Mypage-link">작성한 글</Link>
                        </Button>
                        <Button type="default" block className="Mypage-button">
                            <Link to="/mypage/download" className="Mypage-link">다운로드 기록</Link>
                        </Button>
                    </Col>
                </Row> 
              
        </div>
    )
}

export default MyPage