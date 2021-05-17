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
import LikePage from './views/LikePage/LikePage';
import TipPostPage from "./views/PostPage/TipPostPage";
import ReviewPostPage from "./views/PostPage/ReviewPostPage";
import NoticePostPage from "./views/PostPage/NoticePostPage";
import NoticePage from "./views/NoticePage/NoticePage";
import NoticeCreatePage from "./views/NoticePage/Sections/NoticeCreatePage";
import TipPage from "./views/TipAndReviewPage/TipPage"
import ReviewPage from "./views/TipAndReviewPage/ReviewPage"
import CreateTipPage from "./views/TipAndReviewPage/Sections/CreateTipPage";
import CreateReviewPage from "./views/TipAndReviewPage/Sections/CreateReviewPage";
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
          
          <Route exact path="/mypage" component={ Auth(MyPage, true) } />
          <Route exact path="/user/like" component={ Auth(LikePage, true) } />
          <Route exact path="/board/notice" component={ Auth(NoticePage, null) } />
          <Route exact path="/board/notice/create" component={ Auth(NoticeCreatePage, true) } />{/*관리자만*/}
          <Route exact path="/board/tip" component={ Auth(TipPage, null) } />
          <Route exact path="/board/review" component={ Auth(ReviewPage, null) } />
          <Route exact path="/board/tip/create" component={ Auth(CreateTipPage, null) } />
          <Route exact path="/board/review/create" component={ Auth(CreateReviewPage, null) } />
          <Route exact path="/tip/post/:postId" component={ Auth(TipPostPage, null) } />
          <Route exact path="/review/post/:postId" component={ Auth(ReviewPostPage, null) } />
          <Route exact path="/notice/post/:postId" component={ Auth(NoticePostPage, null) } />
          <Route exact path="/:category" component={ Auth(LandingPage, null) } />
        </Switch>
        
      </div>
      <Footer />
    </Suspense>
    </Router>
  );
}

export default App;

