import React, {useState} from "react";
import DropZone from 'react-dropzone';
import axios from 'axios';


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
        axios.post('/api/users/uploadUserImage', formData, config)
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
        style={{ width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}
        onDrop={onDrop}
        multiple={false}
        maxSize={80000000}
        
      >
         {({getRootProps, getInputProps}) => (
          <div style={{ width:'200px', height:'200px',  borderRadius:"50%",  border: "1px dashed"}}
            {...getRootProps()}
          >
            <input {...getInputProps()} />                   
            {Image.map((image, index) => (
              <div key={index}>
                  <img style={{ width:'200px', height:'200px',  borderRadius:"50%" }} 
                    src={`http://localhost:2000/${image}`} alt={`profileImg-${index}`} />
              </div>
            ))}
        </div>)}
      </DropZone>
      
    </div>
  );
}


export default UserImageEdit
