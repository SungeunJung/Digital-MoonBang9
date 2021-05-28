import React, { useEffect, useState } from 'react'
import EditQuillEditor from '../../../editor/EditQuillEditior';
import { Typography, Button, Form, message, Input, Row, Col } from 'antd';
import axios from 'axios';

const { Title } = Typography;

function ModifyTipPage(props) {

    const postId = props.match.params.postId;
    const [TitleValue, setTitleValue] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        setTitleValue(window.localStorage.getItem("title_tip"))
        setDescription(window.localStorage.getItem("description_tip"))
    }, [])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
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

        if(!TitleValue || !description ) {
            return alert('Fill all the fields first!')
        }

        const body = {
            postID: postId,
            title: TitleValue,
            description: description,
        }
            axios.post('/api/tip/editPost', body)
            .then(response => {
                if (response) {
                    message.success('Tip Successfully Edited!');
                    setTimeout(() => {
                        window.location.href=`/tip/post/${postId}`
                    }, 2000);
                }
            })
    }

    const onCancel = (events) => {
        window.location.href=`/tip/post/${postId}`
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > 팁 수정하기</Title>
            </div>
            
            <Form onSubmit={onSubmit}>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Title</p>
                <Input
                    defaultValue={window.localStorage.getItem("title_tip")}
                    onChange={onTitleChange}
                />
                <br/><br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Description</p>
                <EditQuillEditor
                    defaultValue={window.localStorage.getItem("description_tip")}
                    onEditorChange={onEditorChange}
                    onFilesChange={onFilesChange}
                />
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Button size="large"
                        onClick={onCancel}>
                        취소하기
                    </Button>
                    &nbsp;&nbsp;
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

export default ModifyTipPage
