import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const { Title } = Typography
const { Meta } = Card;

const headerStyleOn = {
    color: "black", 
    fontSize: "28px"
};
const headerStyleOut = {
    color: "#E2E2E2", 
    fontSize: "28px"
};

function TipAndReviewPage() {
    const user = useSelector(state => state.user);

    const [Type, setType] = useState(0)
    const [TipOrReviews, setTipOrReviews] = useState([])

    useEffect(() => {
        console.log(Type)
        axios.get(`/api/tipAndRiview/getTipOrReview?Type=${Type}`)
            .then(response => {
                console.log(response.data)
                /*if (response.data.success) {
                    console.log(response.data.tipOrReviews)
                    setTipOrReviews(response.data.tipOrReviews)
                } else {
                    alert('Couldnt get tip or review`s lists')
                }*/
            })
    }, [])

    const renderCards = (TipOrReviews && TipOrReviews.map((tipOrReview, index) => {
        console.log(tipOrReview._id)
        console.log(tipOrReview.writer.image)
        return <Col key={index} lg={8} md={12} xs={24}>
            <Card
                hoverable
                style={{ width: 250, marginTop: 16 }}
                cover={ <a href={`/tipAndReview/post/${tipOrReview._id}`}></a>}
            >
                <Meta
                    avatar={
                        tipOrReview.writer.image?
                    <Avatar
                        src={`http://localhost:2000/${tipOrReview.writer.image}`}
                        alt="image"
                        
                    />:
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    title={tipOrReview.writer.name}
                    description={tipOrReview.title}
                />
                <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: tipOrReview.content }} />
                </div>
            </Card>
        </Col>
    }))

    const onTip = () => {
        setType(0)
    }

    const onReview = () => {
        setType(1)
    }

    return (
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>       
            <Row>
                <Col style={{width : '450px'}}>
                    <strong>
                    <span onClick={onTip} style={Type === 0 ? headerStyleOn : headerStyleOut}>
                    Tip</span> <span style={headerStyleOn}>  /  </span>
                    <span onClick={onReview} style={Type === 1 ? headerStyleOn : headerStyleOut}>
                    Review</span>
                    </strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                { (user.userData && !user.userData.isAuth) ?
                    <span></span> : 
                    <Link to={`/tipAndReview/upload/${Type}`}> 
                        <Button size='large' type="primary" ghost style={{ align: 'right' }}> 작성하기 </Button>
                    </Link>
                }
                </Col>
            </Row>
            <div style={{ width: '85%', margin: '0rem auto' }}>
            {TipOrReviews.length === 0 ?
                <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                <h2>No post yet...</h2>
                </div> :
                <div>
                <Row gutter={[32, 8]}>
                    {renderCards}
                </Row>
                </div>
            }
        </div>
        </div>
    )
}

export default TipAndReviewPage
