import React, { useState, useEffect } from 'react'; 
import { Typography, Col, Card, Row, message } from 'antd';
import ImageSlider from '../../../utils/ImageSlider';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './RecommendPage.css';

const { Title } = Typography;
const { Meta } = Card;

let categoryCountArr = [0, 0, 0, 0, 0, 0]
let styleCountArr = [0, 0, 0, 0, 0, 0, 0, 0]
let likeItems = [];

function RecommendPage(props) {
    const user = useSelector(state => state.user);
    const [Templates, setTemplates] = useState([])
    const [RecommendTemplates, setRecommendTemplates] = useState([])
    const [Nickname, setNickname] = useState("")

    useEffect(() => {
        axios.post('/api/template/getBestTemplates')
            .then(response => {
                if(response.data.success) {
                    setTemplates(response.data.templates)
                } else {
                    message.error('템플릿 정보를 가져올 수 없습니다.')
                }
            })

        likeItems = [];
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData) {
            if(props.user.userData.nickname) {
                setNickname(props.user.userData.nickname)
            }
            if(props.user.userData.like) {
                if (props.user.userData.like.length > 0) {
                    props.user.userData.like.forEach(item => {
                        likeItems.push(item.id)
                    })
                    let variables = {
                        likes: likeItems
                    }
                    getLikeTemplates(variables);
                }
            }
            
        }
    }, [props.user.userData])

    const getLikeTemplates = (variables) => {
        axios.post('/api/template/getLikeTemplates', variables)
            .then(response => {
                if(response.data.success) {
                    if(response.data.templates.length > 0) {
                        for(let i=0; i<response.data.templates.length; i++) {
                            categoryCountArr[response.data.templates[i].category-1] += 1 // 각 카테고리 빈도수 체크
                            styleCountArr[response.data.templates[i].styles-1] += 1 // 각 스타일 빈도수 체크
                        }
                        let bestCategory = Math.max.apply(null, categoryCountArr) //카테고리의 가장 큰 빈도수 값
                        let bestStyle = Math.max.apply(null, styleCountArr) //스타일의 가장 큰 빈도수 값
                        let categoryIndex = categoryCountArr.indexOf(bestCategory)
                        let styleIndex = styleCountArr.indexOf(1)
    
                        let categoryArr = [], styleArr = [], newFilters={}
                        
                        while(categoryIndex != -1) {
                            categoryArr.push(categoryIndex);
                            categoryIndex = categoryCountArr.indexOf(bestCategory, categoryIndex+1);
                        }
                        while(styleIndex != -1) {
                            styleArr.push(styleIndex);
                            styleIndex = styleCountArr.indexOf(bestStyle, styleIndex+1);
                        }
                        newFilters["category"] = categoryArr
                        newFilters["styles"] = styleArr
    
                        let body = {
                            filters: newFilters,
                            like: likeItems
                        }
                        getRecommendTemplates(body)
                    }
                } else {
                    message.error('템플릿 정보를 가져올 수 없습니다.')
                }
            })
    }

    const getRecommendTemplates = (variables) => {
        axios.post('/api/template/getRecommendTemplates', variables)
            .then(response => {
                if(response.data.success) {
                    setRecommendTemplates(response.data.templates)
                } else {
                    message.error('템플릿 정보를 가져올 수 없습니다.')
                }
            })
    }

    const bestTemplates = Templates.map((template, index) => {
        return <td key={index} className="Recommend-bestCards">
            <Card
                className="Recommend-bestCard"
                hoverable={true}
                cover={ <a href={`/template/${template._id}`}>
                <ImageSlider images={template.images} /></a>}
            > 
                <Meta
                    title={template.title}
                    description={template.nickname}
                />
            </Card>
        </td>
    })

    const recommendTemplates = RecommendTemplates.map((template, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                hoverable={true}
                cover={ <a href={`/template/${template._id}`}>
                <ImageSlider images={template.images} /></a>}
            > 
                <Meta
                    title={template.title}
                    description={template.nickname}
                />
            </Card>
        </Col>
    })

    return (
        <div className="recommendPage">
            <Title>
                <div className="Recommend-pageheader">
                    추천속지
                </div>
            </Title>
            <div className="Recommend-pageheader-best">
                속지 BEST5
            </div>
            <div className="Recommend-aboveCards">
                {Templates.length === 0 ?
                    <div className="Recommend-noCards">
                        <h2>No post yet...</h2>
                    </div> 
                    :
                    <div className='Recommend-container'>
                        <div>
                            <table frame='void'>
                                <tr className='Recommend-font'>
                                {bestTemplates}
                                </tr>
                            </table>
                        </div>
                    </div>
                }
            </div>
            { props.user.userData && !props.user.userData.isAuth ? 
            <Title level={5}><a href="/login">로그인</a> 후 취향에 맞는 속지를 추천해 드립니다.</Title>
            :
            <div>
                <Title >
                    <div className="Recommend-pageheader-recommend">
                            <b className="Recommend-color">{Nickname}</b>님을 위한 추천 속지
                    </div>
                </Title>

                {RecommendTemplates.length === 0 ?
                    <div className="Recommend-notLogin">
                        <h2><b>
                            아직 디지털 문방구에서 <span className="Recommend-color">{Nickname}</span>님의 취향을 알 수 없습니다.<br/>
                            속지 찜하기를 할수록 추천 정확도가 높아집니다.
                        </b></h2>

                    </div> 
                    :
                    <div style={{ }}>
                        <Row gutter={[16, 16]}>
                                {recommendTemplates}
                        </Row>
                    </div>
                }
            </div>
            
            }
        </div>
    )
}

export default RecommendPage
