import React, { useState } from 'react'
import { Button, Input, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import '../DetailTemplatePage.css';

const { TextArea } = Input;

function Comments(props) {
    const user = useSelector(state => state.user)
    const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if(user.userData && !user.userData.isAuth) {//로그인을 안했으면 로그인을 해달라는 메세지 뜨기
            return message.warning('로그인이 필요합니다.')
        }
        
        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("")
                    props.refreshFunction(response.data.result)
                } else {
                    message.error('댓글 저장에 실패했습니다.')
                }
            })
    }

    return (
        <div style={{fontFamily:"cookie-regular"}}>
            <p><strong> 댓글</strong></p>
            
            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', minHeight:'80px', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="내용을 입력해주세요"
                />
                <br />
                <Button type="primary" className='comment-button' onClick={onSubmit}>작성</Button>
            </form>
            <hr />
            {/* Comment Lists  */}
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={index}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}



            

        </div>
    )
}

export default Comments
