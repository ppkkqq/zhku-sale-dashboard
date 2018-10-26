import {NUMBERPattern} from '@/const/pattern'

const checkPrice = (val, callback, str, isRequired) => {
  if (val <= 0 || val === '0') {
    callback(str + '必须大于0')
    return
  }
  if (!val) {
    isRequired ? callback(str + '不能为空, 或者无效的数字') : callback()
    return
  }
  if (!NUMBERPattern.test(val)) {
    callback(str + '必须为数字值')
    return
  }
  if (String(val).indexOf('e') > -1) {
    callback('请勿使用科学计数法')
    return
  }
  callback()
}

export const headImg = (rule, value, callback) => {
  if (!value[0]) {
    callback('请上传主图')
  }
  callback()
}
