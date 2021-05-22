import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Card, Icon, Avatar, Col, Typography, Row, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
const { Title } = Typography

function DetailNoticePage(props) {

    const [Admin, setAdmin] = useState(false)
    const [post, setPost] = useState([])
    const postId = props.match.params.postId;
    const user = useSelector(state => state.user)

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

        const variable = { postId: postId }

        axios.post('/api/notice/getPost', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.post)
                    setPost(response.data.post)
                } else {
                    alert('Couldnt get post')
                }
            })
    }, [])

    const confirm = (e) => {
        console.log(e);
        
        const body = {
            noticeID: postId
        }

        axios.post('/api/notice/deleteNotice', body)
            .then(response => {
                if (response.data.success) {
                    message.success('공지사항이 삭제되었습니다.')
                    setTimeout(() => {
                        window.location.href="/notice"
                    }, 150);
                } else {
                    alert('Failed to delete Notice')
                }
            })
      }

    const cancel = (e) => {
        console.log(e);
        message.error('취소되었습니다');
    }

    if (post.writer) {
        return (
            <div className="postPage" style={{ width: '60%', margin: '7rem auto' }}>
                <Row>
                    <Col style={{width: '90%'}}>
                        <Title level={2}>{post.title}</Title>
                        </Col>
                    { (user.userData && !Admin) ?
                    <Col></Col> :
                    <Col style={{width: '5%'}}>
                        <Tooltip title="edit"><div><EditOutlined /> </div></Tooltip>
                    </Col>}
                    { (user.userData && !Admin) ?
                    <Col></Col> :
                    <Col style={{width: '5%'}}>
                        <Popconfirm
                            title="Are you sure to delete this tip?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><a href="#"><DeleteOutlined /></a>
                        </Popconfirm>
                    </Col>}
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Title level={4}>{post.createdAt.split('T')[0]}</Title>
                </div>
                <br/>
                <div dangerouslySetInnerHTML={{ __html: post.description }} />

            </div>
        )
    } else {
        return (
            <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>
        )
    }

}

export default DetailNoticePage