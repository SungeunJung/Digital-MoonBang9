import React, { useState, useEffect } from "react";
import DropZone from 'react-dropzone';
import axios from 'axios';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

function UserImageEdit(props) {
  const [Image, setImage] = useState([]) 
  const [PreImage, setPreImage] = useState([])
  const user = useSelector(state => state.user);

  useEffect(()=> { 
    let abortController = new AbortController()
    const fetchData = async () => {
      try{
          const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos/1',
            {
              signal: abortController.signal,
            },
          )        
          setPreImage(user.userData.image)      
        } catch (error) {
          if(error.name === 'AbortError') {} 
        }
      }
      fetchData()
      return () => {
      abortController.abort()
      }     
    }
  )

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
        style={{ width:'200px', height:'200px',  borderRadius:"50%",  border: "none"}}
        onDrop={onDrop}
        multiple={false}
        maxSize={80000000}     
      >
        
         {({getRootProps, getInputProps}) => (
          <div style={{ width:'200px', height:'200px',  borderRadius:"50%",  border: "none"} }
            {...getRootProps() }
          >
            
          {Image.length > 0 ? 
          <Avatar src={process.env.REACT_APP_S3_URL+`userProfile/${Image}`} style={{width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}/>
          :
          <Avatar icon={<UserOutlined />} size={190} src={(process.env.REACT_APP_S3_URL)+`userProfile/${PreImage}`} style={{backgroundColor:'#a5cbf0', width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}/>
          }
           
          <input {...getInputProps()} />    
        </div>)}
      </DropZone>      
    </div>
  );
}

export default UserImageEdit
