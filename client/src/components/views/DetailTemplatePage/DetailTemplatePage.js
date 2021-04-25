import axios from 'axios'
//import { response } from 'express'
import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import TemplateImage from './Sections/TemplateImage'
import TemplateInfo from './Sections/TemplateInfo'

function DetailTemplatePage(props) {

    const templateId = props.match.params.templateId
    const [Template, setTemplate] = useState([])

    useEffect(() => {
        axios.get(`/api/template/templates_by_id?id=${templateId}&type=single`)
            .then(response => {
                setTemplate(response.data[0])
            })
    }, [])

    return (
        <div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Template.title}</h1>
            </div>
            <br />

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    <TemplateImage detail={Template}/>
                </Col>
                <Col lg={12} xs={24}>
                    <TemplateInfo detail={Template}/>
                </Col>
            </Row>
        </div>
    )
}

export default DetailTemplatePage
