import React, { useEffect, useState } from 'react'
import QuillEditor from '../../../editor/QuillEditor';
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;

function UploadNoticePage(props) {
    const user = useSelector(state => state.user);

    const [TitleValue, setTitleValue] = useState("")
    const [SummaryValue, setSummaryValue] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
        console.log(TitleValue)
    }

    const onSummaryChange = (event) => {
        setSummaryValue(event.currentTarget.value)
        console.log(SummaryValue)
    }

    const onEditorChange = (value) => {
        setDescription(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setDescription("");

        let copy_t = TitleValue
        let blank_t = false
        if(copy_t.replace(/ /g, '') === '') {
            blank_t = true
        }
        let copy_s = SummaryValue
        let blank_s = false
        if(copy_s.replace(/ /g, '') === '') {
            blank_s = true
        }
        let copy_d = description
        let blank_d = false
        while(true){
            if( copy_d.indexOf('<p><br></p>') === 0 ) {
                if( copy_d.length === 11) {
                    blank_d = true
                    break
                }
                else {
                    copy_d = copy_d.substring(11, copy_d.length)
                }
            }
            else if( description.indexOf('<p>') === 0 ) {
                if(copy_d.replace(/ /g, '') === '<p></p>') {
                    blank_d = true
                }
	            break
            }
            else{
                break
            }
        }

        if(!TitleValue || blank_t) {
            return message.warning('제목을 입력해주세요.')
        }
        else if(!SummaryValue || blank_s) {
            return message.warning('요약 내용을 작성해주세요.')
        }
        else if(!description || blank_d) {
            return message.warning('내용을 작성해주세요.')
        }

        const variables = {
            title: TitleValue,
            summary: SummaryValue,
            description: description,
            writer: user.userData._id
        }
        
        axios.post('/api/notice/createPost', variables)
        .then(response => {
            if (response) {
                message.success('Post Created!');
                setTimeout(() => {
                    props.history.push("/notice")
                }, 2000);
            }
        })
    }

    return (
        <div className="tipAndReview">
            <div className="form-body">
            <div style={{ textAlign: 'center' }}>
                <Title level={2}><span className="tipAndReview-header">공지사항 작성하기</span></Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div className="content">
                    <p className="title">제목</p>
                    <Input
                        onChange={onTitleChange}
                        value={TitleValue}
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className="content">
                    <p className="title">요약</p>
                    <Input
                        onChange={onSummaryChange}
                        value={SummaryValue}
                        placeholder="내용을 요약해서 입력하세요"
                    />
                </div>
                <div className="content">
                    <p className="title" >내용</p>
                    <QuillEditor
                        placeholder={"내용을 입력하세요"}
                        onEditorChange={onEditorChange}
                        onFilesChange={onFilesChange}
                    />
                </div>
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

export default UploadNoticePage