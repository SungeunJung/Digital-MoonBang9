import React, { useEffect, useState } from 'react'
import EditQuillEditor from '../../../editor/EditQuillEditior';
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';

const { Title } = Typography;

function ModifyNoticePage(props) {

    const postId = props.match.params.postId;
    const [TitleValue, setTitleValue] = useState("")
    const [SummaryValue, setSummaryValue] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        setTitleValue(window.localStorage.getItem("title_notice"))
        setDescription(window.localStorage.getItem("description_notice"))
        setSummaryValue(window.localStorage.getItem("summary_notice"))
    }, [])

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

        const body = {
            postID: postId,
            title: TitleValue,
            summary: SummaryValue,
            description: description
        }
        
        axios.post('/api/notice/editPost', body)
        .then(response => {
            if (response) {
                message.success('Notice Successfully Edited!');
                setTimeout(() => {
                    window.location.href=`/notice/post/${postId}`
                }, 2000);
            }
        })
    }

    const onCancel = (events) => {
        window.location.href=`/notice/post/${postId}`
    }

    return (
        <div className="tipAndReview">
            <div className="form-body">
            <div style={{ textAlign: 'center' }}>
                <Title level={2}><span className="tipAndReview-header">공지사항 수정하기</span></Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div className="content">
                    <p className="title" >제목</p>
                    <Input
                        defaultValue={window.localStorage.getItem("title_notice")}
                        onChange={onTitleChange}
                    />
                </div>
                <div className="content">
                    <p className="title">요약</p>
                    <Input
                        defaultValue={window.localStorage.getItem("summary_notice")}
                        onChange={onSummaryChange}
                    />
                </div>
                <div className="content">
                <p className="title">내용</p>
                <EditQuillEditor
                    defaultValue={window.localStorage.getItem("description_notice")}
                    onEditorChange={onEditorChange}
                    onFilesChange={onFilesChange}
                />
                </div>
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Button
                            size="large"
                            onClick={onSubmit}
                        >
                            저장
                    </Button>
                    &nbsp;&nbsp;
                    <Button size="large" onClick={onCancel}>
                        취소
                    </Button>
                </div>
            </Form>
        </div>
        </div>
    )
}

export default ModifyNoticePage
