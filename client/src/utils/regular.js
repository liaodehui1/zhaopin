export const username_reg = /^[a-zA-Z0-9_]+$/
export const password_reg = /^[a-zA-Z0-9_]+$/
export const phone_reg = /^1[3-9]\d{9}$/
export const email_reg = /^(\w+)(\.\w+)*@(\w+)((\.\w+)+)$/
export const account_reg = /^([a-zA-Z0-9_]+|1[3-9]\d{9}|(\w+)(\.\w+)*@(\w+)((\.\w+)+))$/
export const CHORUS_reg = /^([\u4e00-\u9fa5]+|[a-zA-Z\s]+)$/

export function validatorUserName(username) {
  return username_reg.test(username)
}
export function validatorPassword(password) {
  return password_reg.test(password)
}
export function validatorPhone(phone) {
  return phone_reg.test(phone)
}
export function validatorEmail(email) {
  return email_reg.test(email)
}
export function validatorAccount(account) {
  return account_reg.test(account)
}