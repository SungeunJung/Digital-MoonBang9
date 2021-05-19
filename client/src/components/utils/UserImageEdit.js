import React, { useState } from "react";
import DropZone from 'react-dropzone';
import axios from 'axios';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function UserImageEdit(props) {
  const [Image, setImage] = useState([])  

    const onDrop=(files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])
        console.log(files[0]);
        
        
        //save the Image we chose inside the node server
        axios.post('/api/users/uploadUserProfile', formData, config)
        .then(response => {
            if(response.data.success) {
                setImage([response.data.image])                
                props.refreshFunction([response.data.image])
            } else {
                alert('Failed to save the Image in Server')
            }
        })    
    }

  console.log(Image)
  const str = localStorage.getItem("userImage")

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
          <Avatar src={'https://myuploads1697.s3.ap-northeast-2.amazonaws.…1621444345488_KakaoTalk_20210411_203402173_14.jpg'} style={{width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}/>
          :
          <Avatar icon={<UserOutlined />} size={190} src={'https://myuploads1697.s3.ap-northeast-2.amazonaws.com/userProfile/1621443678201_KakaoTalk_20210411_203402173_08.jpg'} style={{backgroundColor:'#a5cbf0', width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}/>
          }
           
          <input {...getInputProps()} />    
        </div>)}
      </DropZone>      
    </div>
  );
}

export default UserImageEdit
