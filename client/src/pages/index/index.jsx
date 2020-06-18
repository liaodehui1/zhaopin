import React, { useRef, useCallback } from 'react';
import { Carousel } from 'antd';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons'
import Form from './form/index';
import './index.less'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import images1 from '@/assets/images/image1.jpg'
import images2 from '@/assets/images/image2.jpg'
import images3 from '@/assets/images/image3.jpg'

function Index() {
  let user = useSelector(state => state.user)
  let slider = useRef()
  
  let handlePre = useCallback(() => {
    slider.slick.slickPrev()
  }, [])
  let handleNext = useCallback(() => {
    slider.slick.slickNext()
  }, [])

  return (
    <>
      {user && user._id ? (
        <Redirect to="/admin" />
      ) : (
          <div className="index">
            <Carousel autoplay ref={el => slider = el}>
              <div>
                <img src={images1} alt="" />
              </div>
              <div>
                <img src={images2} alt="" />
              </div>
              <div>
                <img src={images3} alt="" />
              </div>
            </Carousel>
            <LeftCircleFilled className="pre" onClick={handlePre} />
            <RightCircleFilled className="next" onClick={handleNext} />
            <Form />
          </div >
        )
      }
    </>
  )
}

export default Index