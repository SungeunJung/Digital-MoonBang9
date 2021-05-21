import React, { useEffect, useState } from 'react'
import QuillEditor from '../../../editor/QuillEditor';
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;

function UploadTipAndReviewPage(props) {
    const user = useSelector(state => state.user);

    const [Type, setType] = useState(props.match.params.Type)
    const [content, setContent] = useState("")
    const [files, setFiles] = useState([])
    const [TitleValue, setTitleValue] = useState("")

    const onEditorChange = (value) => {
        setContent(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setContent("");

        const variables = {
            title: TitleValue,
            content: content,
            writer: user.userData._id
        }
            axios.post(`/api/tipAndReview/createPost?Type=${Type}`, variables)
            .then(response => {
                if (response) {
                    message.success('Post Created!');
                    setTimeout(() => {
                        props.history.push("/tipAndReview")
                    }, 2000);
                }
            })
    }

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
        console.log(TitleValue)
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                
                <Title level={2} >{Type === 0 ? "팁 작성하기": "리뷰 작성하기"}</Title>
                
            </div>

            <Form onSubmit={onSubmit}>

            <p style={{ textAlign: 'center', fontSize: '14px' }} >Title</p>
            <Input
                onChange={onTitleChange}
                value={TitleValue}
            />
            <br/><br/><br/>
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

export default UploadTipAndReviewPage