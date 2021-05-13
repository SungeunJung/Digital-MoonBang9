import React, { useState } from "react";
import DropZone from 'react-dropzone';
import axios from 'axios';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function UserImageEdit(props) {
  const [Image, setImage] = useState([])
  const [ImageClient, setImageClient] = useState([])  

    const onDrop=(files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])
        console.log(files[0]);
        
        
        //save the Image we chose inside the node server
        axios.post('/api/users/uploadUserImage', formData, config)
        .then(response => {
            if(response.data.success) {
                setImage([response.data.image])                
                props.refreshFunction([response.data.image])
            } else {
                alert('Failed to save the Image in Server')
            }
        })

        axios.post('/api/users/uploadUserImageToClient', formData, config)
        .then(response => {
            if(response.data.success) {
              window.localStorage.setItem('newImage', response.data.fileName);
              setImageClient([response.data.fileName])
              props.refreshFunctionClient([response.data.fileName])
            } else {
                alert('Failed to save the Image in Client')
            }
        })

    }

  console.log(Image)
  const str = localStorage.getItem("userImage") 
  const str_new = localStorage.getItem("newImage")  

  return (
    
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <DropZone
        style={{ width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}
        onDrop={onDrop}
        multiple={false}
        maxSize={80000000}     
      >
        
         {({getRootProps, getInputProps}) => (
          <div style={{ width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"} }
            {...getRootProps() }
          >
            
          {Image.length > 0 ? 
          <Avatar src={''.concat("\\uploads\\profile\\", str_new)} size={250} style={{width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}/>
          :
          <Avatar src={''.concat("\\uploads\\profile\\", str)} size={250} style={{width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}/>
          }
           
          <input {...getInputProps()} />    
        </div>)}
      </DropZone>      
    </div>
  );
}

export default UserImageEdit
