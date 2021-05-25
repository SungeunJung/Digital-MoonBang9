import React, { useEffect, useState } from 'react';
import EditQuillEditior from '../../../editor/EditQuillEditior';
import { Typography, Button, Form, message, Input, Rate, Mentions } from 'antd';
import axios from 'axios';

const { Option } = Mentions;
const { Title } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function ModifyReviewPage(props) {

    const postId = props.match.params.postId;
    const [TitleValue, setTitleValue] = useState("")
    const [RateValue, setRateValue] = useState(Number(window.localStorage.getItem("rate_review")))
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        setTitleValue(window.localStorage.getItem("title_review"))
        setDescription(window.localStorage.getItem("description_review"))
    }, [])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onRateChange = (value) => {
        setRateValue(value)
      };

    const onEditorChange = (value) => {
        setDescription(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setDescription("");

        if(!TitleValue || !description) {
            return alert('Fill all the fields first!')
        }

        const body = {
            postID: postId,
            title: TitleValue,
            rate: RateValue,
            description: description,
        }
            axios.post('/api/review/editPost', body)
            .then(response => {
                if (response) {
                    message.success('Review Successfully Edited!');
                    setTimeout(() => {
                        window.location.href=`/review/post/${postId}`
                    }, 2000);
                }
            })
    }

    const onCancel = (events) => {
        window.location.href=`/review/post/${postId}`
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > 리뷰 수정하기</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Title</p>
                <Input
                    defaultValue={window.localStorage.getItem("title_review")}
                    onChange={onTitleChange}
                />
                <br/>
                <br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Template Name</p>
                <Mentions style={{ width: '100%' }} 
                    placeholder={window.localStorage.getItem("template_review")} disabled />
                <br/>
                <br/>
                <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '14px' }} >Rate: </span>&nbsp;&nbsp;&nbsp;&nbsp;
                <Rate tooltips={desc} onChange={onRateChange} value={RateValue} />
                {RateValue ? <span className="ant-rate-text" style={{ color: '#DAA520' }}>
                    {desc[RateValue - 1]}</span> : ''}
                </div>
                <br/>
                <p style={{ textAlign: 'center', fontSize: '14px' }} >Description</p>
                <EditQuillEditior
                    defaultValue={window.localStorage.getItem("description_review")}
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

export default ModifyReviewPage
