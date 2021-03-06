import React, { useState, useEffect } from 'react';
import { styles, pages } from '../views/LandingPage/Sections/Datas';
import { Popover, Button } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
function KakaoLinkShare(props) {
  const [Template, setTemplate] = useState([])

  useEffect(() => {    
    let abortController = new AbortController()
    const fetchData = async () => {
      try{
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos/1',
          {
            signal: abortController.signal,
          },
        )
        createDefaultButton()
        setTemplate(props.detail)       
      } catch (error) {
        if(error.name === 'AbortError') {
        }
      }
    }
    fetchData()
    return () => {
     abortController.abort()
    }   
  }, [props.detail])
  
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
          description: '#' + pages[props.detail.category-1].category + 
                      ' #' + pages[props.detail.category-1].detail[props.detail.detail-1] + 
                      ' #' + styles[props.detail.styles-1].name ,
          imageUrl: (process.env.REACT_APP_S3_URL) +'templateImage/' + props.detail.images[0],
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
        <div style={{ float:'right', fontSize:'1rem'}}>            
            <Button id="kakao-link-btn">
              <ShareAltOutlined/>
            </Button>
        </div>
    )
}

export default KakaoLinkShare
