import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Avatar, Col, Typography, Row, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import './DetailPage.css';
const { Title } = Typography

function DetailTipPage(props) {

    const [post, setPost] = useState([])
    const postId = props.match.params.postId;
    const user = useSelector(state => state.user)

    useEffect(() => {

        const variable = { postId: postId }

        axios.post('/api/tip/getPost', variable)
            .then(response => {
                if (response.data.success) {
                    setPost(response.data.post)
                    window.localStorage.setItem("title_tip", response.data.post.title)
                    window.localStorage.setItem("description_tip", response.data.post.description)
                } else {
                    message.error('게시물을 불러올 수 없습니다.')
                }
            })
    }, [])

    const confirm = (e) => {
        const body = {
            tipID: postId
        }

        axios.post('/api/tip/deleteTip', body)
            .then(response => {
                if (response.data.success) {
                    message.success('삭제되었습니다.')
                    setTimeout(() => {
                        window.location.href="/tip"
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
            <div className="detail-page">
                <Row style={{marginBottom:'25px'}}>
                    <Col>
                        <span className="detail-header">TIP</span>
                    </Col>
                    <Col className="title-col">
                        {post.title}
                    </Col>
                    {console.log(post.title)}
                    {console.log(post.title.length)}
                {(user.userData && post.writer && post.writer._id == user.userData._id) ?
                    <Col className="edit-col">
                        <Link to={`/tip/upload/modify/${postId}`}>
                            <Tooltip title="edit"><div><EditOutlined className="icon-edit"/> </div></Tooltip>
                        </Link>
                    </Col> : <Col></Col>}
                    {(user.userData && post.writer && post.writer._id == user.userData._id) ?
                    <Col className="delete-col">
                        <Popconfirm
                            title="Are you sure to delete this tip?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><a href="#"><Tooltip placement="bottom" title="delete"><DeleteOutlined className="icon-delete"/></Tooltip></a>
                        </Popconfirm>
                    </Col> : <Col></Col>}
                </Row>
                <Row gutter={[16, 16]} style={{marginBottom:'3%'}}>
                    <Col className="writer">
                        <div style={{ display: 'flex' }}>
                            <Avatar
                                src={process.env.REACT_APP_S3_URL+`userProfile/${post.writer.image}`}
                                alt="image"
                            />&nbsp;&nbsp;
                            <div>{post.writer.nickname}</div>
                        </div>
                    </Col>
                   <Col className="date">
                   <div style={{ display: 'flex', justifyContent: 'flex-end', color:'#c9c9c9', fontSize:'16px' }}>
                    {post.createdAt.split('T')[0]}
                </div>
                   </Col>
                </Row>
                <hr />

                <div className="detail-content" dangerouslySetInnerHTML={{ __html: post.description }} />

            </div>
        )
    } else {
        return (
            <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>
        )
    }
}
export default DetailTipPage