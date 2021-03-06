import React, { useEffect, useState } from 'react'; 
import { Col, Card, Row, Typography, message, Button } from 'antd';
import ImageSlider from '../../../utils/ImageSlider'
import axios from 'axios';
import './MyDownload.css'

const { Meta } = Card;
const { Title } = Typography;

var downloadDuplicateForLoadMore=[]

function MyDownload(props) {
    const [Templates, setTemplates] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
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
            template: downloadArr
        }

        getTemplates(variables)

    }, [props.user.userData])

    const getTemplates = (variables) => {
        axios.post('/api/template/getMyPageTemplates', variables)
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
            loadMore: true,
            template: downloadDuplicateForLoadMore
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
        <div className="mydownload">
            <Title>
                <div className="Mydownload-pageheader-1">마이페이지</div>
                <div className="Mydownload-pageheader-2">다운로드 기록</div>
            </Title>

            {Templates.length === 0 ?
                <div className="Mydownload-noCards">
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
                <div className="Mydownload-loardMore">
                    <Button onClick={onLoadMore}>더 보기</Button>
                </div>
            }
            
        </div>
    )
}

export default MyDownload