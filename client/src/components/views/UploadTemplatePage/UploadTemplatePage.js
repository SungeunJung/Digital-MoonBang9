import React, { useState } from 'react';
import { Typography, Button, Form, Radio, Space, Input, Row, Col } from 'antd';
import FileUpload from '../../utils/FileUpload';
import TemplateUpload from'../../utils/TemplateUpload';
import axios from 'axios';
import { 
    Categories, Detail_1, Detail_2, Detail_3, Detail_4, Detail_5, Detail_6, Styles 
} from './Sections/Datas';
import './UploadTemplatePage.css';
//import { color } from '../../../utils/colors'

const { Title } = Typography;
const { TextArea } = Input;

var Detail = Detail_1;

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
            case '6': 
                Detail = Detail_6.slice();
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
        setImages(newImages)
    }
    const updateFiles = (newFiles) =>{
        console.log(newFiles)
        setFiles(newFiles)
    }
    const onSubmit = (event) => {
        event.preventDefault()

        if(!TitleValue || !DesignerValue || !DescriptionValue || Images.length == 0
            || !(Files && LinkValue)) {
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
        <div className="uploadPage">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
                <Title level={2}>속지 등록하기</Title>
            </div>

            <Form onSubmit={onSubmit} >
                {/*DropZone*/}
                <FileUpload refreshFunction={updateImages}/>
                <br/>
                <br/>
                <label><span>제목</span></label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                    style={{marginTop:'8px'}}
                />
                <br/>
                <br/>
                <label><span>디자이너</span></label>
                <Input
                    onChange={onDesignerChange}
                    value={DesignerValue}
                    style={{marginTop:'8px'}}
                />
                <div>
                <br/>
                <label><span>설명</span></label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={DescriptionValue}
                    style={{marginTop:'8px'}}
                />
                </div>
                <br/>
                <br/>
                <Radio.Group onChange={onUploadRadioChange} value={RadioValue}>
                    <Space direction="vertical">
                        <Radio value={1}>파일</Radio>
                        <Radio value={2}>링크</Radio>
                    </Space>
                </Radio.Group>

                <br/>
                <br/>
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
                <br/>
                <Row gutter={[20, 20]}>
                    <Col span={3} lg={8} xs={24}>
                        <span style={{ marginRight: '15px' }}>                  
                        <label><span>카테고리</span></label> &nbsp;
                        <select onChange={onCategorySelectChange}>
                            {Categories.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        </span>
                    </Col>
                    <Col span={3} lg={8} xs={24}>
                        <span style={{ marginRight: '15px' }}>
                        <label><span>세부 카테고리</span></label> &nbsp;
                        <select onChange={onDetailSelectChange}>
                            {Detail.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        </span>
                    </Col>
                    <Col span={3} lg={8} xs={24}>
                        <label><span>스타일</span></label> &nbsp;
                        <select onChange={onStyleSelectChange}>
                            {Styles.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <br/>
                <br/>
                <div style={{textAlign:'center', marginTop:'5%'}}>
                <Button
                    onClick={onSubmit}
                >
                    작성
                </Button>
                </div>
            </Form>
        </div>
    )
}

export default UploadTemplatePage
