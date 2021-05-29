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
        <div className="tipAndReview">
            <div className="form-body">
                <div style={{ textAlign: 'center' }}>
                    <Title level={2}><span className="tipAndReview-header">리뷰 수정하기</span></Title>
                </div>
                    <Form onSubmit={onSubmit}>
                    <div className="content">
                        <p className="title">제목</p>
                        <Input
                            defaultValue={window.localStorage.getItem("title_review")}
                            onChange={onTitleChange}
                            style={{height:'35px'}}
                        />
                    </div>
                    <div className="content">
                        <p className="title">속지 이름</p>
                        <Mentions style={{ width: '100%' }} 
                            placeholder={window.localStorage.getItem("template_review")} disabled />
                    </div>
                    <div style={{ display:'flex', marginBottom:"2%", alignItems:'center'}}>
                    <span className="title">평점: </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Rate onChange={onRateChange} value={RateValue} style={{fontSize:35}} />
                    {RateValue ? <span className="ant-rate-text" style={{ color: '#DAA520' }}></span> : ''}
                    </div>
                    <br/>
                    <p className="title" >내용</p>
                    <EditQuillEditior
                        defaultValue={window.localStorage.getItem("description_review")}
                        onEditorChange={onEditorChange}
                        onFilesChange={onFilesChange}
                    />
                    <div style={{ textAlign: 'center', margin: '2rem', }}>
                        <Button
                            size="large"
                            onClick={onSubmit}
                            >
                            저장
                        </Button>
                        &nbsp;&nbsp;
                        <Button size="large"
                            onClick={onCancel}>
                            취소
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default ModifyReviewPage
