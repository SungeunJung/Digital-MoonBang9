import axios from 'axios'
//import { response } from 'express'
import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import TemplateImage from './Sections/TemplateImage'
import TemplateInfo from './Sections/TemplateInfo'
import Comments from './Sections/Comments'

function DetailTemplatePage(props) {

    const templateId = props.match.params.templateId 
    const [Template, setTemplate] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [HistoryCount, setHistoryCount] = useState(0)
    const templateVariable = {
        templateId: templateId
    }
    useEffect(() => {
        
        axios.get(`/api/template/templates_by_id?id=${templateId}&type=single`)
            .then(response => {
                setTemplate(response.data[0])
            })

        axios.post('/api/comment/getComments', templateVariable)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments',response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
            })
        axios.post('/api/users/addHistory', templateVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.count)
                    if(response.data.count>20) {
                        console.log('here')
                        axios.post('/api/users/deleteHistory')
                        .then(response => {
                            if (response.data.success) {
                                console.log('success')
                            } else {
                                console.log("Failed to delete history");
                            }
                        })
                    }
                } else {
                    console.log("Failed to add history");
                }
            })
        
    }, [])

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

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
                    <TemplateInfo detail={Template} id={templateId}/>
                    <br />
                    <br />
                    
                </Col>
            </Row>

            <Comments CommentLists={CommentLists} postId={Template._id} refreshFunction={updateComment}/>
        </div>
    )
}

export default DetailTemplatePage
