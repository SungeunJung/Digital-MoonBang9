import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Card, Icon, Avatar, Col, Typography } from 'antd';
const { Title } = Typography

function DetailTipPage(props) {

    const [post, setPost] = useState([])
    const postId = props.match.params.postId;

    useEffect(() => {

        const variable = { postId: postId }

        axios.post('/api/tip/getPost', variable)
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
                        src={process.env.REACT_APP_S3_URL+`userProfile/${post.writer.image}`}
                        alt="image"
                    />&nbsp;&nbsp;
                    <Title level={5}>{post.writer.nickname}</Title>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Title level={4}>{post.createdAt.split('T')[0]}</Title>
                </div>
                <br />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />

            </div>
        )
    } else {
        return (
            <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>
        )
    }

}

export default DetailTipPage