import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Card, Icon, Avatar, Col, Typography, Rate, Row, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
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
        console.log(e);
        message.error('취소되었습니다');
    }

    if (post.writer) {
        return (
            <div className="postPage" style={{ width: '60%', margin: '5rem auto' }}>
                <Title level={2}>{post.title}</Title>
                <Row>
                    <Col style={{width: '90%'}}>
                        <div style={{ display: 'flex'}}>
                            <Avatar
                                src={process.env.REACT_APP_S3_URL+`userProfile/${post.writer.image}`}
                                alt="image"
                            />&nbsp;&nbsp;
                            <Title level={5}>{post.writer.nickname}</Title>
                        </div>
                    </Col>
                    {(user.userData && post.writer && post.writer._id == user.userData._id) ?
                    <Col style={{width: '5%'}}>
                        <Tooltip title="edit"><div><EditOutlined /> </div></Tooltip>
                    </Col> : <Col></Col>}
                    {(user.userData && post.writer && post.writer._id == user.userData._id) ?
                    <Col style={{width: '5%'}}>
                        <Popconfirm
                            title="Are you sure to delete this reviews?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><a href="#"><DeleteOutlined /></a>
                        </Popconfirm>
                    </Col> : <Col></Col>}
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Title level={4}>{post.createdAt.split('T')[0]}</Title>
                </div>
                <div>
                <Rate tooltips={desc} value={post.rate} />
                {post.rate ? <span className="ant-rate-text" style={{ color: "#DAA520" }}>
                    {desc[post.rate - 1]}</span> : ''}
                </div>
                <br/>
                <div style = {{fontSize : '15px'}}><strong>상품명 : {post.template}</strong></div>
                <hr /><br />
                <div dangerouslySetInnerHTML={{ __html: post.description }} />
            </div>
        )
    } else {
        return (
            <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>
        )
    }

}

export default DetailReviewPage