import React, { useState, useEffect } from 'react';
import DropZone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { message } from 'antd';

function EditFileUpload(props) {
    const [Images, setImages] = useState([])

    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {
            let images = [];

            props.detail.images && props.detail.images.map(item => {
                images.push(item)
            })
            setImages(images)
        }
    }, [props.detail])

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
        <div style={{ display:'flex', justifyContent:'space-between' }}>
            <DropZone
                onDrop={onDrop}
                multiple={false}
                maxSize={80000000}
                accept={'image/*'}
            >
                {({getRootProps, getInputProps}) => (
                    <div style={{ width:'300px', height:'240px', border:'1px solid lightgray', 
                    display:'flex', alignItems:'center', justifyContent:'center' }}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()}/>
                        <PlusOutlined style={{ fontSize:'3rem' }} />
                    </div>
                )}
            </DropZone>
            <div style={{ display:'flex', width:'350px', height:'240px', overflowX:'scroll' }}>
                    {Images.map((image, index) => (
                        <div onClick={()=>onDelete(image)} key={index}>
                            <img style={{ minWidth:'300px', width:'300px', height:'240px' }} 
                            src={(process.env.REACT_APP_S3_URL) +`templateImage/${image}`} alt={`templateImg-${index}`} />
                        </div>
                    ))}
                    
            </div>
        </div>
    )
}

export default EditFileUpload