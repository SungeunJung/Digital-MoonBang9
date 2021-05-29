import React, { useState } from 'react';
import Menubar from './Sections/Menubar';
import { Drawer, Button, Space} from 'antd';
//import Icon from '@ant-design/icons';
import './Sections/Navbar.css';
import Buttons from './Sections/Buttons';

function NavBar(props) {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <div style={{ position: 'fixed', zIndex: 5, width: '100%', height:'18%'}}>
      <div className="logo_bg">
        <a className="logo" href="/">디지털 문방구</a>
        <Buttons state={props}/>         
      </div>
      <nav className="menu" style={{position: 'fixed', width: '100%', zIndex: 5}}>
        <div className="menu__container">
          <div className="menu_bar">
            <Menubar mode="horizontal" />
          </div>       
        </div>
      </nav>
    </div>
  )
}

export default NavBar