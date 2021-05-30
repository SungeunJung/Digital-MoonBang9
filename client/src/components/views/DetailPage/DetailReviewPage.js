import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Avatar, Col, Typography, Rate, Row, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
const { Title } = Typography

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function DetailReviewPage(props) {

    const [post, setPost] = useState([])
    const postId = props.match.params.postId;
    const user = useSelector(state => state.user)

    useEffect(() => {

        const variable = { postId: postId }

        axios.post('/api/review/getPost', variable)
            .then(response => {
                if (response.data.success) {
                    setPost(response.data.post)
                    window.localStorage.setItem("title_review", response.data.post.title)
                    window.localStorage.setItem("template_review", response.data.post.template)
                    window.localStorage.setItem("description_review", response.data.post.description)
                    window.localStorage.setItem("rate_review", response.data.post.rate)
                } else {
                    alert('Couldnt get post')
                }
            })
    }, [])

    const confirm = (e) => {
        const body = {
            reviewID: postId
        }

        axios.post('/api/review/deleteReview', body)
            .then(response => {
                if (response.data.success) {
                    message.success('리뷰 게시물이 삭제되었습니다.')
                    setTimeout(() => {
                        window.location.href="/review"
                    }, 150);
                } else {
                    alert('Failed to delete Review')
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
                        <span className="detail-header">REVIEW</span>
                    </Col>
                    <Col className="title-col">
                        {post.title}
                    </Col>
                    {(user.userData && post.writer && post.writer._id == user.userData._id) ?
                    <Col className="edit-col">
                        <Link to={`/review/upload/modify/${postId}`}>
                            <Tooltip title="edit"><div><EditOutlined className="icon-edit" /> </div></Tooltip>
                        </Link>
                    </Col> : <Col></Col>}
                    {(user.userData && post.writer && post.writer._id == user.userData._id) ?
                    <Col className="delete-col">
                        <Popconfirm
                            title="Are you sure to delete this reviews?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><a href="#"><Tooltip placement="bottom" title="delete"><DeleteOutlined className="icon-delete" /></Tooltip></a>
                        </Popconfirm>
                    </Col> : <Col></Col>}
                </Row>
                <Row gutter={[16, 16]} style={{marginBottom:'3%'}}>
                    <Col className="writer">
                        <div style={{ display: 'flex'}}>
                            <Avatar
                                src={process.env.REACT_APP_S3_URL+`userProfile/${post.writer.image}`}
                                alt="image"
                            />&nbsp;&nbsp;
                            <Title level={5}>{post.writer.nickname}</Title>
                        </div>
                    </Col>
                    <Col className="date">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', color:'#c9c9c9', fontSize:'16px' }}>
                            {post.createdAt.split('T')[0]}
                        </div>
                   </Col>
                </Row>

                <div>
                    <Rate tooltips={desc} value={post.rate} style={{fontSize:35}} />
                    {post.rate ? <span className="ant-rate-text" style={{ color: "#DAA520" }}></span> : ''}
                </div>
                <br/>
                <div style = {{fontSize : '16px'}}><strong>상품명 : {post.template}</strong></div>
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

export default DetailReviewPage