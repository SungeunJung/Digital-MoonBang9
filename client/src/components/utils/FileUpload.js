import React, { useState } from 'react';
import DropZone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './FileUpload.css';
import { message } from 'antd';
//import { response } from 'express';

function FileUpload(props) {
    const [Images, setImages] = useState([])

    const onDrop=(files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])
        
        //save the Image we chose inside the node server
        axios.post('/api/template/uploadImage', formData, config)
        .then(response => {
            if(response.data.success) {
                setImages([...Images, response.data.image])
                props.refreshFunction([...Images, response.data.image])
            } else {
                message.error('이미지 저장에 실패했습니다.')
            }
        })
        
    }

    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image)

        let newImages = [...Images]
        newImages.splice(currentIndex, 1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div className="fileUpload">
            <DropZone
                onDrop={onDrop}
                multiple={false}
                maxSize={80000000}
                accept={'image/*'}
            >
                {({getRootProps, getInputProps}) => (
                    <div className="drop-zone"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()}/>
                        <PlusOutlined style={{ fontSize:'3rem' }} />
                    </div>
                )}
            </DropZone>
            <div className="display-zone">
                    {Images.map((image, index) => (
                        <div onClick={()=>onDelete(image)} key={index}>
                            <img className="image-style"
                            src={(process.env.REACT_APP_S3_URL) +`templateImage/${image}`} alt={`templateImg-${index}`} />
                        </div>
                    ))}
                    
            </div>
        </div>
    )
}

export default FileUpload
