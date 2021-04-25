import React, { useState,useEffect } from 'react'
import { Button, Descriptions } from 'antd';

function TemplateInfo(props) {
    const [Template, setTemplate] = useState([])

    useEffect(() => {
       setTemplate(props.detail)
    }, [props.detail])

    return (
        <div>
            <Descriptions title="Template Info">
                <Descriptions.Item label="Download">{Template.downloads}</Descriptions.Item>
                <Descriptions.Item label="View">{Template.views}</Descriptions.Item>
                <br />
                <Descriptions.Item label="Description">{Template.description}</Descriptions.Item>    
            </Descriptions>
            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger"
                    onClick
                >
                    Download
                </Button>
            </div>
            
        </div>
    )
}

export default TemplateInfo
