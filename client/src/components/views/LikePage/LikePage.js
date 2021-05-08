import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider'
import { get } from 'mongoose/lib/promise_provider';

const { Meta } = Card;

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
                    if(variables.loadMore) {
                        console.log("loadMore = true")
                        setTemplates([...Templates, ...response.data.templates])
                    } else {
                        setTemplates(response.data.templates)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fetch template data')
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
        <div style ={{ width: '75%', margin:'3rem auto' }}>
            <div style ={{ textAlign: 'center' }}>
                <h2>찜하기 목록</h2>
            </div>

            <br/>
            {Templates.length === 0 ?
                <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br /><br />
            {PostSize >= Limit &&
                <div style ={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }
            
        </div>
    )
}

export default LikePage