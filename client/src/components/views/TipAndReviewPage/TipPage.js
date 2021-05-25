import React, { useState, useEffect }  from 'react'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography, Pagination } from 'antd';
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
                console.log("response.data.count:",response.data.count)
                setCount(response.data.count)
            } else {
                alert('Couldnt get tip`s count')
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
                console.log(response.data.tips)
                setTips(response.data.tips)
            } else {
                alert('Couldnt get tip`s lists')
            }
        })
    }

    const onPageChange = (page) => {
        console.log('page:', page)
        setCurrent(page)

        let skip = Limit * (page - 1);

        const variables = {
            skip: skip,
            limit: Limit,
        }

        getTips(variables)
    }

    const renderCards = (Tips && Tips.map((tip, index) => {
        console.log(tip._id)
        return <Col key={index} lg={8} md={12} xs={24}>
            <NavLink to = {`/tip/post/${tip._id}`}>
            <Card
                type="inner"
                
                hoverable={true}
                style={{ width: 250, marginTop: 16 }}
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
                    //description={tip.writer.nickname}
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
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>       
            <Row>
                <Col style={{width : '450px'}}>
                    <strong>
                        <Link to="/tip" style={headerStyleOn}>Tip</Link> 
                        <span style={headerStyleOn}>  /  </span>
                        <Link to="/review" style={headerStyleOut}>Review</Link>
                    </strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                    {(user.userData && !user.userData.isAuth) ?
                        <span></span> : 
                        <Link to="/tip/upload"> 
                            <Button size='large' type="primary" ghost style={{ align: 'right' }}> 작성하기 </Button>
                        </Link>
                    }
                </Col>
            </Row>
            <div style={{ width: '85%', margin: '0rem auto' }}>
                {Tips.length === 0 ?
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
                <Pagination defaultCurrent={1} defaultPageSize={9} total={Count} 
                current={Current} onChange={onPageChange} />
            </div>
        </div>
    )
}

export default TipPage