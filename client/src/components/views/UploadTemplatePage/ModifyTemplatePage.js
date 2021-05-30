import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, Radio, Space, Input, message } from 'antd';
import EditFileUpload from '../../utils/EditFileUpload';
import TemplateUpload from'../../utils/TemplateUpload';
import axios from 'axios';
import { Categories, Detail_1, Detail_2, Detail_3, Detail_4, Detail_5, Detail_6, 
    Styles } from './Sections/Datas';

const { Title } = Typography;
const { TextArea } = Input;

var Detail = Detail_1;

function ModifyTemplatePage(props) {
    const templateId = props.match.params.templateId
    const [Template, setTemplate] = useState([])
    const [Images, setImages] = useState([])
    const [Files, setFiles] = useState([])
    const [TitleValue, setTitleValue] = useState(window.localStorage.getItem("title"))
    const [DesignerValue, setDesignerValue] = useState(window.localStorage.getItem("designer"))
    const [RadioValue, setRadioValue] = useState(1)
    const [LinkValue, setLinkValue] = useState(window.localStorage.getItem("link"))
    const [DescriptionValue, setDescriptionValue] = useState(window.localStorage.getItem("description"))
    const [CategoryValue, setCategoryValue] = useState(window.localStorage.getItem("category"))
    const [DetailValue, setDetailValue] = useState(window.localStorage.getItem("detail"))
    const [StyleValue, setStyleValue] = useState(Number(window.localStorage.getItem("style")))

    useEffect(() => {
        axios.get(`/api/template/templates_by_id?id=${templateId}&type=single`)
            .then(response => {
                setTemplate(response.data[0])
                setImages(response.data[0].images)
                          
            })

        setFiles(window.localStorage.getItem("file"))

        switch (window.localStorage.getItem("category")) {
            case '1': 
                Detail = Detail_1.slice();
                break;
            case '2': 
                Detail = Detail_2.slice();
                break;
            case '3': 
                Detail = Detail_3.slice();
                break;
            case '4': 
                Detail = Detail_4.slice();
                break; 
            case '5': 
                Detail = Detail_5.slice();
                break; 
            case '6': 
                Detail = Detail_6.slice();
                break; 
            default:
                break;
        }
    }, [])

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
                if(window.localStorage.getItem("category") === "1") 
                    setDetailValue(window.localStorage.getItem("detail"))
                else
                    setDetailValue(1)
                break;
            case '2': 
                Detail = Detail_2.slice();
                if(window.localStorage.getItem("category") === "2") 
                    setDetailValue(window.localStorage.getItem("detail"))
                else
                    setDetailValue(1)
                break;
            case '3': 
                Detail = Detail_3.slice();
                if(window.localStorage.getItem("category") === "3") 
                    setDetailValue(window.localStorage.getItem("detail"))
                else
                    setDetailValue(1)
                break;
            case '4': 
                Detail = Detail_4.slice();
                if(window.localStorage.getItem("category") === "4") 
                    setDetailValue(window.localStorage.getItem("detail"))
                else
                    setDetailValue(1)
                break; 
            case '5': 
                Detail = Detail_5.slice();
                if(window.localStorage.getItem("category") === "5") 
                    setDetailValue(window.localStorage.getItem("detail"))
                else
                    setDetailValue(1)
                break; 
            case '6': 
                Detail = Detail_6.slice();
                if(window.localStorage.getItem("category") === "6") 
                    setDetailValue(window.localStorage.getItem("detail"))
                else 
                    setDetailValue(1)
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
        setImages(newImages)
    }
    const updateFiles = (newFiles) =>{
        setFiles(newFiles)
    }
    const onSubmit = (event) => {
        event.preventDefault()

        if(!TitleValue || !DesignerValue || !DescriptionValue || Images.length == 0) {
            return alert('Fill all the fields first!')
        }
        
        const body = {
            templateId: templateId,
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

        axios.post('/api/template/editTemplate', body)
            .then(response => {
                if(response.data.success) {
                    message.success('Template Successfully Edited.')
                    setTimeout(() => {
                        window.location.href=`/template/${templateId}`
                    }, 150);
                } else {
                    message.error('Failed to edit Template');
                }
            })
    }

    const onCancel = (events) => {
        window.location.href=`/template/${templateId}`
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>Edit Template</Title>
            </div>

            <Form onSubmit={onSubmit} >
                {/*DropZone*/}
                <EditFileUpload refreshFunction={updateImages} detail={Template}/>
                <br/>
                <br/>
                <label>Title</label>
                <Input
                    defaultValue={window.localStorage.getItem("title")}
                />
                <br/>
                <br/>
                <label>Designer</label>
                <Input
                    defaultValue={window.localStorage.getItem("designer")}
                    onChange={onDesignerChange}
                />
                <div>
                <br/>
                <label>Description</label>
                <TextArea
                    defaultValue={window.localStorage.getItem("description")}
                    onChange={onDescriptionChange}
                />
                </div>
                <br/>
                <br/>
                {window.localStorage.getItem("link") === "" ?
                        <span>현재 저장된 파일 : <span style={{color : 'darkblue'}}>
                            {window.localStorage.getItem("file")}</span></span> :
                        <span>현재 저장된 링크 : <span style={{color : 'darkblue'}}>
                            {window.localStorage.getItem("link")}</span></span>
                }
                <br/>
                <Radio.Group 
                    onChange={onUploadRadioChange} value={RadioValue}>
                    <Space direction="vertical">
                        <Radio value={1}>File</Radio>
                        <Radio value={2}>Link</Radio>
                    </Space>
                </Radio.Group>

                {RadioValue === 1 ? 
                    <TemplateUpload refreshFunction={updateFiles}/>
                    : 
                    <div>
                        <Input 
                            placeholder="Link Here" 
                            onChange={onLinkChange}
                            value={LinkValue}
                        />
                    </div>
                }
                {RadioValue === 1 ? 
                        <span>수정될 파일(링크) : <span style={{color : 'darkred'}}>
                            {Files[Files.length-1]==='f'? "":Files[Files.length-1]}</span></span>  :
                        <span>수정될 파일(링크) : <span style={{color : 'darkred'}}>
                            {LinkValue}</span></span>
                }
                <br/>
                <span style={{color : "lightgray"}}>(수정하지 않으면 현재 저장된 파일(링크) 그대로 저장됩니다.)</span>
                <br/>
                <br/>
                <span style={{ marginRight: '15px' }}>
                <label>Category </label>
                <select defaultValue={Number(window.localStorage.getItem("category"))} onChange={onCategorySelectChange}>
                    {Categories.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                </span>
                <span style={{ marginRight: '15px' }}>
                <label> Detail </label>
                <select value={DetailValue} onChange={onDetailSelectChange}>
                    {Detail.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                </span>
                <br />
                <br />
                <label>Style </label>
                <select value={Number(window.localStorage.getItem("style"))} onChange={onStyleSelectChange}>
                    {Styles.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br/>
                <br/>
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Button onClick={onCancel}>
                        취소하기
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                        onClick={onSubmit}>
                        수정하기
                    </Button>
                </div>
            </Form>
        </div>
        
    )
}

export default ModifyTemplatePage
