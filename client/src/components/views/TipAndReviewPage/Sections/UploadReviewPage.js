import React, { useEffect, useState } from 'react'
import QuillEditor from '../../../editor/QuillEditor';
import { Typography, Button, Form, message, Input, Rate, Select } from 'antd';
import axios from 'axios';
import { useSelector } from "react-redux";
import './TipAndReviewPage.css';

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
            template: downloadArr
        }
        axios.post('/api/template/getMyPageTemplates', variables)
            .then(response => {
                if(response.data.success) {
                    setTemplates(response.data.templates)
                } else {
                    alert('Failed to fetch template data')
                }
            })
        
        axios.post('/api/review/getReviews', variables)
        .then(response => {
            if (response.data.success) {
                setReviews(response.data.reviews)
            } else {
                alert('Couldnt get review`s lists')
            }
        })

    }, [])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onTemplateChange = (event) => {
        setTemplateValue(event.currentTarget.value)
    }

    const onRateChange = (value) => {
        setRateValue(value)
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
            return <Option value={index} key={index}>{template.title}</Option>
        }
    }))

    const onChange = (value) => {
        setTemplateValue(TemplateNames[value])
    }

    return (
        <div className="tipAndReview">
            <div className="form-body">
            <div style={{ textAlign: 'center' }}>
                <Title level={2} ><span className="tipAndReview-header">리뷰 작성하기</span></Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div className="content">
                    <p className="title" >제목</p>
                    <Input
                        onChange={onTitleChange}
                        value={TitleValue}
                        placeholder="제목을 입력하세요"
                        style={{height:'35px'}}
                    />
               </div>
               <div className="content">
                    <p className="title" >속지 이름</p>
                    {makeReviewList}
                    <Select
                        style={{ width: '100%',height:'35px' }}
                        placeholder="속지를 선택하세요"
                        onChange={onChange}
                    >
                        {renderOptions}
                    </Select>
                </div>
                <div style={{ display:'flex', marginBottom:"2%", alignItems:'center'}}>
                <span className="title" >평점: </span>&nbsp;&nbsp;&nbsp;&nbsp;
                <Rate tooltips={desc} onChange={onRateChange} value={RateValue} style={{fontSize:35}} />
                {RateValue ? <span className="ant-rate-text" style={{ color: '#DAA520' }}></span> : ''}
                </div>
                <br/>
                <p className="title" >내용</p>
                <QuillEditor
                    placeholder={"내용을 입력하세요"}
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
                        작성
                    </Button>
                </div>
            </Form>
        </div>
        </div>
    )
}

export default UploadReviewPage