import React, { useState,useEffect } from 'react'
import { Tooltip, Descriptions, Button } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';
import { HeartOutlined, HeartFilled, DownloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addToLike } from '../../../../_actions/user_action'
import Axios from 'axios';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import KakaoLinkShare from '../../../utils/KakaoLinkShare';

const Styles = ["심플", "귀여운", "캐릭터", "빈티지", "레트로", "키치", "클래식", "일러스트"]

function TemplateInfo(props) {
    const dispatch = useDispatch();
    const [Template, setTemplate] = useState([])
    const [Style, setStyle] = useState("")
    const [LinkDisableAction, setLinkDisableAction] = useState(true)
    const [LikeAction, setLikeAction] = useState(null)
    const [FilePath, setFilePath] = useState("")
    const user = useSelector(state => state.user)

    useEffect(() => {
       setTemplate(props.detail)
       var indexs = styles.findIndex(i => i._id == props.detail.styles)
       setStyle(Styles[indexs])
       setFilePath((process.env.REACT_APP_S3_URL) +'templateFile/' + props.detail.uploadedFile)
       console.log((process.env.REACT_APP_S3_URL) +'templateFile/' + props.detail.uploadedFile)
       if(props.detail.uploadedUrl) {
           setLinkDisableAction(false)
       } 
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
    }, [props.detail])


    const onLikeHandler = () => {
        if(user.userData && !user.userData.isAuth) {//로그인을 안했으면 로그인을 해달라는 메세지 뜨기
            alert('로그인이 필요합니다.')
        }
        else {
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
            <KakaoLinkShare detail={Template} />
        </div>
    )
}

export default TemplateInfo
