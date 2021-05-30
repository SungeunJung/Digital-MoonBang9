import React, { useEffect, useState } from 'react' 
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Avatar, Col, Typography, Row, Button, List, Pagination } from 'antd';
import { useSelector } from "react-redux";
import './NoticePage.css';
const { Title } = Typography
const { Meta } = Card;

function NoticePage(props) {
    const user = useSelector(state => state.user);

    const [Notices, setNotices] = useState([])
    const [Admin, setAdmin] = useState(false)
    const [Count, setCount] = useState(0)
    const [Current, setCurrent] = useState(1)
    const [Limit, setLimit] = useState(10)

    useEffect(() => {
        axios.get('/api/users/getAdmin')
        .then(response=>{
            if (response.data.success) {
                setAdmin(response.data.isAdmin)
            } else {
            console.log('Failed to get Admin')
            }
        })

        axios.get('/api/notice/getNoticesCount') 
        .then(response => {
            if (response.data.success) {
                setCount(response.data.count)
            } else {
                alert('Couldnt get notice`s count')
            }
        })
 
         const variables = {
             skip: 0,
             limit: Limit,
         }
 
         getNotices(variables)

    }, [])

    const getNotices = (variables) => {
        axios.post('/api/notice/getNotices', variables)
        .then(response => {
            if (response.data.success) {
                setNotices(response.data.notices)
            } else {
                alert('Couldnt get notice`s lists')
            }
        })
    }

    const onPageChange = (page) => {
        setCurrent(page)

        let skip = Limit * (page - 1);

        const variables = {
            skip: skip,
            limit: Limit,
        }

        getNotices(variables)
    }

    const PostList = (temp) => {
        return <List
                    className="Notice-list"
                    itemLayout="horizontal"
                    dataSource={temp}
                    renderItem={item => (
                        <NavLink to = {`/notice/post/${item._id}`} className='nav_link'>
                            <div>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar size={40}>운영자</Avatar>} 
                                    title={<div className="Notice-font-title" >{item.title}</div>}
                                    description={<span><div className="Notice-font-title" >{item.summary}</div></span>}
                                />
                                <div><div className="Notice-font-date">{item.createdAt.split('T')[0]}</div></div>
                            </List.Item>
                            </div>
                        </NavLink>
                    )}
                />
    }

    return (
        <div className="noticePage">
            <Row>
                <Col className="Notice-halfCol">
                    <strong><p className="Notice-size">공지사항</p></strong>
                </Col>
                <Col align="right" className="Notice-halfCol">
                { (user.userData && !Admin) ?
                    <span></span> : 
                    <Link to="/notice/upload"> 
                        <Button size='large' type="primary" ghost className="Notice-rightAlign"> 
                            공지글 쓰기 
                        </Button>
                    </Link>
                }
                </Col>
            </Row>
            <hr className="Notice-hr" />
            {Notices.length === 0 ?
                <div className="Notice-noCards">
                <h2>공지글이 없습니다.</h2>
                </div> :
                <div>
                    {PostList(Notices)}
                </div>
            }
            <div className="Notice-pagination">
                <Pagination defaultCurrent={1} defaultPageSize={10} total={Count} 
                current={Current} onChange={onPageChange} />
            </div>
        </div>
    )
}

export default NoticePage