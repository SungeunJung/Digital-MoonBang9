import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography, Rate, Pagination } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const { Title } = Typography
const { Meta } = Card;

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

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
    const [Count, setCount] = useState(0)
    const [Current, setCurrent] = useState(1)
    const [Limit, setLimit] = useState(6)

    useEffect(() => {

        axios.get('/api/review/getReviewsCount') 
            .then(response => {
                if (response.data.success) {
                    console.log("response.data.count:",response.data.count)
                    setCount(response.data.count)
                } else {
                    alert('Couldnt get review`s count')
                }
            })

        const variables = {
            skip: 0,
            limit: Limit,
        }

        getReviews(variables)
        
    }, [])

    const getReviews = (variables) => {
        axios.post('/api/review/getReviews', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.reviews)
                    setReviews(response.data.reviews)
                } else {
                    alert('Couldnt get review`s lists')
                }
            })
    }

    const onPageChange = (page) => {
        console.log('page:', page)
        setCurrent(page)
        
        let skip = Limit * (page - 1);
        console.log('skip:', skip)
        console.log('Limit:', Limit)
        const variables = {
            skip: skip,
            limit: Limit,
        }

        getReviews(variables)
    }


    const renderCards = (Reviews && Reviews.map((review, index) => {
        console.log(review._id)
        return <Col key={index} lg={8} md={12} xs={24}>
            <Card
                hoverable
                style={{ width: 250, marginTop: 16 }}
                actions={[
                    <a href={`/review/post/${review._id}`}>자세히보기</a>,
                ]}
            >
                <Meta
                    avatar={
                        review.writer.image?
                    <Avatar
                        src={`http://localhost:2000/${review.writer.image}`}
                        alt="image"
                    />:
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    
                    title={review.writer.name}
                    description={review.template}
                />
                <div >
                    <Rate tooltips={desc} value={review.rate} style={{ width: "100%" }} />
                    {review.rate ? <span className="ant-rate-text" style={{ color: "#DAA520" }}>
                        {desc[review.rate - 1]}</span> : ''}
                </div>
                <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: review.description }} />
                </div>
            </Card>
        </Col>
    }))

    return (
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>       
            <Row>
                <Col style={{width : '450px'}}>
                <strong><Link to="/tip" style={headerStyleOut}>
                    Tip</Link> <span style={headerStyleOn}>  /  </span>
                    <Link to="/review" style={headerStyleOn}>
                    Review</Link></strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                { (user.userData && !user.userData.isAuth) ?
                    <span></span> : 
                    <Link to="/review/upload"> 
                        <Button size='large' type="primary" ghost style={{ align: 'right' }}> 작성하기 </Button>
                    </Link>
                }
                </Col>
            </Row>
            <div style={{ width: '85%', margin: '0rem auto' }}>
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
            <div style ={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination defaultCurrent={1} defaultPageSize={6} total={Count} 
                current={Current} onChange={onPageChange} />
            </div>
        </div>
    )
}

export default ReviewPage