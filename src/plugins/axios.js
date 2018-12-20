import Vue from 'vue'
import cookie from 'js-cookie'
// 为了finally的兼容性
require('promise.prototype.finally').shim()

const networkError = 'Network Error'
export default function(context) {
  let {$axios, store, app, redirect} = context

  $axios.onRequest(config => {
    let url = config.url

    url += url.indexOf('?') > -1 ? '&' : '?'
    url += `token=${store.state.token}&tenantCode=${store.state.tenantCode}`

    // 调用用户中心的接口需要加上projectNo
    if (url.indexOf('/security/') > -1) {
      url += `&projectNo=${process.env.PROJECT_NO}`
    }

    config.url = url

    return config
  })

  $axios.onError(error => {
    if (error.message === networkError || !error.response) {
      Vue.$notify.error('无法连接到网络，请检查网络设置或稍后重试')
      return
    }

    if (process.client) {
      // axios 数据结构
      let resp = error.response
      let data = resp.data

      Vue.$notify.error({
        title: resp.status,
        message: data.payload || data.msg
      })

      if (resp.status == 401) {
        let path = app.router.options.base
        cookie.remove('token', {path})
        cookie.remove('userId', {path})
        redirect('/login')
      }
    }
    // TODO asyncData 的错误 需要日志监控
    else console.log('error', error)
  })
}
