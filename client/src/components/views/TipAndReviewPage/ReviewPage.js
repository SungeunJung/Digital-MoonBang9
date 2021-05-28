import React, { useState, useEffect }  from 'react' 
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography, Rate, Pagination } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import './ReviewPage.css';

const { Title } = Typography
const { Meta } = Card;

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function ReviewPage() {
    const user = useSelector(state => state.user);

    const [Reviews, setReviews] = useState([])
    const [Count, setCount] = useState(0)
    const [Current, setCurrent] = useState(1)
    const [Limit, setLimit] = useState(9)

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
            <NavLink to = {`/review/post/${review._id}`}>
            <Card
                hoverable
                className="Review-card"
            >
                <Meta
                    avatar={
                        review.writer.image?
                    <Avatar
                        src={process.env.REACT_APP_S3_URL+`userProfile/${review.writer.image}`}
                        alt="image"
                    />:
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    
                    title={review.writer.name}
                    description={review.template}
                />
                <div >
                    <Rate value={review.rate} className="Review-rate" disabled />
                    {review.rate ? <span className="ant-rate-text" style={{ color: "#DAA520" }}>
                        {desc[review.rate - 1]}</span> : ''}
                </div>
                <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: review.description }} />
                </div>
            </Card>
            </NavLink>
        </Col>
    }))

    return (
        <div className="reviewPage">       
            <Row>
                <Col className="Review-halfCol-1">
                <strong><Link to="/tip" className="Review-headerStyleOut">
                    Tip</Link> <span className="Review-headerStyleOut">  /  </span>
                    <Link to="/review" className="Review-headerStyleOn">
                    Review</Link></strong>
                </Col>
                <Col align="right" className="Review-halfCol-2">
                { (user.userData && !user.userData.isAuth) ?
                    <span></span> : 
                    <Link to="/review/upload"> 
                        <Button size='large' type="primary" ghost className="Review-rightAlign"> 
                            작성하기 
                        </Button>
                    </Link>
                }
                </Col>
            </Row>
            <div className="Review-cards">
                {Reviews.length === 0 ?
                    <div className="Review-noCards">
                    <h2>작성된 리뷰가 없습니다.</h2>
                    </div> :
                    <div>
                    <Row gutter={[32, 8]}>
                        {renderCards}
                    </Row>
                    </div>
                }
            </div>
            <div className="Review-pagination">
                <Pagination defaultCurrent={1} defaultPageSize={9} total={Count} 
                current={Current} onChange={onPageChange} />
            </div>
        </div>
    )
}

export default ReviewPage