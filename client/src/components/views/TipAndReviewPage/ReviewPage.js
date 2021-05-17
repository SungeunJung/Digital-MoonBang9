import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography } from 'antd';
import axios from 'axios';
import { SettingOutlined, EllipsisOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
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

function ReviewPage() {
    const user = useSelector(state => state.user);

    const [Reviews, setReviews] = useState([])

    useEffect(() => {
        axios.get('/api/review/getReviews')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.reviews)
                    setReviews(response.data.reviews)
                } else {
                    alert('Couldnt get review`s lists')
                }
            })
    }, [])

    const renderCards = (Reviews && Reviews.map((review, index) => {
        console.log(review._id)
        return <Col key={index} lg={8} md={12} xs={24}>
            <Card
                hoverable
                style={{ width: 250, marginTop: 16 }}
                actions={[
                    <SettingOutlined />,
                    <EditOutlined />,
                    <a href={`/tip/post/${review._id}`}> <EllipsisOutlined /></a>,
                ]}
            >
                <Meta
                    avatar={
                        review.writer.image?
                    <Avatar
                        src={review.writer.image}
                        alt="image"
                    />:
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    title={review.writer.name}
                    description="클루리스 다이어리"
                />
                <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: review.content }} />
                </div>
            </Card>
        </Col>
    }))

    return (
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>       
            <Row>
                <Col style={{width : '450px'}}>
                <strong><Link to="/board/tip" style={headerStyleOut}>
                    Tip</Link> <span style={headerStyleOn}>  /  </span>
                    <Link to="/board/review" style={headerStyleOn}>
                    Review</Link></strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                { (user.userData && !user.userData.isAuth) ?
                    <span></span> : 
                    <Link to="/board/review/create"> 
                        <Button size='large' type="primary" ghost style={{ align: 'right' }}> 작성하기 </Button>
                    </Link>
                }
                </Col>
            </Row>
            <div style={{ width: '85%', margin: '0rem auto' }}>
            {/*<Title level={2}> Board(Tip) Lists </Title>*/}
            {Reviews.length === 0 ?
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

export default ReviewPage