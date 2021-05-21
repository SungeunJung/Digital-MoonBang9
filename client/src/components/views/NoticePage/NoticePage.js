import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Avatar, Col, Typography, Row, Button, Table, List, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
const { Title } = Typography
const { Meta } = Card;

function NoticePage(props) {

    const user = useSelector(state => state.user);
    const [Notices, setNotices] = useState([])
    const [Admin, setAdmin] = useState(false)
    const data = [];

    useEffect(() => {
        axios.get('/api/users/getAdmin')
            .then(response=>{
                if (response.data.success) {
                    console.log(response.data.isAdmin)
                    setAdmin(response.data.isAdmin)
                } else {
                   console.log('Failed to get Admin')
                }
             })

        axios.get('/api/notice/getNotices')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.notices)
                    setNotices(response.data.notices)
                } else {
                    alert('Couldnt get notice`s lists')
                }
            })

    }, [])

    const PostList = (temp) => {
        return <List
                    style={{ maxWidth: '700px', margin: '2rem auto'}}
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={temp}
                    renderItem={item => (
                        <NavLink to = {`/notice/post/${item._id}`} className='nav_link'>
                            <div>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar size={40}>운영자</Avatar>} 
                                    title={item.title}
                                    description={<span>{item.summary}</span>}
                                />
                                <div><span>{item.createdAt.split('T')[0]}</span></div>
                            </List.Item>
                            </div>
                        </NavLink>
                    )}
                />
    }

    return (
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>
            <Row>{/*style={{ display:'flex', justifyContent:'flex-end', margin:'1rem auto 1rem 0' }}*/}
                <Col style={{width : '450px'}}>
                    <strong><p style={{color : 'black', fontSize: "28px"}}> Notice </p></strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                { (user.userData && !Admin) ?
                    <span></span> : 
                    <Link to="/notice/upload"> 
                        <Button size='large' type="primary" ghost style={{ align: 'right' }}> 공지글 쓰기 </Button>
                    </Link>
                }
                </Col>
            </Row>
            <hr />
            {Notices.length === 0 ?
                <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                <h2>No post yet...</h2>
                </div> :
                <div>
                    {PostList(Notices)}
                </div>
            }
        </div>
    )
}

export default NoticePage