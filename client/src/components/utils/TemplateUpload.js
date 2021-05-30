import React, { useMemo, useState } from 'react'
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import { message } from 'antd';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

function TemplateUpload(props) {
    const [Files, setFiles] = useState([])

    const onDrop=(files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])
        
        //save the Image we chose inside the node server
        axios.post('/api/template/uploadFile', formData, config)
        .then(response => {
            if(response.data.success) {
                setFiles([...Files, response.data.fileName])
                props.refreshFunction([...Files, response.data.fileName])
            } else {
              message.error('이미지 저장에 실패했습니다.')
            }
        })
    }

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
      } = useDropzone({onDrop})
    
      const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ])

      const files = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ))

    return (
        <section className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p style={{ wordBreak: 'keep-all' }}>파일을 드래그&amp;드롭 또는 클릭하여 선택해주세요</p>
                <ul style={{color: "black"}}>{files}</ul>
            </div>
        </section>
    )
}

export default TemplateUpload
