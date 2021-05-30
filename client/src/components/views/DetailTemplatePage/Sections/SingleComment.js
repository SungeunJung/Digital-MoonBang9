import React, { useState, useEffect } from 'react'
import { Comment, Avatar, Button, Input, Popconfirm, message } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)
    
    let location = useLocation();

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if(user.userData && !user.userData.isAuth) {//로그인을 안했으면 로그인을 해달라는 메세지 뜨기
            return message.warning('로그인이 필요합니다.')
        }

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
                    message.error('댓글 저장에 실패했습니다.')
                }
            })
    }

    const actions = [
        <span onClick={openReply}  key="comment-basic-reply-to" style={{fontFamily:"cookie-regular"}}>대댓글 달기 </span>
    ]

    const confirm = (e) => {
        
        const body = {
            commentID: props.comment._id
        }

        Axios.post('/api/comment/deleteComment', body)
            .then(response => {
                if (response.data.success) {
                    message.success('삭제되었습니다.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 150);
                } else {
                    message.error('댓글 저장에 실패했습니다.')
                }
            })
      }

    const cancel = (e) => {
        message.error('취소되었습니다');
    }

    return (
        <div style={{width : "90%", display: "block", fontFamily:"cookie-regular"}}>
            <table style={{display: "flex", tableLayout:'auto'}}>
                <tbody>
                <tr>
                <td style={{ border:'none'}}>
                <Comment
                    actions={actions}
                    author={<div style={{fontFamily:"cookie-regular"}}>{props.comment.writer.nickname}</div>}
                    avatar={props.comment.writer.image?
                        <Avatar
                            src={process.env.REACT_APP_S3_URL+`userProfile/${props.comment.writer.image}`}
                            alt="image"
                        />:
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    content={
                        <p style={{fontFamily:"cookie-regular"}}>
                            {props.comment.content}
                        </p>
                    }
                ></Comment>
                </td>
                {(user.userData && props.comment && props.comment.writer._id == user.userData._id) ?
                    <td style={{ border:'none'}}>
                    <br/>
                    <Popconfirm
                        title="Are you sure to delete this comment?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a href="#" style={{fontFamily:"cookie-regular"}}>삭제<br/><br/><br/></a>
                    </Popconfirm>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    </td> :
                    <td style={{ border:'none'}}>
                    <br/>
                    <span></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    </td>
                }
                </tr>
                </tbody>
            </table>


            {OpenReply &&
            <div>
                <form style={{ display: 'flex', marginLeft:'40px', marginBottom:'5%' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', minHeight:'80px', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="내용을 입력해주세요"
                    />
                    <br />
                    <Button type="primary" className='comment-button' onClick={onSubmit}>작성</Button>
                </form>
            </div>
            }
        </div>
    )
}

export default SingleComment
