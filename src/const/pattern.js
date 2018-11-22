// 以http或者https开头的网址
export const httpPattern = /^(https?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/

// 密码校验 6-16位数 仅为字母和数字
export const pswPattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/

// 手机号码校验
export const telPattern = /^(13[0-9]|14[5-9]|15[0-9]|16[5-6]|17[0-35-8]|18[0-9]|19[8-9])\d{8}$|^(14[014]|174)0\d{7}$/
// export const telPattern = /^(13\d|14[579]|15[^4\D]|17[^49D]|18\d)\d{8}/

// 身份证号码校验
// export const idCardPattern = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/

export const idCardPattern = /^\d{17}[0-9Xx]|\d{15}/
// 社会统一信用代码校验
export const socialCreditCodePattern = /^[0-9A-HJ-NPQRTUWXY]{18}$/

export const tableNamePattern = /^[a-zA-Z_]+$/
// TODO 总结分组捕获
export const packageNamePattern = /^([a-zA-Z]+[\.][a-zA-Z]+)*$/

export const contextPattern = /^\/[a-zA-Z\-]*$/

export const emailPattern = /^\w[-\w\.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
// 固话
export const phonePattern = /^(0\d{2}-?\d{7,8}|0\d{3}-?\d{7,8})$/

// 邮政编码
export const postcodePattern = /^[1-9][0-9]{5}$/
export const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$$/
// 汉字
export const CHINESEPattern = /[\\u4e00-\\u9fa5]*$/
// 英文
export const ENGLISHPattern = /^[A-Za-z]+$/
// 数字
export const NUMBERPattern = /\d+/
// 自然数
export const NATURAL_NUMBERPattern = /[0-9]+/
// 英文和数字
export const ENGLISH_NUMBERPattern = /^[A-Za-z0-9]+$/

// 整数
export const integer = /^(-)?\d+$/

// 正整数
export const positiveInteger = /^\d+$/
//只能输中文
// export const onlyChina = /[^\u4E00-\u9FA5]/g
export const onlyChina = /^[\u4E00-\u9FA5]+$/
