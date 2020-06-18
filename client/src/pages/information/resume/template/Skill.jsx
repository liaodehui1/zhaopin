import React, { useState, useRef } from 'react'
import {
  Card,
  Modal,
  Descriptions
} from 'antd'
import LinkButton from '@/components/link-button'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_RESUME } from '@/redux/action-types'
import RichTextEditor from '@/components/rich-text-editor'


function Skill() {
  let initSkill = useSelector(state => state.resume.skill)
  let [skill, setData] = useState({ content: initSkill })
  let [isShow, setIsShow] = useState(false)
  let dispatch = useDispatch()
  let editRef = useRef()

  let handleOk = () => {
    let content = editRef.current.getContent()
    setData({ content })
    setIsShow(false)
    dispatch({ type: ADD_RESUME, data: { skill: content } })
  }
  let handleCancel = () => {
    setIsShow(false)
  }
  let handleClick = () => {
    setIsShow(true)
  }

  return (
    <>
      <Card
        title={<span>技能清单</span>}
        extra={<LinkButton onClick={handleClick}>{skill && skill.content ? '编辑' : '添加'}</LinkButton>}
        style={{ marginBottom: 10 }}
      >
        {
          skill && (
            <Descriptions>
              <Descriptions.Item>
                <p 
                  style={{whiteSpace: 'pre-wrap', marginBottom: 0}} 
                  dangerouslySetInnerHTML={{ __html: skill.content }}
                ></p>
              </Descriptions.Item>
            </Descriptions>
          )
        }
      </Card>
      <Modal
        title="技能清单"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <RichTextEditor detail={skill.content} ref={editRef}/>
      </Modal>
    </>
  )
}

export default React.memo(Skill)