import React, { useState, useEffect } from 'react';
import { Typography, Col, Card, Row } from 'antd';
import ImageSlider from '../../../utils/ImageSlider';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './RecommendPage.css';

const { Title } = Typography;
const { Meta } = Card;

let categoryCountArr = [0, 0, 0, 0, 0, 0]
let styleCountArr = [0, 0, 0, 0, 0, 0, 0, 0]

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
                    alert('Failed to fetch template data')
                }
            })

        let likeItems = [];
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
                    console.log(response.data.templates)
                    if(response.data.templates.length > 0) {
                        for(let i=0; i<response.data.templates.length; i++) {
                            categoryCountArr[response.data.templates[i].category-1] += 1 // 각 카테고리 빈도수 체크
                            styleCountArr[response.data.templates[i].styles-1] += 1 // 각 스타일 빈도수 체크
                            //console.log(categoryCountArr)
                            //console.log(styleCountArr)
                        }
                        //console.log(Math.max.apply(null, categoryCountArr))
                        let bestCategory = Math.max.apply(null, categoryCountArr) //카테고리의 가장 큰 빈도수 값
                        let bestStyle = Math.max.apply(null, styleCountArr) //스타일의 가장 큰 빈도수 값
                        let categoryIndex = categoryCountArr.indexOf(bestCategory)
                        let styleIndex = styleCountArr.indexOf(1)
    
                        let categoryArr = [], styleArr = [], newFilters={}
                        
                        while(categoryIndex != -1) {
                            categoryArr.push(categoryIndex);
                            categoryIndex = categoryCountArr.indexOf(bestCategory, categoryIndex+1);
                        }
                        //console.log(categoryArr)
                        while(styleIndex != -1) {
                            styleArr.push(styleIndex);
                            styleIndex = styleCountArr.indexOf(bestStyle, styleIndex+1);
                        }
                        newFilters["category"] = categoryArr
                        newFilters["styles"] = styleArr
                        //console.log(newFilters)
    
                        let variables = {
                            filters: newFilters,
                        }
                        getRecommendTemplates(variables)
                    }
                } else {
                    alert('Failed to fetch template data')
                }
            })
    }

    const getRecommendTemplates = (variables) => {
        axios.post('/api/template/getRecommendTemplates', variables)
            .then(response => {
                if(response.data.success) {
                    setRecommendTemplates(response.data.templates)
                    console.log(response.data.templates)
                } else {
                    alert('Failed to fetch template data')
                }
            })
    }

    const bestTemplates = Templates.map((template, index) => {
        return <td key={index} style={{ borderLeft:'none', borderRight:'none' }} >
            <Card
                style = {{width:"200px", height:"250px"}}
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
                //style = {{width:"190px", height:"240px"}}
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
        <div style ={{ width: '75%', margin:'3rem auto', fontFamily: 'kyobo' }}>
            <div style ={{ textAlign: 'center', marginBottom:'50px'}}>
                <Title level={2}>추천속지</Title>
            </div>
            <Title level={3} style={{ marginBottom:'30px', color:'#2457BD', fontWeight:'bold' }}>
                속지 BEST5
            </Title>
            <div style={{ marginBottom: '100px'}}>
                {Templates.length === 0 ?
                    <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                        <h2>No post yet...</h2>
                    </div> 
                    :
                    <div className='container_scroll'>
                        <div>
                            <table frame='void'>
                                <tr style ={{ fontFamily: 'kyobo'}}>
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
                <Title level={3} style={{ marginBottom:'50px' }}>
                            <b style={{ color:'skyblue' }}>{Nickname}</b>님을 위한 추천 속지
                </Title>

                {RecommendTemplates.length === 0 ?
                    <div style ={{ display: 'flex', height:'150px', justifyContent: 'center', alignItems: 'center', textAlign:'center' }}>
                        <h2><b>
                            아직 디지털 문방구에서 <span style={{ color:'skyblue' }}>{Nickname}</span>님의 취향을 알 수 없습니다.<br/>
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
