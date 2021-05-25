import React, { useEffect, useState } from 'react'
import QuillEditor from '../../../editor/QuillEditor';
import { Typography, Button, Form, message, Input, Rate, Select } from 'antd';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Option } = Select;
const { Title } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function UploadReviewPage(props) {
    const user = useSelector(state => state.user);

    const [Reviews, setReviews] = useState([])
    const [ReviewNames, setReviewNames] = useState([])
    const [TitleValue, setTitleValue] = useState("")
    const [TemplateValue, setTemplateValue] = useState("")
    const [Templates, setTemplates] = useState([])
    const [TemplateNames, setTemplateNames] = useState([])
    const [RateValue, setRateValue] = useState(3)
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        
        let downloadArr = []
        if (user.userData && user.userData.download) {
            if (user.userData.download.length > 0) {
                user.userData.download.forEach(item => {
                    downloadArr.push(item.id)
                })
            }
        }
        let variables = {
            skip: 0,
            limit: user.userData.download.length,
            download: downloadArr
        }
        axios.post('/api/template/getMyDownload', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.templates)
                    setTemplates(response.data.templates)
                } else {
                    alert('Failed to fetch template data')
                }
            })
        
        axios.post('/api/review/getReviews', variables)
        .then(response => {
            if (response.data.success) {
                console.log(response.data.reviews)
                setReviews(response.data.reviews)
            } else {
                alert('Couldnt get review`s lists')
            }
        })

    }, [])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
        console.log(TitleValue)
    }

    const onTemplateChange = (event) => {
        setTemplateValue(event.currentTarget.value)
        console.log(TemplateValue)
    }

    const onRateChange = (value) => {
        setRateValue(value)
        console.log(RateValue)
      };

    const onEditorChange = (value) => {
        setDescription(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setDescription("");

        //if(!TitleValue || !description || !TemplateValue ) {
        //    return alert('Fill all the fields first!')
        //}

        const variables = {
            title: TitleValue,
            template: TemplateValue,
            rate: RateValue,
            description: description,
            writer: user.userData._id
        }
            axios.post('/api/review/createPost', variables)
            .then(response => {
                if (response) {
                    message.success('Post Created!');
                    setTimeout(() => {
                        props.history.push("/review")
                    }, 2000);
                }
            })
    }
    const makeReviewList = (Reviews && Reviews.map((review, index) => {//리뷰에 있는 템플릿이면 push안해줌
        ReviewNames.push(review.template)
    }))

    const renderOptions = (Templates && Templates.map((template, index) => {//리뷰에 있는 템플릿이면 push안해줌   
        if(!ReviewNames.includes(template.title)){
            TemplateNames.push(template.title)
            return <Option value={index}>{template.title}</Option>
        }
    }))

    const onChange = (value) => {
        setTemplateValue(TemplateNames[value])
        console.log(`selected ${value}`,TemplateNames[value]);
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > 리뷰 작성하기</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Title</p>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                />
                <br/>
                <br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Template Name</p>
                {makeReviewList}
                <Select
                    style={{ width: 700 }}
                    placeholder="Select a template"
                    onChange={onChange}
                >
                    {renderOptions}
                </Select>
                <br/>
                <br/>
                <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '14px' }} >Rate: </span>&nbsp;&nbsp;&nbsp;&nbsp;
                <Rate tooltips={desc} onChange={onRateChange} value={RateValue} />
                {RateValue ? <span className="ant-rate-text" style={{ color: '#DAA520' }}>
                    {desc[RateValue - 1]}</span> : ''}
                </div>
                <br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Description</p>
                <QuillEditor
                    placeholder={"Start Posting Something"}
                    onEditorChange={onEditorChange}
                    onFilesChange={onFilesChange}
                />
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Button
                        size="large"
                        htmlType="submit"
                        className=""
                        onClick={onSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default UploadReviewPage