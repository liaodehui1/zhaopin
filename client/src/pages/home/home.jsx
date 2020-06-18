import React from 'react';
import { useSelector } from 'react-redux'
// import ForEmployer from './for-employer'
import ForSeeker from './for-seeker'

function getComponent(roleName) {
  switch(roleName) {
    case '求职者':
      return <ForSeeker />
    // case '用人单位':
    //   return <ForEmployer />
    default:
      return <div></div>
  }
}

function Home() {
  let roleName = useSelector(state => state.user.role.name)
  return (
    <>
      {getComponent(roleName)}
    </>
  )
}

export default Home