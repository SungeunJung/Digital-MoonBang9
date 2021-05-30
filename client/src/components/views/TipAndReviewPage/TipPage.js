import React, { useState, useEffect }  from 'react' 
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography, Pagination, message } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import './TipPage.css';

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

function TipPage() {
    const user = useSelector(state => state.user);

    const [Tips, setTips] = useState([])
    const [Count, setCount] = useState(0)
    const [Current, setCurrent] = useState(1)
    const [Limit, setLimit] = useState(9)

    useEffect(() => {
        axios.get('/api/tip/getTipsCount') 
        .then(response => {
            if (response.data.success) {
                setCount(response.data.count)
            } else {
                console.log('Couldnt get tip`s count')
            }
        })

        const variables = {
            skip: 0,
            limit: Limit,
        }

        getTips(variables)
        
    }, [])

    const getTips = (variables) => { 
        axios.post('/api/tip/getTips', variables)
        .then(response => {
            if(response.data.success) {
                setTips(response.data.tips)
            } else {
                message.error('팁 게시물 목록을 불러올 수 없습니다.')
            }
        })
    }

    const onPageChange = (page) => {
        setCurrent(page)

        let skip = Limit * (page - 1);

        const variables = {
            skip: skip,
            limit: Limit,
        }

        getTips(variables)
    }

    const renderCards = (Tips && Tips.map((tip, index) => {
        return <Col key={index} lg={8} md={12} xs={24}>
            <NavLink to = {`/tip/post/${tip._id}`}>
            <Card
                type="inner"
                
                hoverable={true}
                className="Tip-card"
            ><Meta 
                    avatar={
                        tip.writer.image?
                    <Avatar
                        src={process.env.REACT_APP_S3_URL+`userProfile/${tip.writer.image}`}
                        alt="image"
                    />:
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    title={tip.writer.nickname}
                />
                <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: tip.description }} />
                </div>
                <br/>
                <b>{tip.title}</b>
                
            </Card>
            </NavLink>
        </Col>
    }))

    return (
        <div className="tipPage">       
            <Row style={{marginBottom:'5%'}}>
                <Col className="Tip-halfCol-1">
                    <strong>
                        <Link to="/tip" className="Tip-headerStyleOn">Tip</Link> 
                        <span className="Tip-headerStyleOn">  /  </span>
                        <Link to="/review" className="Tip-headerStyleOut">Review</Link>
                    </strong>
                </Col>
                <Col align="right" className="Tip-halfCol-2">
                    {(user.userData && !user.userData.isAuth) ?
                        <span></span> : 
                        <Link to="/tip/upload"> 
                            <Button size='large' type="primary" ghost className="Notice-rightAlign"> 
                                작성하기 
                            </Button>
                        </Link>
                    }
                </Col>
            </Row>
            <div className="Tip-cards">
                {Tips.length === 0 ?
                    <div className="Tip-noCards">
                    <h2>작성된 팁이 없습니다.</h2>
                    </div> :
                    <div>
                    <Row gutter={[32, 8]}>
                        {renderCards}
                    </Row>
                    </div>
                }
            </div>
            <div className="Tip-pagination">
                <Pagination defaultCurrent={1} defaultPageSize={9} total={Count} 
                current={Current} onChange={onPageChange} />
            </div>
        </div>
    )
}

export default TipPage