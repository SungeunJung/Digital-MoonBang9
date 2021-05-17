import React, { useState, useEffect } from 'react';


function KakaoLinkShare(props) {
  const [Template, setTemplate] = useState([])

  useEffect(() => {
    createDefaultButton()
    setTemplate(props.detail)
  }, [props.detail])

 
  console.log(props.detail.images)
  const createDefaultButton = () => {
    // kakao sdk script이 정상적으로 불러와졌으면 window.Kakao로 접근이 가능합니다
    if (window.Kakao) {
      const kakao = window.Kakao
      // 중복 initialization 방지

      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        kakao.init(process.env.REACT_APP_JAVASCRIPT_KEY)
      }

      

      kakao.Link.createDefaultButton({
        // Render 부분 id=kakao-link-btn 을 찾아 그부분에 렌더링을 합니다
        container: '#kakao-link-btn',
        objectType: 'feed',
        content: {
          title: props.detail.title,
          description: props.detail.description,
          imageUrl: 'imgurl',        
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },          
        ],
      })
    }
  }
    
    return (
        <div className="kakao-share-button" style={{ float:'right', fontSize:'1rem',}}>
            카카오로 공유하기  
             <button id="kakao-link-btn" style={{border:'none'}}> 
                <img src="/kakaolink_btn.png" alt="kakao-share-icon" style={{height:'40px', width:'40px'}}/>
            </button>
        </div>
    )
}

export default KakaoLinkShare
