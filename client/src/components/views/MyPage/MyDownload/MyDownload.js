import React, { useEffect, useState } from 'react';
import { Col, Card, Row, Typography } from 'antd';
import ImageSlider from '../../../utils/ImageSlider'
import axios from 'axios';

const { Meta } = Card;
const { Title } = Typography;

var downloadDuplicateForLoadMore=[]

function MyDownload(props) {
    const [Templates, setTemplates] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {
        let downloadArr = []
        if (props.user.userData && props.user.userData.download) {
            if (props.user.userData.download.length > 0) {
                props.user.userData.download.forEach(item => {
                    downloadArr.push(item.id)
                })
            }
        }

        downloadDuplicateForLoadMore = downloadArr.slice();

        let variables = {
            skip: Skip,
            limit: Limit,
            download: downloadArr
        }

        getTemplates(variables)

    }, [props.user.userData])

    const getTemplates = (variables) => {
        axios.post('/api/template/getMyDownload', variables)
            .then(response => {
                if(response.data.success) {
                    if(variables.loadMore) {
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
            loadMore: true,
            download: downloadDuplicateForLoadMore
        }
        
        getTemplates(variables)
    }

    const renderCards = Templates.map((template, index) => {
        var temp = ""
        props.user.userData.download.map((download, index) => {
            if(download.id == template._id) 
                temp = new Date(download.date);
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
        <div style ={{ width: '75%', margin:'3rem auto', fontFamily: 'kyobo' }}>
            <div style ={{ textAlign: 'center' }}>
                <Title level={1}>마이페이지</Title>
                <Title level={3}>다운로드 기록</Title>
            </div>

            <br/>
            {Templates.length === 0 ?
                <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>다운로드 받은 속지가 없습니다.</h2>
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

export default MyDownload