import React from 'react';
import { Menu, Row, Col } from 'antd';
import renderEmpty from 'antd/lib/config-provider/renderEmpty';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  
  const menuHandler = (value) => {
    console.log(value.key)
  }

  return (
    <Menu onClick={menuHandler} mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">추천속지</a>
      </Menu.Item>
      <SubMenu title={<span>모든속지</span>}>
        <Menu.Item key="all">ALL</Menu.Item>
        <SubMenu key="1" title={<span>다이어리</span>}>
          <Menu.Item key="1_1">날짜형</Menu.Item>
          <Menu.Item key="1_2">만년형</Menu.Item>
        </SubMenu>
        <SubMenu key="2" title={<span>플래너</span>}>
          <Menu.Item key="2_1">먼슬리</Menu.Item>
          <Menu.Item key="2_2">위클리</Menu.Item>
          <Menu.Item key="2_3">데일리</Menu.Item>
        </SubMenu>
        <SubMenu key="3" title={<span>노트</span>}>
          <Menu.Item key="3_1">줄</Menu.Item>
          <Menu.Item key="3_2">무지</Menu.Item>
          <Menu.Item key="3_3">모눈</Menu.Item>
        </SubMenu>
        <SubMenu key="4" title={<span>라이프</span>}>
          <Menu.Item key="4_1">가계부</Menu.Item>
          <Menu.Item key="4_2">운동</Menu.Item>
          <Menu.Item key="4_3">독서</Menu.Item>
        </SubMenu>
        <SubMenu key="5" title={<span>스티커</span>}>
          <Menu.Item key="5_1">메모지</Menu.Item>
          <Menu.Item key="5_2">캐릭터</Menu.Item>
          <Menu.Item key="5_3">도형</Menu.Item>
        </SubMenu>
        <SubMenu key="6" title={<span>기타</span>}>
          <Menu.Item key="6_1">트래커</Menu.Item>
          <Menu.Item key="6_2">체크리스트</Menu.Item>
        </SubMenu>
      </SubMenu>
    </Menu>
  )
}

export default LeftMenu