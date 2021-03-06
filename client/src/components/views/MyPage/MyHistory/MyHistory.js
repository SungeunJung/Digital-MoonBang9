import React, { useEffect, useState } from 'react'; 
import { Col, Card, Row, Typography, message, Button } from 'antd';
import ImageSlider from '../../../utils/ImageSlider'
import axios from 'axios';
import './MyHistory.css'

const { Meta } = Card;
const { Title } = Typography;

var historyDuplicateForLoadMore=[]

function MyHistory(props) {
    const [Templates, setTemplates] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {
        let historyArr = []
        if (props.user.userData && props.user.userData.history) {
            if (props.user.userData.history.length > 0) {
                props.user.userData.history.forEach(item => {
                    historyArr.push(item.id)
                })
            }
        }

        historyDuplicateForLoadMore = historyArr.slice();

        let variables = {
            skip: Skip,
            limit: Limit,
            template: historyArr
        }

        getTemplates(variables)

    }, [props.user.userData])

    const getTemplates = (variables) => {
        axios.post('/api/template/getMyPageTemplates', variables)
            .then(response => {
                if(response.data.success) {
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
            loadMore: true,
            template: historyDuplicateForLoadMore
        }
        
        getTemplates(variables)
    }

    const renderCards = Templates.map((template, index) => {
        var temp = ""
        props.user.userData.history.map((history, index) => {
            if(history.id == template._id) 
                temp = new Date(history.date);
        })
        var date = temp.toISOString().split('T')[0]
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card 
                hoverable={true}
                cover={ <a href={`/template/${template._id}`}>
                <ImageSlider images={template.images} /></a>}
            > 
                <Meta
                    title={template.title}
                    description={template.nickname + "\n" + date}
                />
            </Card>
        </Col>
    })

    return (
        <div className="myhistory">
            <Title>
                <div className="Myhistory-pageheader-1">마이페이지</div>
                <div className="Myhistory-pageheader-2">방문 기록</div>
            </Title>
            
            {Templates.length === 0 ?
                <div className="Myhistory-noCards">
                    <h2>방문 기록이 없습니다.</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br /><br />
            {PostSize >= Limit &&
                <div className="Myhistory-loadMore">
                    <Button onClick={onLoadMore}>더 보기</Button>
                </div>
            }
            
        </div>
    )
}

export default MyHistory
