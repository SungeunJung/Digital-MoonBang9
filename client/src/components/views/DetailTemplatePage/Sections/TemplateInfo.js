import React, { useState,useEffect } from 'react'
<<<<<<< HEAD
import { Tooltip, Descriptions } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
=======
import { Tooltip, Descriptions, Button } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';
import { HeartOutlined, HeartFilled, DownloadOutlined } from '@ant-design/icons';
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
import { useDispatch } from 'react-redux';
import { addToLike } from '../../../../_actions/user_action'
import Axios from 'axios';
import { useSelector } from "react-redux";
<<<<<<< HEAD
=======
import { Link } from 'react-router-dom'
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea

const Styles = ["심플", "귀여운", "캐릭터", "빈티지", "레트로", "키치", "클래식", "일러스트"]

function TemplateInfo(props) {
    const dispatch = useDispatch();
    const [Template, setTemplate] = useState([])
    const [Style, setStyle] = useState("")
<<<<<<< HEAD
    const [LikeAction, setLikeAction] = useState(null)
=======
    const [LinkDisableAction, setLinkDisableAction] = useState(true)
    const [LikeAction, setLikeAction] = useState(null)
    const [FilePath, setFilePath] = useState("")
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
    const user = useSelector(state => state.user)

    useEffect(() => {
       setTemplate(props.detail)
       var indexs = styles.findIndex(i => i._id == props.detail.styles)
       setStyle(Styles[indexs])
<<<<<<< HEAD
=======
       setFilePath('/uploads/'+props.detail.uploadedFile)
       if(props.detail.uploadedUrl) {
           setLinkDisableAction(false)
       } 
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
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
<<<<<<< HEAD
       //setLikeAction('liked')//Like필드에서 정보를 받아와서 초기화
       //로그인x
       //Like필드가 없는상태 or quantity가 0인상태
       //Like.quantity === 1이면 
=======
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
    }, [props.detail])


    const onLikeHandler = () => {
<<<<<<< HEAD
        //로그인을 안했으면 로그인을 해달라는 메세지 뜨기
        if(user.userData && !user.userData.isAuth) {
            alert('로그인이 필요합니다.')
        }
        else {
            //로그인을 했으면
            //필요한 정보를 Like 필드에다가 넣어 준다.
=======
        if(user.userData && !user.userData.isAuth) {//로그인을 안했으면 로그인을 해달라는 메세지 뜨기
            alert('로그인이 필요합니다.')
        }
        else {
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
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
<<<<<<< HEAD
        
=======
    }

    const onFileDownloadHandler = () => {
            alert('로그인이 필요합니다.')
    }

    const onLinkHandler = () => {
        if(user.userData && !user.userData.isAuth) {
            alert('로그인이 필요합니다.')
        }
        else {     
            window.open(props.detail.uploadedUrl, "_blank")
        }
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
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
<<<<<<< HEAD
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="찜하기">
                {LikeAction === 'liked' ? 
                <HeartFilled style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/> : 
                <HeartOutlined style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/>}
	                
                </Tooltip>
            </div>
=======
            {(user.userData && !user.userData.isAuth) ?
                <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                        disabled={!LinkDisableAction} onClick={onFileDownloadHandler}>
                    File Download
                </Button> :
                <Link to={FilePath} target="_blank" download>
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                            disabled={!LinkDisableAction}>
                        File Download
                    </Button>
                </Link>
            }&nbsp;&nbsp;
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                    disabled={LinkDisableAction} onClick={onLinkHandler}>
                Go to Link
            </Button>&nbsp;&nbsp;
            <Tooltip title="찜하기">
                {LikeAction === 'liked' ? 
                <HeartFilled style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/> : 
                <HeartOutlined style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/>
                }
	        </Tooltip>
>>>>>>> 87cc1ebe3bdc3cc624e8130a98cc3d75264725ea
            
        </div>
    )
}

export default TemplateInfo
