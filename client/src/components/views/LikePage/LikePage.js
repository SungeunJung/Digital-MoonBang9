import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Col, Card, Row, Typography, message } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import { get } from 'mongoose/lib/promise_provider';
import './LikePage.css'

const { Meta } = Card;
const { Title } = Typography;

var likeItemsDuplicateForLoadMore=[]
function LikePage(props) {
    const [Templates, setTemplates] = useState([])
    const [LikeItems, setLikeItems] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [PostSize, setPostSize] = useState(0)
    
    useEffect(() => {
        let likeItems = []
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.like) {
            if (props.user.userData.like.length > 0) {
                props.user.userData.like.forEach(item => {
                    likeItems.push(item.id)
                })
            }
        }

        likeItemsDuplicateForLoadMore = likeItems.slice();

        let variables = {
            skip: Skip,
            limit: Limit,
            likes: likeItems
        }

        getTemplates(variables)

    }, [props.user.userData])

    const getTemplates = (variables) => {
        axios.post('/api/template/getLikeTemplates', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.templates)
                    console.log(variables)
                    if(variables.loadMore) {
                        setTemplates([...Templates, ...response.data.templates])
                    } else {
                        setTemplates(response.data.templates)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    message.error('템플릿 정보를 가져올 수 없습니다.')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        let variables = {
            skip: skip,
            limit: Limit,
            likes: likeItemsDuplicateForLoadMore,
            loadMore: true
        }
        
        getTemplates(variables)
    }

    const renderCards = Templates.map((template, index) => {
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
        <div className="likePage">
            <Title>
                <div className="Like-pageheader-1">마이페이지</div>
                <div className="Like-pageheader-2">찜하기 목록</div>
            </Title>

            {Templates.length === 0 ?
                <div className="Like-noCards">
                    <h2>찜한 속지가 없습니다.</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br /><br />
            {PostSize >= Limit &&
                <div className="Like-loardMore">
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }
            
        </div>
    )
}

export default LikePage