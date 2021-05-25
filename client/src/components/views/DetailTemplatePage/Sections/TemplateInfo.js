import React, { useState,useEffect } from 'react'
import { Tooltip, Descriptions, Button, Row, Col, Popconfirm, message } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';
import { HeartOutlined, HeartFilled, DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
    const [LikeCounts, setLikeCounts] = useState(0)
    const [FilePath, setFilePath] = useState("")
    
    const user = useSelector(state => state.user)

    let likeCounts = 0;

    useEffect(() => {
       setTemplate(props.detail)
       var indexs = styles.findIndex(i => i._id == props.detail.styles)
       setStyle(Styles[indexs])
       setFilePath((process.env.REACT_APP_S3_URL) +'templateFile/' + props.detail.uploadedFile)
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

      Axios.get(`/api/template/templates_by_id?id=${props.id}&type=single`)
            .then(response => {
                setLikeCounts(response.data[0].likes)
            })

    }, [props.detail])

    
    const onLikeHandler = () => {
        if(user.userData && !user.userData.isAuth) {//로그인을 안했으면 로그인을 해달라는 메세지 뜨기
            return alert('로그인이 필요합니다.');
        }
        else {
            dispatch(addToLike(props.detail._id))

            if (LikeAction === 'liked') {
                setLikeAction(null)
                alert('찜하기를 취소했습니다.')
                let body = {
                    templateId: props.detail._id,
                    like : LikeCounts-1
                }
                setLikeCounts(LikeCounts-1)
                Axios.post('/api/template/modifyLikes', body)
            }
            else {
                setLikeAction('liked')
                alert('이 탬플릿을 찜했습니다.')
                let body = {
                    templateId: props.detail._id,
                    like : LikeCounts+1
                }
                setLikeCounts(LikeCounts+1)
                Axios.post('/api/template/modifyLikes', body)
            }
        }
    }

    const onFileDownloadAlertHandler = () => {
        alert('로그인이 필요합니다.')
    }

    const onFileDownloadHandler = () => {
        let body = {
            templateId: props.detail._id,
            download: props.detail.downloads
        } 
        Axios.post('/api/users/addDownload', body)
        Axios.post('/api/template/increaseDownload', body)
    }

    const onLinkHandler = () => {
        if(user.userData && !user.userData.isAuth) {
            return alert('로그인이 필요합니다.');
        }
        else {    
            window.open(props.detail.uploadedUrl, "_blank")
            onFileDownloadHandler();
        }
    }

    const confirm = (e) => {
        const body = {
            templateID: Template._id
        }

        Axios.post('/api/template/deleteTemplate', body)
            .then(response => {
                if (response.data.success) {
                    message.success('템플릿이 삭제되었습니다.');
                    setTimeout(() => {
                        window.location.href="/"
                    }, 150);
                } else {
                    alert('Failed to delete Template')
                }
            })
      }

    const cancel = (e) => {
        message.error('취소되었습니다');
    }

    return (
        <div>
            <Row>
                <Col style={{width: '90%'}}>
                    <Descriptions title="Template Info"></Descriptions>
                </Col>
                {(user.userData && Template.writer && Template.writer._id == user.userData._id) ?
                <Col style={{width: '5%'}}> 
                    <Link to={`/template/upload/modify/${Template._id}`}>
                        <Tooltip title="edit"><div><EditOutlined /> </div></Tooltip>
                    </Link>
                </Col> : <Col></Col>}
                {(user.userData && Template.writer && Template.writer._id == user.userData._id) ?
                 <Col style={{width: '5%'}}>
                    <Popconfirm
                        title="Are you sure to delete this template?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    ><a href="#"><Tooltip placement="bottom" title="delete"><DeleteOutlined /></Tooltip></a>
                    </Popconfirm>
                </Col> : <Col></Col>}
            </Row>
            <Row>
                <Descriptions>
                    <Descriptions.Item label="Designer">{Template.designer}</Descriptions.Item>
                    <Descriptions.Item label="Style">{Style}</Descriptions.Item>
                    <Descriptions.Item label="nickname">{Template.nickname}</Descriptions.Item>
                    <Descriptions.Item label="Description">{Template.description}</Descriptions.Item>    
                </Descriptions>
            </Row>
            <br />
            {(user.userData && !user.userData.isAuth) ?
                <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                        disabled={!LinkDisableAction} onClick={onFileDownloadAlertHandler}>
                    File Download
                </Button> :
                <a href={FilePath} download>
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                            disabled={!LinkDisableAction} onClick={onFileDownloadHandler}>
                        File Download
                    </Button>
                </a>
            }&nbsp;&nbsp;
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                    disabled={LinkDisableAction} onClick={onLinkHandler}>
                Go to Link
            </Button>&nbsp;&nbsp;
            <Tooltip title="찜하기">
                {LikeAction === 'liked' ? 
                <HeartFilled style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/> 
                : 
                <HeartOutlined style={{ fontSize: '32px', color: '#f00' }} onClick={onLikeHandler}/>
                }
	        </Tooltip>
            <KakaoLinkShare detail={Template} />
        </div>
    )
}

export default TemplateInfo
