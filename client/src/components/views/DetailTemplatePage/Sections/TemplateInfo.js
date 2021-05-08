import React, { useState,useEffect } from 'react'
import { Tooltip, Descriptions } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addToLike } from '../../../../_actions/user_action'
import Axios from 'axios';
import { useSelector } from "react-redux";

const Styles = ["심플", "귀여운", "캐릭터", "빈티지", "레트로", "키치", "클래식", "일러스트"]

function TemplateInfo(props) {
    const dispatch = useDispatch();
    const [Template, setTemplate] = useState([])
    const [Style, setStyle] = useState("")
    const [LikeAction, setLikeAction] = useState(null)
    const user = useSelector(state => state.user)

    useEffect(() => {
       setTemplate(props.detail)
       var indexs = styles.findIndex(i => i._id == props.detail.styles)
       setStyle(Styles[indexs])
       Axios.get('/api/users/getLikes')
      .then(response => {
         if (response.data.success) {
             response.data.likes.map(like => {
                if (like.id === props.detail._id) {
                   setLikeAction('liked')
                }
             })
         } else {
            console.log('Failed to get likes')
         }
      })
       //setLikeAction('liked')//Like필드에서 정보를 받아와서 초기화
       //로그인x
       //Like필드가 없는상태 or quantity가 0인상태
       //Like.quantity === 1이면 
    }, [props.detail])


    const onLikeHandler = () => {
        //로그인을 안했으면 로그인을 해달라는 메세지 뜨기
        if(user.userData && !user.userData.isAuth) {
            alert('로그인이 필요합니다.')
        }
        else {
            //로그인을 했으면
            //필요한 정보를 Like 필드에다가 넣어 준다.
            dispatch(addToLike(props.detail._id))
            if (LikeAction === 'liked') {
                setLikeAction(null)
                alert('찜하기를 취소했습니다.')
            }
            else {
                setLikeAction('liked')
                alert('이 탬플릿을 찜했습니다.')
            }
        }
        
    }

    return (
        <div>
            <Descriptions title="Template Info">
                <Descriptions.Item label="Designer">{Template.designer}</Descriptions.Item>
                <Descriptions.Item label="Style">{Style}</Descriptions.Item>
                <Descriptions.Item label="nickname">{Template.nickname}</Descriptions.Item>
                <Descriptions.Item label="Description">{Template.description}</Descriptions.Item>    
            </Descriptions>
            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="찜하기">
                {LikeAction === 'liked' ? 
                <HeartFilled style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/> : 
                <HeartOutlined style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/>}
	                
                </Tooltip>
            </div>
            
        </div>
    )
}

export default TemplateInfo
