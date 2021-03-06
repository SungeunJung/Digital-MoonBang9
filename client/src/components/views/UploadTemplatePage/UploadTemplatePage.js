import React, { useState } from 'react';
import { Typography, Button, Form, Radio, Space, Input, Row, Col, message } from 'antd';
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
            return message.warning('???????????? ??????????????????.')
        }
        else if(!TitleValue || blank_t) {
            return message.warning('????????? ??????????????????.')
        }
        else if(!DesignerValue || blank_ds) {
            return message.warning('??????????????? ??????????????????.')
        }
        else if(!DescriptionValue || blank_d) {
            return message.warning('????????? ??????????????????.')
        }
        else if(Files.length == 0 && !LinkValue) {
            return message.warning('?????? ?????? ????????? ??????????????????.')
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
                    message.success('???????????? ?????????????????????.')
                    props.history.push('/')
                } else {
                    message.error('????????? ???????????? ??????????????????.')
                }
            })
    }

    return (
        <div className="tipAndReview"> 
            <div className="form-body">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
                <Title level={2}><span className="tipAndReview-header">?????? ????????????</span></Title>
            </div>
            <Form onSubmit={onSubmit} >
                {/*DropZone*/}
                <FileUpload refreshFunction={updateImages}/>
                <br/>
                <br/>
                <label><span>??????</span></label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                    style={{marginTop:'8px'}}
                />
                <br/>
                <br/>
                <label><span>????????????</span></label>
                <Input
                    onChange={onDesignerChange}
                    value={DesignerValue}
                    style={{marginTop:'8px'}}
                />
                <div>
                <br/>
                <label><span>??????</span></label>
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
                        <Radio value={1}>??????</Radio>
                        <Radio value={2}>??????</Radio>
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
                <Row gutter={[20, 20]}>
                    <Col span={3} lg={8} xs={24}>
                        <span style={{ marginRight: '15px' }}>                  
                        <label><span>????????????</span></label> &nbsp;
                        <select onChange={onCategorySelectChange}>
                            {Categories.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        </span>
                    </Col>
                    <Col span={3} lg={8} xs={24}>
                        <span style={{ marginRight: '15px' }}>
                        <label><span>?????? ????????????</span></label> &nbsp;
                        <select onChange={onDetailSelectChange}>
                            {Detail.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        </span>
                    </Col>
                    <Col span={3} lg={8} xs={24}>
                        <label><span>?????????</span></label> &nbsp;
                        <select onChange={onStyleSelectChange}>
                            {Styles.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <br/>
                <br/>
                <div style={{textAlign:'center', marginTop:'2%', marginBottom:'30px'}}>
                <Button
                    onClick={onSubmit}
                >
                    ??????
                </Button>
                </div>
            </Form>
        </div>
        </div>
    )
}

export default UploadTemplatePage
