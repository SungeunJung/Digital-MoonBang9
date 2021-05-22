import React, { useState, useEffect } from 'react';
import { Typography, List, Avatar, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './MyPost.css';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TabPane } = Tabs;

function MyPost(props) {
    const [Templates, setTemplates] = useState([])
    const [Tips, setTips] = useState([])
    const [Reviews, setReviews] = useState([])
    const [Image, setImage] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {
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
              if (props.user.userData) {
                let variables = {
                    id: props.user.userData._id
                }
    
                axios.post('/api/template/getMyPost', variables)
                    .then(response => {
                        if(response.data.success) {
                            console.log(response.data.templates)
                            setTemplates(response.data.templates)
                        } else {
                            alert('Failed to fetch template data')
                        }
                    })
                axios.post('/api/tip/getMyPost', variables)
                    .then(response => {
                        if(response.data.success) {
                            setTips(response.data.tips)
                        } else {
                            alert('Failed to fetch template data')
                        }
                    })
                axios.post('/api/review/getMyPost', variables)
                    .then(response => {
                        if(response.data.success) {
                            setReviews(response.data.reviews)
                        } else {
                            alert('Failed to fetch template data')
                        }
                    })   
              }
            } catch (error) {
              if(error.name === 'AbortError') {} 
            }
          }
          fetchData()
          return () => {
          abortController.abort()
          }    
    }, [props.user.userData])

    const PostList = (source, url) => {
        return <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={source}
                    renderItem={item => (
                        <NavLink to = {url+`${item._id}`} className='nav_link'>
                            <div>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} src={process.env.REACT_APP_S3_URL+`userProfile/${Image}`} style={{ alignItems:'center',backgroundColor:'#a5cbf0'}}/>}
                                    title={item.title}
                                    description={<span>{item.description}</span>}
                                />
                                <div><span>{item.createdAt.split('T')[0]}</span></div>
                            </List.Item>
                            </div>
                        </NavLink>
                    )}
                />
    }

    return (
        <div style ={{ width: '65%', margin:'3rem auto', fontFamily: 'kyobo' }}>
            <div style ={{ textAlign: 'center' }}>
                <Title level={1}>마이페이지</Title>
                <Title level={3}>작성한글 목록</Title>
            </div>

            <br/>
            <Tabs defaultActiveKey="1" type='card' size='large'>
                <TabPane tab="속지" key="1">
                    {PostList(Templates, '/template/')}
                </TabPane>
                <TabPane tab="팁" key="2">
                    {PostList(Tips, '/tip/post/')}
                </TabPane>
                <TabPane tab="리뷰" key="3">
                    {PostList(Reviews, '/review/post/')}
                </TabPane>
            </Tabs>
            
        </div>
    )
}

export default MyPost