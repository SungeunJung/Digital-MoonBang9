import React, { useState } from 'react';
import DropZone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
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
                setImages([...Images, response.data.filePath])
                props.refreshFunction([...Images, response.data.filePath])
            } else {
                alert('Failed to save the Image in Server')
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
                accept={'image/jpg','image/png'}
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
                            src={`http://localhost:2000/${image}`} alt={`templateImg-${index}`} />
                        </div>
                    ))}
                    
            </div>
        </div>
    )
}

export default FileUpload
