import React, { useEffect, useState } from 'react'
import QuillEditor from '../../../editor/QuillEditor';
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;

function UploadNoticePage(props) {
    const user = useSelector(state => state.user);

    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [content, setContent] = useState("")
    const [files, setFiles] = useState([])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
        console.log(TitleValue)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
        console.log(DescriptionValue)
    }

    const onEditorChange = (value) => {
        setContent(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setContent("");

        if(!TitleValue || !content ) {
            return alert('Fill all the fields first!')
        }

        const variables = {
            title: TitleValue,
            description: DescriptionValue,
            content: content,
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
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > 공지사항 작성하기</Title>
            </div>
            <Form onSubmit={onSubmit}>
            <p style={{ textAlign: 'center', fontSize: '14px' }} >Title</p>
            <Input
                onChange={onTitleChange}
                value={TitleValue}
            />
            <br/><br/>
            <p style={{ textAlign: 'center', fontSize: '14px' }} >Description</p>
            <Input
                onChange={onDescriptionChange}
                value={DescriptionValue}
            />
            <br/><br/>
            <p style={{ textAlign: 'center', fontSize: '14px' }} >Content</p>
            <QuillEditor
                placeholder={"Start Posting Something"}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}
            />

                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Button
                        size="large"
                        htmlType="submit"
                        className=""
                        onClick={onSubmit}
                    >
                        Submit
                </Button>
                </div>
            </Form>
        </div>
    )
}

export default UploadNoticePage