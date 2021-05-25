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
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > 공지사항 수정하기</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Title</p>
                <Input
                    defaultValue={window.localStorage.getItem("title_notice")}
                    onChange={onTitleChange}
                />
                <br/><br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Summary</p>
                <Input
                    defaultValue={window.localStorage.getItem("summary_notice")}
                    onChange={onSummaryChange}
                />
                <br/><br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Description</p>
                <EditQuillEditor
                    defaultValue={window.localStorage.getItem("description_notice")}
                    onEditorChange={onEditorChange}
                    onFilesChange={onFilesChange}
                />

                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Button size="large" onClick={onCancel}>
                        취소하기
                    </Button>
                    <Button
                        size="large"
                        onClick={onSubmit}
                    >
                        수정하기
                </Button>
                </div>
            </Form>
        </div>
    )
}

export default ModifyNoticePage
