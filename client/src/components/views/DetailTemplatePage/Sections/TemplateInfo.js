import React, { useState,useEffect } from 'react'
import { Button, Descriptions } from 'antd';
import { styles } from '../../LandingPage/Sections/Datas';

const Styles = ["심플", "귀여운", "캐릭터", "빈티지", "레트로", "키치", "클래식", "일러스트"]

function TemplateInfo(props) {
    const [Template, setTemplate] = useState([])
    const [Style, setStyle] = useState("")

    useEffect(() => {
       setTemplate(props.detail)
       var indexs = styles.findIndex(i => i._id == props.detail.styles)
       setStyle(Styles[indexs])
    }, [props.detail])

    return (
        <div>
            <Descriptions title="Template Info">
                <Descriptions.Item label="Designer">{Template.designery}</Descriptions.Item>
                <Descriptions.Item label="Style">{Style}</Descriptions.Item>
                <Descriptions.Item label="nickname">{Template.nickname}</Descriptions.Item>
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
