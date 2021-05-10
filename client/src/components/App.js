//import './App.css';
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import LandingPage from './views/LandingPage/LandingPage'
import RecommendPage from './views/LandingPage/RecommendPage'
import LoginPage from './views/LoginPage/LoginPage'
import RegisterPage from './views/RegisterPage/RegisterPage'
import UploadTemplatePage from './views/UploadTemplatePage/UploadTemplatePage'
import DetailTemplatePage from './views/DetailTemplatePage/DetailTemplatePage'
import MyPage from './views/MyPage/MyPage'
import ModifyUserInfoPage from './views/MyPage/ModifyUserInfoPage'
import LikePage from './views/LikePage/LikePage';
import Auth from '../hoc/auth';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{background:'aliceblue'}}>
        <div className="logo">
          <a href="/">디지털 문방구</a>
        </div>
      </div>
      <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />

      <div style={{ paddingTop: '120px', minHeight: 'calc(100vh - 80px)' }}>

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        
        <Switch>
          <Route exact path="/" component={ Auth(LandingPage, null) } />
          <Route exact path="/login" component={ Auth(LoginPage, false) } />
          <Route exact path="/register" component={ Auth(RegisterPage, false) } />
          <Route exact path="/template/upload" component={ Auth(UploadTemplatePage, true) } />
          <Route exact path="/template/:templateId" component={ Auth(DetailTemplatePage, null) } />
          <Route exact path="/recommend" component={ Auth(RecommendPage, null) } />
          <Route exact path="/:category" component={ Auth(LandingPage, null) } />
          <Route exact path="/mypage" component={ Auth(MyPage, true) } />
          <Route exact path="/mypage/modifyinfo" component={ Auth(ModifyUserInfoPage, true) } />
          <Route exact path="/user/like" component={Auth(LikePage, true)} />
          
        </Switch>
        
      </div>
      <Footer />
    </Suspense>
    </Router>
  );
}

export default App;

