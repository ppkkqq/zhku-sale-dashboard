/**
 * Created by levy on 2018/7/22.
 */
import cookie from 'js-cookie'

// 客户端鉴权
export default {
  async created() {
    if (process.env.NO_LOGIN > 0) return

    let token = cookie.get('token')
    let userId = cookie.get('userId')

    // 未登录
    if (!userId || !token) {
      // this.$router.replace('/login')
    }
    // 已登录但因为刷新, 状态丢失
    else if (!this.$store.state.userId) {
      this.$store.commit('update', {
        token,
        userId
      })

      try {
        await this.$store.dispatch('fetchUserAndMenuList', {userId})
        await this.$store.dispatch('fetchSource')
      } catch (e) {
        let path = this.$router.options.base
        if (path.slice(-1) === '/') {
          path = path.slice(0, -1)
        }

        cookie.remove('token', {path})
        cookie.remove('userId', {path})

        console.error('auth error: ', e)
        // this.$router.replace('/login')
      }
    }
  }
}
