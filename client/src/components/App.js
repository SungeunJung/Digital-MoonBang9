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
import RecommendPage from './views/LandingPage/RecommendPage/RecommendPage'
import LoginPage from './views/LoginPage/LoginPage'
import RegisterPage from './views/RegisterPage/RegisterPage'
import UploadTemplatePage from './views/UploadTemplatePage/UploadTemplatePage'
import DetailTemplatePage from './views/DetailTemplatePage/DetailTemplatePage'
import MyPage from './views/MyPage/MyPage'
import ModifyUserInfoPage from './views/MyPage/ModifyUserInfoPage'
import MyPost from './views/MyPage/MyPost/MyPost'
import MyDownload from './views/MyPage/MyDownload/MyDownload'
import MyHistory from './views/MyPage/MyHistory/MyHistory'
import LikePage from './views/LikePage/LikePage';

import NoticePage from "./views/NoticePage/NoticePage";
import UploadNoticePage from "./views/NoticePage/Sections/UploadNoticePage";
import DetailNoticePage from "./views/DetailPage/DetailNoticePage";

import TipPage from "./views/TipAndReviewPage/TipPage";
import UploadTipPage from "./views/TipAndReviewPage/Sections/UploadTipPage";
import DetailTipPage from "./views/DetailPage/DetailTipPage";

import ReviewPage from "./views/TipAndReviewPage/ReviewPage";
import UploadReviewPage from "./views/TipAndReviewPage/Sections/UploadReviewPage";
import DetailReviewPage from "./views/DetailPage/DetailReviewPage";

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
          <Route exact path="/mypage" component={ Auth(MyPage, true) } />
          <Route exact path="/mypage/modifyinfo" component={ Auth(ModifyUserInfoPage, true) } />
          <Route exact path="/mypage/mypost" component={ Auth(MyPost, true) } />
          <Route exact path="/mypage/download" component={ Auth(MyDownload, true) } />
          <Route exact path="/mypage/history" component={ Auth(MyHistory, true) } />
          <Route exact path="/user/like" component={Auth(LikePage, true)} />
          <Route exact path="/recommend" component={ Auth(RecommendPage, null) } />

          <Route exact path="/notice" component={ Auth(NoticePage, null) } />
          <Route exact path="/notice/upload" component={ Auth(UploadNoticePage, true) } />{/*관리자만*/}
          <Route exact path="/notice/post/:postId" component={ Auth(DetailNoticePage, null) } />

          <Route exact path="/tip" component={ Auth(TipPage, null) } />
          <Route exact path="/tip/upload" component={ Auth(UploadTipPage, true) } />
          <Route exact path="/tip/post/:postId" component={ Auth(DetailTipPage, null) } />

          <Route exact path="/review" component={ Auth(ReviewPage, null) } />
          <Route exact path="/review/upload" component={ Auth(UploadReviewPage, true) } />
          <Route exact path="/review/post/:postId" component={ Auth(DetailReviewPage, null) } />

 
          <Route exact path="/:category" component={ Auth(LandingPage, null) } />
        </Switch>
        
      </div>
      <Footer />
    </Suspense>
    </Router>
  );
}

export default App;

