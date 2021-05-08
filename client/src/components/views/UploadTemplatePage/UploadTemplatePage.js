import React, { useState } from 'react';
import { Typography, Button, Form, Radio, Space, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import TemplateUpload from'../../utils/TemplateUpload';
import axios from 'axios';
//import { response } from 'express';

const { Title } = Typography;
const { TextArea } = Input;

const Categories = [
    { key:1, value: "다이어리" },
    { key:2, value: "플래너" },
    { key:3, value: "노트" },
    { key:4, value: "스티커" },
    { key:5, value: "라이프" },
    { key:6, value: "기타" },
]
const Detail_1 = [
    { key:1, value: "날짜형" },
    { key:2, value: "만년형" },
    { key:3, value: "일기장" },
]
const Detail_2 = [
    { key:1, value: "먼슬리" },
    { key:2, value: "위클리" },
    { key:3, value: "데일리" },
    { key:4, value: "업무" },
]
const Detail_3 = [
    { key:1, value: "줄" },
    { key:2, value: "무지" },
    { key:3, value: "모눈" },
    { key:4, value: "분할" },
    { key:5, value: "코넬" },
    { key:6, value: "단어장" },
    { key:7, value: "기타" },
]
const Detail_4 = [
    { key:1, value: "메모지" },
    { key:2, value: "캐릭터" },
    { key:3, value: "레터링" },
    { key:4, value: "도형" },
    { key:5, value: "일상" },
    { key:6, value: "기념일" },
    { key:7, value: "기타" },
]
const Detail_5 = [
    { key:1, value: "가계부" },
    { key:2, value: "운동" },
    { key:3, value: "독서" },
    { key:4, value: "여행" },
    { key:5, value: "기타" },
]
var Detail = Detail_1;

const Styles = [
    { key:1, value: "심플" },
    { key:2, value: "귀여운" },
    { key:3, value: "캐릭터" },
    { key:4, value: "빈티지" },
    { key:5, value: "레트로" },
    { key:6, value: "키치" },
    { key:7, value: "클래식" },
    { key:8, value: "일러스트" },
]


function UploadTemplatePage(props) {
    const [Images, setImages] = useState([])
    const [Files, setFiles] = useState([])
    const [TitleValue, setTitleValue] = useState("")
    const [DesignerValue, setDesignerValue] = useState("")
    const [RadioValue, setRadioValue] = useState(1)
    const [LinkValue, setLinkValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [CategoryValue, setCategoryValue] = useState(1)
    const [DetailValue, setDetailValue] = useState(1)
    const [StyleValue, setStyleValue] = useState(1)
    
    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }
    const onDesignerChange = (event) => {
        setDesignerValue(event.currentTarget.value)
    }
    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }
    const onUploadRadioChange = (event) => {
        setRadioValue(event.target.value)
        setLinkValue("")
        setFiles([])
    }
    const onLinkChange = (event) => {
        setLinkValue(event.currentTarget.value)
    }
    const onCategorySelectChange = (event) => {
        setCategoryValue(event.currentTarget.value)
        switch (event.currentTarget.value) {
            case '1': 
                Detail = Detail_1.slice();
                setDetailValue(1);
                break;
            case '2': 
                Detail = Detail_2.slice();
                setDetailValue(1);
                break;
            case '3': 
                Detail = Detail_3.slice();
                setDetailValue(1);
                break;
            case '4': 
                Detail = Detail_4.slice();
                setDetailValue(1);
                break; 
            case '5': 
                Detail = Detail_5.slice();
                setDetailValue(1);
                break; 
            default:
                break;
        }
    }
    const onDetailSelectChange = (event) => {
        setDetailValue(event.currentTarget.value)
    }
    const onStyleSelectChange = (event) => {
        setStyleValue(event.currentTarget.value)
    }
    const updateImages = (newImages) =>{
        console.log(newImages)
        setImages(newImages)
    }
    const updateFiles = (newFiles) =>{
        console.log(newFiles)
        setFiles(newFiles)
    }
    const onSubmit = (event) => {
        event.preventDefault()

        if(!TitleValue || !DesignerValue || !DescriptionValue || Images.length == 0) {
            return alert('Fill all the fields first!')
        }

        const variables = {
            writer: props.user.userData._id,
            nickname: props.user.userData.nickname,
            title: TitleValue,
            designer: DesignerValue,
            description: DescriptionValue,
            images: Images,
            uploadedFile: Files,
            uploadedUrl: LinkValue,
            category: CategoryValue,
            detail: DetailValue,
            styles: StyleValue,
        }

        axios.post('/api/template/uploadTemplate', variables)
            .then(response => {
                if(response.data.success) {
                    alert('Template Successfully Uploaded')
                    props.history.push('/')
                } else {
                    alert('Failed to upload Template')
                }
            })
    }

    

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>Upload Template</Title>
            </div>

            <Form onSubmit={onSubmit} >
                {/*DropZone*/}
                <FileUpload refreshFunction={updateImages}/>
                <br/>
                <br/>
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                />
                <br/>
                <br/>
                <label>Designer</label>
                <Input
                    onChange={onDesignerChange}
                    value={DesignerValue}
                />
                <div>
                <br/>
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={DescriptionValue}
                />
                </div>
                <br/>
                <br/>
                <Radio.Group onChange={onUploadRadioChange} value={RadioValue}>
                    <Space direction="vertical">
                        <Radio value={1}>File</Radio>
                        <Radio value={2}>Link</Radio>
                    </Space>
                </Radio.Group>

                {RadioValue === 1 ? 
                    <TemplateUpload refreshFunction={updateFiles}/> : 
                    <div>
                        <Input placeholder="Link Here" 
                            onChange={onLinkChange}
                            value={LinkValue}/>
                    </div>
                }
                <br/>
                <br/>
                <span style={{ marginRight: '15px' }}>
                <label>Category </label>
                <select onChange={onCategorySelectChange}>
                    {Categories.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                </span>
                <span style={{ marginRight: '15px' }}>
                <label> Detail </label>
                <select onChange={onDetailSelectChange}>
                    {Detail.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                </span>
                <br />
                <br />
                <label>Style </label>
                <select onChange={onStyleSelectChange}>
                    {Styles.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br/>
                <br/>
                <Button
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default UploadTemplatePage
