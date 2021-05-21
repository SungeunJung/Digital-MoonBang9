import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Card, Icon, Avatar, Col, Typography, Rate } from 'antd';
const { Title } = Typography
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
function DetailReviewPage(props) {

    const [post, setPost] = useState([])
    const postId = props.match.params.postId;

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

    if (post.writer) {
        return (
            <div className="postPage" style={{ width: '60%', margin: '5rem auto' }}>
                <Title level={2}>{post.title}</Title>
                <div style={{ display: 'flex'}}>
                    <Avatar
                        src={`http://localhost:2000/${post.writer.image}`}
                        alt="image"
                    />&nbsp;&nbsp;
                    <Title level={5}>{post.writer.nickname}</Title>
                </div>
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