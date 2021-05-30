import React, { useState,useEffect } from 'react';
import { Typography, Tooltip, message, Button, Row, Col, Popconfirm, Tag, Statistic, Divider } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';
import { HeartTwoTone, ExportOutlined, DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addToLike } from '../../../../_actions/user_action';
import Axios from 'axios';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import KakaoLinkShare from '../../../utils/KakaoLinkShare';
import { pages } from '../../LandingPage/Sections/Datas';
import '../DetailTemplatePage.css';
import { color } from '../../../utils/colors'

const Styles = ["심플", "귀여운", "캐릭터", "빈티지", "레트로", "키치", "클래식", "일러스트"]
const { Title } = Typography;

function TemplateInfo(props) {
    const dispatch = useDispatch();
    const [Template, setTemplate] = useState([])
    const [Style, setStyle] = useState("")
    const [LinkDisableAction, setLinkDisableAction] = useState(true)
    const [LikeAction, setLikeAction] = useState(null)
    const [LikeCounts, setLikeCounts] = useState(0)
    const [FilePath, setFilePath] = useState("")
    const [Category, setCategory] = useState("")
    const [Detail, setDetail] = useState("")
    
    const user = useSelector(state => state.user)
    useEffect(() => {
       setTemplate(props.detail)
       //var indexs = styles.findIndex(i => i._id == props.detail.styles)
       //setStyle(Styles[indexs])
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
                setCategory(pages[response.data[0].category-1].category)
                setDetail(pages[response.data[0].category-1].detail[response.data[0].detail-1])
                setStyle(Styles[response.data[0].styles-1])
            })

    }, [props.detail])

    
    const onLikeHandler = () => {
        if(user.userData && !user.userData.isAuth) {//로그인을 안했으면 로그인을 해달라는 메세지 뜨기
            return message.warning('로그인이 필요합니다.')
        }
        else {
            dispatch(addToLike(props.detail._id))

            if (LikeAction === 'liked') {
                setLikeAction(null)
                message.success('찜하기를 취소했습니다.')
                let body = {
                    templateId: props.detail._id,
                    like : LikeCounts-1
                }
                setLikeCounts(LikeCounts-1)
                Axios.post('/api/template/modifyLikes', body)
            }
            else {
                setLikeAction('liked')
                message.success('이 탬플릿을 찜했습니다.')
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
        return message.warning('로그인이 필요합니다.')
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
            return message.warning('로그인이 필요합니다.')
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
                    message.success('삭제되었습니다.');
                    setTimeout(() => {
                        window.location.href="/"
                    }, 150);
                } else {
                    message.error('삭제에 실패했습니다.')
                }
            })
      }

    const cancel = (e) => {
        message.error('취소되었습니다');
    }

    return (
        <div>
            <Row>
                <Col style={{width: '84%'}}>
                    <Title level={1} style={{marginBottom:'12px'}}>{Template.title}</Title>
                    <Title level={4} style={{marginTop:'0px', marginBottom:'15px'}}>{Template.designer}</Title>
                </Col>
                {(user.userData && Template.writer && Template.writer._id == user.userData._id) ?
                <Col style={{width: '8%'}}> 
                    <Link to={`/template/upload/modify/${Template._id}`}>
                        <Tooltip title="edit"><div><EditOutlined className='icon-edit'/> </div></Tooltip>
                    </Link>
                </Col> : <Col></Col>}
                {(user.userData && Template.writer && Template.writer._id == user.userData._id) ?
                 <Col style={{width: '8%'}}>
                    <Popconfirm
                        title="Are you sure to delete this template?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        placement="bottomRight"
                    ><a href="#"><Tooltip title="delete"><DeleteOutlined className='icon-delete'/></Tooltip></a>
                    </Popconfirm>
                </Col> : <Col></Col>}
            </Row>
            <Row>
                {/*<Tag color="cyan">cyan</Tag>*/}
                <Tag color="blue" className={'tag-style-'+Category.length}>#{Category}</Tag>
                
                <Tag color="geekblue" className={'tag-style-'+Detail.length}>#{Detail}</Tag>
                <Tag color="purple" className={'tag-style-'+Style.length}>#{Style}</Tag>
            </Row>
            <br/>
                {/*<Row gutter={[20, 20]}>
                    <Col>작성자</Col>
                    <Col>{Template.nickname}</Col>
                </Row>*/}
                <div className="template-desc">
                    <Divider orientation="left"><span style={{fontSize:'20px'}}>속지 설명</span></Divider>
                    <div style={{padding:'0 10px', wordBreak:'keep-all', wordWrap:'break-word'}}>{Template.description}</div>
                </div>
            <br />
            <br />
            <Row>
            {(user.userData && !user.userData.isAuth) ?
                <Col className='download'>
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                            disabled={!LinkDisableAction} onClick={onFileDownloadAlertHandler}>
                        다운로드
                    </Button>
                </Col> 
                :
                <Col className='download'>
                <a href={FilePath} download>
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'large'} 
                            disabled={!LinkDisableAction} onClick={onFileDownloadHandler}>
                        <span>다운로드</span>
                    </Button>
                </a>
                </Col>
            }&nbsp;&nbsp;
            <Col className='link'>
                <Button type="primary" shape="round" icon={<ExportOutlined />} size={'large'} 
                        disabled={LinkDisableAction} onClick={onLinkHandler}>
                        <span>링크 이동</span>
                </Button>&nbsp;&nbsp;
            </Col>
            <Col className='like'>
                <Tooltip title="찜하기">
                    {LikeAction === 'liked' ? 
                    //HeartFilled
                    <Button style={{borderColor:"#ff85c0", backgroundColor:'#fffbfb'}} onClick={onLikeHandler}><Statistic valueStyle={{fontSize:'18px'}} value={LikeCounts} prefix={<HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: '24px', color: '#f00' }} />}/></Button>
                    : 
                    //HeartOutlined
                    <Button onClick={onLikeHandler}><Statistic valueStyle={{fontSize:'18px'}} value={LikeCounts} prefix = {<HeartTwoTone style={{ fontSize: '24px', color: '#f00' }} />}/></Button>
                    }
                </Tooltip>
            </Col>
            &nbsp;
            <Col className='share'>
                <KakaoLinkShare detail={Template} />
            </Col>
            </Row>
        </div>
    )
}

export default TemplateInfo
