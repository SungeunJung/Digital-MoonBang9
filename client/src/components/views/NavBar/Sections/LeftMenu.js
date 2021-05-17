import React, { useState } from 'react';
import { Menu, Row, Col } from 'antd';
import renderEmpty from 'antd/lib/config-provider/renderEmpty';
import './LeftMenu.css';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


function LeftMenu(props) {
  const [mouseOver, setmouseOver] = useState(false)

  const menuHandler = (value) => {
    if(value.key == 'all') window.location.href='/';
    else window.location.href=`/:${value.key}`;
  }
 
  return (
    <Menu onClick={menuHandler} mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/recommend">추천속지</a>
      </Menu.Item>
      <SubMenu key="all" title={<span>모든속지</span>}>
        <Menu.Item key="all">ALL</Menu.Item>
        <SubMenu key="1" title={<a href='/:1' className="SubMenu">다이어리</a>}>
          <Menu.Item key="11">날짜형</Menu.Item>
          <Menu.Item key="12">만년형</Menu.Item>
          <Menu.Item key="13">일기장</Menu.Item>
        </SubMenu>
        <SubMenu key="2" title={<a href='/:2' className="SubMenu">플래너</a>}>
          <Menu.Item key="21">먼슬리</Menu.Item>
          <Menu.Item key="22">데일리</Menu.Item>
          <Menu.Item key="23">위클리</Menu.Item>
          <Menu.Item key="24">업무</Menu.Item>
        </SubMenu>
        <SubMenu key="3" title={<a href='/:3' className="SubMenu">노트</a>}>
          <Menu.Item key="31">줄</Menu.Item>
          <Menu.Item key="32">무지</Menu.Item>
          <Menu.Item key="33">모눈</Menu.Item>
          <Menu.Item key="34">분할</Menu.Item>
          <Menu.Item key="35">코넬</Menu.Item>
          <Menu.Item key="36">단어장</Menu.Item>
          <Menu.Item key="37">기타</Menu.Item>
        </SubMenu>
        <SubMenu key="4" title={<a href='/:4' className="SubMenu">라이프</a>}>
          <Menu.Item key="41">가계부</Menu.Item>
          <Menu.Item key="42">운동</Menu.Item>
          <Menu.Item key="43">독서</Menu.Item>
          <Menu.Item key="44">여행</Menu.Item>
          <Menu.Item key="45">기타</Menu.Item>
        </SubMenu>
        <SubMenu key="5" title={<a href='/:5' className="SubMenu">스티커</a>}>
          <Menu.Item key="51">메모지</Menu.Item>
          <Menu.Item key="52">캐릭터</Menu.Item>
          <Menu.Item key="53">레터링</Menu.Item>
          <Menu.Item key="54">도형</Menu.Item>
          <Menu.Item key="55">일상</Menu.Item>
          <Menu.Item key="56">기념일</Menu.Item>
          <Menu.Item key="57">기타</Menu.Item>
        </SubMenu>
        <SubMenu key="6" title={<a href='/:6' className="SubMenu">기타</a>}>
          <Menu.Item key="61">트래커</Menu.Item>
          <Menu.Item key="62">체크리스트</Menu.Item>
        </SubMenu>
      </SubMenu>
      <Menu.Item key="tipandreview">
        <a href="/board/tip">Tip &amp; Review</a>
      </Menu.Item>
      <Menu.Item key="notice">
        <a href="/notice">공지사항</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu