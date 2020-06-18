import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { logout } from '@/redux/actions'
import { Redirect } from 'react-router-dom'

function Auth(props) {
  let expires = useSelector(state => state.user.expires)
  let dispatch = useDispatch()

  // 函数组件内不允许有if语句
  // 回调异步
  useEffect(() => {
    if(Date.now() >= expires) {
      message.info('身份过期,请重新登录')
      dispatch(logout({ reason: 'expired' }))
    }
  })

  return (
    <>
      { Date.now() >= expires ? (
        <Redirect to="/" />
      ) : (
        <>{props.children}</>
      )
    }
    </>
  )
}

export default React.memo(Auth)