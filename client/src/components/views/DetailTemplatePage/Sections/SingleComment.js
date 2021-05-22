import React, { useState, useEffect } from 'react'
import { Comment, Avatar, Button, Input, Col, Row, Popconfirm, message } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
//import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;
function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)
    //const [CommentID, setCommentID] = useState("")
    //const [UserID, setUserID] = useState("")
    
    let location = useLocation();

    /*useEffect(() => {
        console.log(props.user)
    }, [])*/

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    const actions = [
        //<LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={openReply}  key="comment-basic-reply-to">Reply to </span>
    ]

    const confirm = (e) => {
        console.log(e);
        
        const body = {
            commentID: props.comment._id
        }

        Axios.post('/api/comment/deleteComment', body)
            .then(response => {
                if (response.data.success) {
                    message.success('댓글이 삭제되었습니다.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    alert('Failed to delete Comment')
                }
            })
      }

    const cancel = (e) => {
        console.log(e);
        message.error('취소되었습니다');
    }

    return (
        <div>
            <Row>
                <Col style={{width : "95%"}}>
                <Comment
                    actions={actions}
                    author={props.comment.writer.nickname}
                    avatar={props.comment.writer.image?
                        <Avatar
                            src={`http://localhost:2000/${props.comment.writer.image}`}
                            alt="image"
                        />:
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    content={
                        <p>
                            {props.comment.content}
                        </p>
                    }
                ></Comment>
                </Col>
                {(user.userData && props.comment && props.comment.writer._id == user.userData._id) ?
                    <Col align="right"  style={{ width : "5%" }}>
                    <br/>
                    <Popconfirm
                        title="Are you sure to delete this comment?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a href="#">Delete</a>
                    </Popconfirm>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    </Col> :
                    <Col align="right"  style={{ width : "5%" }}>
                    <br/>
                    <span></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    </Col>
                }
            </Row>


            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <Button type="primary" style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>
            }
        </div>
    )
}

export default SingleComment
