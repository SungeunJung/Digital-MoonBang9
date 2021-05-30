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
