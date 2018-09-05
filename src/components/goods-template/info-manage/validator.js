import {NUMBERPattern} from '@/const/pattern'

const checkPrice = (val, callback, str, isRequired) => {
  if (val < 0 || val === '0' || val === 0) {
    callback(str + '必须大于0')
    return
  }
  if (!val) {
    isRequired ? callback(str + '不能为空') : callback()
    return
  }
  if (!NUMBERPattern.test(val)) {
    callback(str + '必须为数字值')
    return
  }
  callback()
}

export const checkDepositPercent = (rule, val, callback) =>
  checkPrice(val, callback, '定金', true)

export const checkCommercialInsurance = (rule, val, callback) =>
  checkPrice(val, callback, '商业险赠送')

export const checkStrongInsurance = (rule, val, callback) =>
  checkPrice(val, callback, '交强险赠送')

export const headImg = (rule, value, callback) => {
  if (!value[0]) {
    callback('请上传主图')
  }
  callback()
}
