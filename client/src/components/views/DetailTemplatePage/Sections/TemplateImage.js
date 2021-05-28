import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';

function TemplateImage(props) {
    const [Images, setImages] = useState([])

    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {
            let images = [];

            props.detail.images && props.detail.images.map(item => {
                images.push({
                    original: (process.env.REACT_APP_S3_URL) +`templateImage/${item}`,
                    thumbnail: (process.env.REACT_APP_S3_URL) +`templateImage/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail]) //useEffect is implemented when DOM is loaded
                        //but now when the DOM is loaded, we couldn't get props.detail
                        //so to get props.detail.image, we put props.detail inside []
                        //whenever props.detail has changes in it, useEffect will be triggered again
    return (
        <div>
            <ImageGallery items={Images}/>
        </div>
    )
}

export default TemplateImage
