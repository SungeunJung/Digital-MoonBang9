import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Avatar, Typography } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EllipsisOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
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

    useEffect(() => {
        axios.get('/api/tip/getTips')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.tips)
                    setTips(response.data.tips)
                } else {
                    alert('Couldnt get tip`s lists')
                }
            })
    }, [])

    const renderCards = (Tips && Tips.map((tip, index) => {
        console.log(tip._id)
        return <Col key={index} lg={8} md={12} xs={24}>
            <Card
                hoverable={true}
                style={{ width: 250, marginTop: 16 }}
                actions={
                    [<a href={`/tip/post/${tip._id}`}> 자세히 보기 </a>]}
            >
                <Meta 
                    avatar={
                        tip.writer.image?
                    <Avatar
                        src={process.env.REACT_APP_S3_URL+`userProfile/${tip.writer.image}`}
                        alt="image"
                    />:
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    }
                    title={tip.writer.name}
                    description={<span>&#60;{tip.title}&#62;</span>}
                />
                <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: tip.description }} /></div>
            </Card>
        </Col>
    }))

    return (
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>       
            <Row>
                <Col style={{width : '450px'}}>
                <strong><Link to="/tip" style={headerStyleOn}>
                    Tip</Link> <span style={headerStyleOn}>  /  </span>
                    <Link to="/review" style={headerStyleOut}>
                    Review</Link></strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                { (user.userData && !user.userData.isAuth) ?
                    <span></span> : 
                    <Link to="/tip/upload"> 
                        <Button size='large' type="primary" ghost style={{ align: 'right' }}> 작성하기 </Button>
                    </Link>
                }
                </Col>
            </Row>
            <div style={{ width: '85%', margin: '0rem auto' }}>
            {/*<Title level={2}> Board(Tip) Lists </Title>*/}
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
        </div>
    )
}

export default TipPage