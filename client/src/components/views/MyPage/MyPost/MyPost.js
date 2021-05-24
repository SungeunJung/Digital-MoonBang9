import React, { useState, useEffect } from 'react';
import { Typography, List, Avatar, Tabs, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './MyPost.css';

const { Title } = Typography;
const { TabPane } = Tabs;

function MyPost(props) {
    const str = (localStorage.getItem("userImage"))   
    const [Templates, setTemplates] = useState([])
    const [Tips, setTips] = useState([])
    const [Reviews, setReviews] = useState([])
    const [Current, setCurrent] = useState(1)
    const [Count, setCount] = useState(0)
    const [CountArr, setCountArr] = useState([0,0,0])
    const [Limit, setLimit] = useState(3)
    let countArr = [0,0,0];

    useEffect(() => {
        if (props.user.userData) {
            const body = {
                id: props.user.userData._id,
            }
            
            axios.post('/api/template/getMyPostCount', body)
                .then(response => {
                    if(response.data.success) {
                        countArr[0] = response.data.count;
                        setCountArr(countArr)
                        setCount(countArr[0])
                    } else {
                        alert('Failed to fetch template data')
                    }
                })
            axios.post('/api/tip/getMyPostCount', body)
                .then(response => {
                    if(response.data.success) {
                        countArr[1] = response.data.count;
                        setCountArr(countArr)
                    } else {
                        alert('Failed to fetch template data')
                    }
                })
            axios.post('/api/review/getMyPostCount', body)
                .then(response => {
                    if(response.data.success) {
                        countArr[2] = response.data.count;
                        setCountArr(countArr)
                    } else {
                        alert('Failed to fetch template data')
                    }
                })

            const variables = {
                id: props.user.userData._id,
                skip: 0,
                limit: Limit,
            }
            getPosts(variables)
        }

    }, [props.user.userData])

    const onPageChange = (page) => {
        console.log('page:', page)
        setCurrent(page)

        let skip = Limit * (page - 1);

        const variables = {
            id: props.user.userData._id,
            skip: skip,
            limit: Limit,
        }

        getPosts(variables)
    }

    const getPosts = (variables) => {
        axios.post('/api/template/getMyPost', variables)
                .then(response => {
                    if(response.data.success) {
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

    const PostList = (source, url) => {
            source.forEach(element => {
                let startIdx = -1, endIdx = -1;
                if(!url.includes("template")) {
                    startIdx = element.description.indexOf('<img');
                    if(startIdx != -1) {
                        endIdx = element.description.indexOf('>', startIdx);
                        let arr = element.description.split('');
                        arr.splice(startIdx, (endIdx-startIdx+1));
                        element.description = arr.join('');
                    }
                    startIdx = element.description.indexOf('<p>');
                    if(startIdx != -1) {
                        if(element.description.indexOf('<br>')== -1) {
                            endIdx = element.description.indexOf('/p>', startIdx);
                            let arr = element.description.split('');
                            arr = arr.splice(startIdx, (endIdx-startIdx+3));
                            element.description = arr.splice(startIdx+3, (endIdx-startIdx-4)).join('');
                        }
                    }
                    startIdx = element.description.indexOf('<p><br>');
                    if(startIdx != -1) {
                        endIdx = element.description.indexOf('/p>', startIdx);
                        let arr = element.description.split('');
                        arr.splice(startIdx, (endIdx-startIdx+3));
                        element.description = arr.join('');
                    }
                }

                if(element.description.length>30) {
                    element.description = element.description.slice(0, 30)+" ...";
                }
            });
        

        return <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={source}
                    renderItem={item => (
                        <NavLink to = {url+`${item._id}`} className='nav_link'>
                            <div>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} src={''.concat("\\uploads\\profile\\", str)} style={{ alignItems:'center',backgroundColor:'#a5cbf0'}}/>}
                                    title={item.title}
                                    description={<div dangerouslySetInnerHTML={{ __html: item.description }} />}
                                />
                                <div><span>{item.createdAt.split('T')[0]}</span></div>
                            </List.Item>
                            </div>
                        </NavLink>
                    )}
                />
    }

    const tabChange = (key) => {
        const variables = {
            id: props.user.userData._id,
            skip: 0,
            limit: Limit,
        }
        getPosts(variables);
        setCount(CountArr[key-1]);
        setCurrent(1);
    }

    return (
        <div style ={{ width: '65%', margin:'3rem auto', fontFamily: 'kyobo' }}>
            <div style ={{ textAlign: 'center' }}>
                <Title level={1}>마이페이지</Title>
                <Title level={3}>작성한글 목록</Title>
            </div>

            <br/>
            <Tabs defaultActiveKey="1" type='card' size='large' onChange={tabChange}>
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
            <div style ={{ display: 'flex', justifyContent: 'center' }}>
                {console.log(Count)}
                <Pagination defaultCurrent={1} defaultPageSize={3} total={Count} 
                current={Current} onChange={onPageChange} />
            </div>
        </div>
    )
}

export default MyPost
