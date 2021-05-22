import React from 'react'
import { Carousel } from 'antd';

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ width:'100%', maxHeight:'150px' }} 
                        src={(process.env.REACT_APP_S3_URL) +`templateImage/${image}`} alt="templateImage" />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider
