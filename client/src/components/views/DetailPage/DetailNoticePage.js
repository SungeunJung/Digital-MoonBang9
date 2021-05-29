import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Col, Typography, Row, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
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
                setAdmin(response.data.isAdmin)
            } else {
            console.log('Failed to get Admin')
            }
        })

        const variable = { postId: postId }

        axios.post('/api/notice/getPost', variable)
            .then(response => {
                if (response.data.success) {
                    console.log('<notice 정보>',response.data.post)
                    setPost(response.data.post)
                    window.localStorage.setItem("title_notice", response.data.post.title)
                    window.localStorage.setItem("description_notice", response.data.post.description)
                    window.localStorage.setItem("summary_notice", response.data.post.summary)
                } else {
                    alert('Couldnt get post')
                }
            })
    }, [])

    const confirm = (e) => {
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
        message.error('취소되었습니다');
    }

    if (post.writer) {
        return (
            <div className="notice-page">
                <Row style={{marginBottom:'8%'}}>
                    <Col style={{width:'100%', textAlign:'center'}}>
                        <span className="notice-header">NOTICE</span>
                    </Col>
                </Row>
                <Row>
                    <Col className="title-col"> {post.title} </Col>
                    { (user.userData && !Admin) ?
                    <Col></Col> :
                    <Col className="edit-col">
                        <Link to={`/notice/upload/modify/${postId}`}>
                            <Tooltip title="edit"><div><EditOutlined className="icon-edit" /> </div></Tooltip>
                        </Link>
                    </Col>}
                    { (user.userData && !Admin) ?
                    <Col></Col> :
                    <Col className="delete-col">
                        <Popconfirm
                            title="Are you sure to delete this tip?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><a href="#"><Tooltip placement="bottom" title="delete"><DeleteOutlined className="icon-delete" /></Tooltip></a>
                        </Popconfirm>
                    </Col>}
                </Row>
                <div className="notice-date"> {post.createdAt.split('T')[0]} </div>
                <hr/>
                <br/>
                <div className="detail-content" dangerouslySetInnerHTML={{ __html: post.description }} />

            </div>
        )
    } else {
        return (
            <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>
        )
    }

}

export default DetailNoticePage