import React, { useState, useEffect } from 'react';
import { Breadcrumb, Typography, Menu } from 'antd';
import { pages } from './Datas';
import '../LandingPage.css'

const { Title } = Typography;
let CategoryNum = ""
let DetailName = ""
let Pages = 0

function BreadCrumb(props) {
    const [Category, setCategory] = useState("")
    const [Detail, setDetail] = useState("")

    useEffect(() => {
        if(props.page != undefined) {
            let splitPage = props.page.split("");
            setCategory(splitPage[1]);
            CategoryNum = splitPage[1];
            Pages = 1;
            if(splitPage[2] != undefined) {
                setDetail(splitPage[2]);
                Pages = 2;
            }            
        }
        getNames();
    }, [])

    const getNames = () => {
        if(Pages>0) {
            DetailName = pages[CategoryNum-1].detail.map( (item, index) => {
                let indexNum = index+1
                return <Menu.Item className="Landing-font"><a href={`/:${CategoryNum}${indexNum}`}>{item}</a></Menu.Item>
                
            })
        }
    }
    

    const menu = (
        <Menu>
            <Menu.Item className="Landing-font">
                <a href={`/:${CategoryNum}`}>전체보기</a>
            </Menu.Item>
            {DetailName}
        </Menu>
    )

    return (
        <div>
            <Title>
                {Pages==0? 
                <Breadcrumb className="Landing-breadcrump-1">
                    <Breadcrumb.Item>모든속지</Breadcrumb.Item>
                </Breadcrumb>
                :
                Pages==1?
                <Breadcrumb className="Landing-breadcrump-2" separator=">">
                    <Breadcrumb.Item>{pages[Category-1].category}</Breadcrumb.Item>
                    <Breadcrumb.Item overlay={menu}>전체보기</Breadcrumb.Item>
                </Breadcrumb>
                :
                <Breadcrumb className="Landing-breadcrump-2" separator=">">
                    <Breadcrumb.Item>{pages[Category-1].category}</Breadcrumb.Item>
                    <Breadcrumb.Item overlay={menu}>{pages[Category-1].detail[Detail-1]}</Breadcrumb.Item>
                </Breadcrumb>
                }
            </Title>
        </div>
    )
}

export default BreadCrumb
