import { message } from 'antd'

export function validateFields(form, success) {
  return form.validateFields()
    .then(success)
    .catch(error => {
      console.log(error)
      message.error('表单数据有误')
    })
}