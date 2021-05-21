import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Avatar, Col, Typography, Row, Button, Table } from 'antd';
import { SettingOutlined, EllipsisOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
const { Title } = Typography
const { Meta } = Card;
const { Column } = Table;

const columns = [
    {
        title: 'No.',
        dataIndex: 'no', 
    },
    {
        title: 'Title',
        dataIndex: 'title',
        render: text => <a>{}</a>,
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
  ];



function NoticePage() {

    const user = useSelector(state => state.user);
    const [Notices, setNotices] = useState([])
    const data = [];

    useEffect(() => {
        axios.get('/api/notice/getNotices')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.notices)
                    setNotices(response.data.notices)
                } else {
                    alert('Couldnt get notice`s lists')
                }
            })

    }, [])

    
    const renderCards = (Notices && Notices.map((notice, index) => {
        console.log(notice._id)
        
        data.push({
        key: index,
        no: index,
        title: `${notice.title}`,
        name: "운영자",
        date: `${notice.updatedAt}`,
        id: `${notice._id}`
        })
    }))   

    return (
        <div style={{ maxWidth: '900px', margin: '4rem auto'}}>
            <Row>
                <Col style={{width : '450px'}}>
                    <strong><p style={{color : 'black', fontSize: "28px"}}> Notice </p></strong>
                </Col>
                <Col align="right" style={{ width : '450px' }}>
                { (user.userData && !user.userData.isAdmin) ? //관리자면 isAdmin이 true임.
                    <span></span> : 
                    <Link to="/notice/upload"> 
                        <Button size='large' type="primary" ghost style={{ align: 'right' }}> 공지글 쓰기 </Button>
                    </Link>
                }
                </Col>
            </Row>
            <hr />
            {Notices.length === 0 ?
                <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                <h2>No post yet...</h2>
                </div> :
                <div>
                    <Table columns={columns} dataSource={data}> 
                        <Column title="No." dataIndex="no" key="no" />
                        <Column title="Title" dataIndex="title" key="title" />
                        
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Date" dataIndex="date" key="date" />
                    </Table>
                </div>
            }
        </div>
    )
}

export default NoticePage