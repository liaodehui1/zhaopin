import React, { useState } from 'react'
import {resumeConfig} from '@/config/resumeConfig'
import {
  Card,
  Button,
  Modal,
  Tree,
  message
} from 'antd'
import Header from './template/Header'
import Basic from './template/Basic'
import Intention from './template/Intention'
import Skill from './template/Skill'
import Education from './template/Education'
import School from './template/School'
import Job from './template/Job'
import Project from './template/Project'
import Awards from './template/Awards'
import PaperPub from './template/PaperPub'
import Annex from './template/Annex'
import SocialHome from './template/SocialHome'
import { useSelector, useDispatch } from 'react-redux'
import { TEMPORARY_RESUME } from '@/redux/action-types'
import { reqAddOrUpdateResume } from '@/api'
import { withRouter } from 'react-router-dom'
import storageUtils from '@/utils/storageUtils'

function getComponent(key) {
  switch(key) {
    case 'Basic':
      return <Basic key={key}/>
    case 'Intention':
      return <Intention key={key}/>
    case 'Skill':
      return <Skill key={key}/>
    case 'Educations':
      return <Education key={key}/>
    case 'School':
      return <School key={key}/>
    case 'Job':
      return <Job key={key}/>
    case 'Projects':
      return <Project key={key}/>
    case 'Awards':
      return <Awards key={key}/>
    case 'PaperPub':
      return <PaperPub key={key}/>
    case 'Annex':
      return <Annex key={key}/>
    case 'SocialHome':
      return <SocialHome key={key}/>
    default:
      return null
  }
}

function getCheckedkeys(config, checkedKeys) {
  let keys = []
  for(let i = 0; i < config.length; i++) {
    if(checkedKeys.includes(config[i].key)) keys.push(config[i].key)
    if(keys.length === checkedKeys.length) return keys
  }
}

function initCheckedKeys(resume) {
  let checkedKeys = []
  for(let i = 0; i < resumeConfig.length; i++) {
    if(resumeConfig[i].checked || 
      (!!resume[resumeConfig[i].key.toLowerCase()] && 
      JSON.stringify(resume[resumeConfig[i].key.toLowerCase()]).length !== 2)) {
      checkedKeys.push(resumeConfig[i].key)
    }
  }
  return checkedKeys
}

function AddOrUpdateResume(props) {
  let resume = useSelector(state => state.resume)
  let [isShowTree, setIsShowTree] = useState(false)
  let [checkedKeys, setCheckedKeys] = useState(initCheckedKeys(resume))
  let [config, setConfig] = useState(resumeConfig)
  let userId = useSelector(state => state.user._id)
  let dispatch = useDispatch()

  let saveResume = async () => {
    try {
      for(let i = 0; i < resumeConfig.length; i++) {
        if(
          resumeConfig[i].require && (
            !resume[resumeConfig[i].key.toLowerCase()] ||
            JSON.stringify(resume[resumeConfig[i].key.toLowerCase()]).length === 2
          )
        ) {
          return message.info('请填写好基本模块: 基本资料,求职意向,教育经历')
        }
      }
      let result = await reqAddOrUpdateResume({ ...resume, userId })
      if(result.status === 0) {
        message.success('添加成功')
        dispatch({ type: TEMPORARY_RESUME, data: { ...resume, userId } })
        storageUtils.removeResume()
        props.history.goBack()
      }else {
        message.error(result.msg)
      }
    } catch (error) {
      console.log(error)
      message.error('请求异常')
    }    
  }
  let showTree = () => {
    setIsShowTree(true)
  }
  let handleOk = () => {
    setIsShowTree(false)
  }
  let handleCancel = () => {
    setIsShowTree(false)
  }
  let handleCheck = (checkedKeys) => {
    console.log(checkedKeys)
    checkedKeys = getCheckedkeys(config, checkedKeys)
    setCheckedKeys(checkedKeys)
  }
  let onDrop = (info) => {
    if(!info.dropToGap) {
      return message.info('请拖动到两个模块之间')
    }else {
      let dragIndex = parseInt(info.dragNode.pos.split('-')[1])
      let targetIndex = info.node.dragOverGapBottom ? info.dropPosition : info.dropPosition + 1
      let temp = config.slice(0)
      let dragItem = temp.splice(dragIndex, 1)
      temp.splice(targetIndex, 0, dragItem[0])
      setConfig(temp)
      setCheckedKeys(getCheckedkeys(temp, checkedKeys))
    }
  }

  return (
    <>
      <Card
        title={<Button type="primary" onClick={showTree}>简历模板</Button>}
        extra={<Button type="primary" onClick={saveResume}>保存</Button>}
      >
        <Header/>
        {
          checkedKeys.map(key => {
            return getComponent(key)
          })
        }
      </Card>
      <Modal
        title="简历模板"
        visible={isShowTree}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          checkable
          onCheck={handleCheck}
          checkedKeys={checkedKeys}
          onDrop={onDrop}
          treeData={config}
        />
      </Modal>
    </>
  )
}

export default withRouter(AddOrUpdateResume)