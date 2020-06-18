import { combineReducers } from 'redux'
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  // SHOW_ERROR_MSG,
  RESET_USER,
  ADD_RESUME,
  RESET_RESUME,
  UPDATE_SEARCH_STATUS,
  TEMPORARY_RESUME,
  UPDATE_RECOMMEND_STATUS
} from './action-types'
import storageUtils from '@/utils/storageUtils'
import { resumeConfig } from '@/config/resumeConfig'

/**
 * 管理headerTitle
 */
const initHeadTitle = '首页'

function headerTitle(state = initHeadTitle, action) {
  switch(action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

/**
 * 管理user状态
 */
const initUser = storageUtils.getUser()

function user(state = initUser, action) {
  switch(action.type) {
    case RECEIVE_USER:
      return action.user
    // case SHOW_ERROR_MSG:
    //   return { // 不要直接修改原state
    //     ...state,
    //     errorMsg: action.errorMsg
    //   }
    case RESET_USER:
      return {}
    default:
       return state
  }
}

/**
 * 管理简历编辑
 */
const initResume = storageUtils.getResume()

function getProgress(resume) {
  let progress = 0
  for(let i = 0; i < resumeConfig.length; i++) {
    if(
      !!resume[resumeConfig[i].key.toLowerCase()] &&
      JSON.stringify(resume[resumeConfig[i].key.toLowerCase()]).length !== 2
    ) progress += (100 / resumeConfig.length)
  }
  progress = progress.toFixed(2)
  if(progress >= 100) progress = 100
  return progress
}
function resume(state = initResume, action) {
  switch(action.type) {
    case ADD_RESUME:
      let resume = Object.assign({}, state, action.data)
      resume.progress = getProgress(resume)
      return resume
    case TEMPORARY_RESUME:
      return action.data
    case RESET_RESUME:
      return {
        resume_name: '未命名简历',
        progress: 0
      }
    default:
      return state
  }
}

/**
 * 管理招聘搜索状态，实现keep-alive
 */
export const initStatus = {
  searchType: 'positionname',
  searchValue: '',
  pageNum: 1,
  jobs: [],
  total: 0
}

function searchStatus(state = initStatus, action) {
  switch(action.type) {
    case UPDATE_SEARCH_STATUS:
      return action.data
    default:
      return state
  }
}

export const initPage = {
  page: 0,
  last_time: 0
}

function recommendStatus(state = initPage, action) {
  switch(action.type) {
    case UPDATE_RECOMMEND_STATUS:
      return action.data
    default:
      return state
  }
}

export default combineReducers({
  headerTitle,
  user,
  resume,
  searchStatus,
  recommendStatus
})