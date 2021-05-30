import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Col, Row, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

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
                    setPost(response.data.post)
                    window.localStorage.setItem("title_notice", response.data.post.title)
                    window.localStorage.setItem("description_notice", response.data.post.description)
                    window.localStorage.setItem("summary_notice", response.data.post.summary)
                } else {
                    message.error('게시물을 불러올 수 없습니다.')
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
                    message.success('삭제되었습니다.')
                    setTimeout(() => {
                        window.location.href="/notice"
                    }, 150);
                } else {
                    message.error('삭제에 실패했습니다.')
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
                <Row gutter={16} style={{marginTop: '16px', marginBottom:'5px'}}>
                    <Col className="summary-col"> 
                        <div style={{ display: 'flex' }}>{post.summary} </div>
                    </Col>
                    <Col className="notice-date"> 
                        <div style={{ display: 'flex', justifyContent: 'flex-end', color:'#c9c9c9'}}>{post.createdAt.split('T')[0]}</div> 
                    </Col>
                </Row>
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