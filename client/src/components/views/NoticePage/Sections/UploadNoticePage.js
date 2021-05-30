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
    }

    const onSummaryChange = (event) => {
        setSummaryValue(event.currentTarget.value)
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

        if(!TitleValue || !description || !SummaryValue ) {
            return alert('Fill all the fields first!')
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