import React, { useState, useEffect } from 'react';
import { Breadcrumb, Typography, Menu } from 'antd';
import { pages } from './Datas';

const { Title } = Typography;
let CategoryNum = ""
let CategoryName = ""
let DetailName = ""
let Pages = 0

function BreadCrumb(props) {
    const [Category, setCategory] = useState("")
    const [Detail, setDetail] = useState("")

    useEffect(() => {
        console.log(props.page)
        if(props.page != undefined) {
            let splitPage = props.page.split("");
            setCategory(splitPage[1]);
            CategoryNum = splitPage[1];
            Pages = 1;
            //console.log(splitPage[1])
            if(splitPage[2] != undefined) {
                setDetail(splitPage[2]);
                Pages = 2;
                //console.log(splitPage[2])
            }
        }
        getNames();
        
    }, [])

    const getNames = () => {
        if(Pages==1) {
            CategoryName = pages.map( (item, index) => {
                let indexNum = index+1
                console.log(item.category)
                return <Menu.Item><a href={`/:${indexNum}`}>{item.category}</a></Menu.Item>
            })
        }
        if(Pages==2) {
            DetailName = pages[CategoryNum-1].detail.map( (item, index) => {
                let indexNum = index+1
                console.log(item)
                return <Menu.Item><a href={`/:${CategoryNum}${indexNum}`}>{item}</a></Menu.Item>
                
            })
        }
    }
    

    const menu = (
        Pages == 1 ?
            <Menu>
                {CategoryName}
            </Menu>
                
        :
            <Menu>
                {DetailName}
            </Menu>
    )

    return (
        <div style={{ fontSize:"30px" }}>
            <Title>
                {Pages==0? 
                <Breadcrumb>
                    <Breadcrumb.Item>모든속지</Breadcrumb.Item>
                </Breadcrumb>
                :
                Pages==1?
                <Breadcrumb>
                    <Breadcrumb.Item overlay={menu}>{pages[Category-1].category}</Breadcrumb.Item>
                </Breadcrumb>
                :
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href={`/:${Category}`}>{pages[Category-1].category}</Breadcrumb.Item>
                    <Breadcrumb.Item overlay={menu}>{pages[Category-1].detail[Detail-1]}</Breadcrumb.Item>
                </Breadcrumb>
                }
                
            </Title>
        </div>
    )
}

export default BreadCrumb
