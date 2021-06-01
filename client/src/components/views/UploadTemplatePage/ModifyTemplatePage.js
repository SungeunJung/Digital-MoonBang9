import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, Radio, Space, Input, message, Row, Col } from 'antd';
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

        let copy_t = TitleValue
        let blank_t = false
        if(copy_t.replace(/ /g, '') === '') {
            blank_t = true
        }
        let copy_ds = DesignerValue
        let blank_ds = false
        if(copy_ds.replace(/ /g, '') === '') {
            blank_ds = true
        }
        let copy_d = DescriptionValue
        let blank_d = false
        if(copy_d.replace(/ /g, '').replace(/\n/g, '') === '') {
            blank_d = true
        }
        
        if(Images.length == 0) {
            return message.warning('이미지를 등록해주세요.')
        }
        else if(!TitleValue || blank_t) {
            return message.warning('제목을 입력해주세요.')
        }
        else if(!DesignerValue || blank_ds) {
            return message.warning('디자이너를 입력해주세요.')
        }
        else if(!DescriptionValue || blank_d) {
            return message.warning('설명을 작성해주세요.')
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
                    message.success('수정되었습니다.')
                    setTimeout(() => {
                        window.location.href=`/template/${templateId}`
                    }, 150);
                } else {
                    message.error('수정에 실패했습니다.');
                }
            })
    }

    const onCancel = (events) => {
        window.location.href=`/template/${templateId}`
    }

    return (
        <div className="tipAndReview">
            <div className="form-body">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
                <Title level={2}><span className="tipAndReview-header">속지 등록하기</span></Title>
            </div>
            <Form onSubmit={onSubmit} >
                {/*DropZone*/}
                <EditFileUpload refreshFunction={updateImages} detail={Template}/>
                <br/>
                <br/>
                <label><span>제목</span></label>
                <Input
                    defaultValue={window.localStorage.getItem("title")}
                    onChange={onTitleChange}
                    style={{marginTop:'8px'}}
                />
                <br/>
                <br/>
                <label><span>디자이너</span></label>
                <Input
                    defaultValue={window.localStorage.getItem("designer")}
                    onChange={onDesignerChange}
                    style={{marginTop:'8px'}}
                />
                <div>
                <br/>
                <label><span>설명</span></label>
                <TextArea
                    defaultValue={window.localStorage.getItem("description")}
                    onChange={onDescriptionChange}
                    style={{marginTop:'8px'}}
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
                <Row gutter={[20, 20]}>
                    <Col span={3} lg={8} xs={24}>
                        <span style={{ marginRight: '15px' }}>                  
                        <label><span>카테고리</span></label> &nbsp;
                        <select defaultValue={Number(window.localStorage.getItem("category"))} onChange={onCategorySelectChange}>
                            {Categories.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        </span>
                    </Col>
                    <Col span={3} lg={8} xs={24}>
                        <span style={{ marginRight: '15px' }}>
                        <label><span>세부 카테고리</span></label> &nbsp;
                        <select value={DetailValue} onChange={onDetailSelectChange}>
                            {Detail.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        </span>
                    </Col>
                    <Col span={3} lg={8} xs={24}>
                        <label><span>스타일</span></label> &nbsp;
                        <select defaultValue={Number(window.localStorage.getItem("style"))} onChange={onStyleSelectChange}>
                            {Styles.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <br/>
                <br/>
                <div style={{textAlign:'center', marginTop:'2%', marginBottom:'30px'}}>
                    <Button onClick={onSubmit}>
                        저장
                    </Button>
                    &nbsp;&nbsp;
                    <Button onClick={onCancel}>
                        취소
                    </Button>
                </div>
            </Form>
        </div>
        </div>
        
    )
}

export default ModifyTemplatePage
