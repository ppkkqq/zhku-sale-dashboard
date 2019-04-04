<template>
  <div class="login">
    <!--样式在layout/login-->
    <div class="main">
      <el-form :model="form" status-icon :rules="rules" ref="loginForm" class="">
        <el-form-item label="" prop="username">
          <el-input placeholder="账号" v-model.trim="form.username"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input placeholder="密码" type="password" v-model.trim="form.password" auto-complete="off" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" :loading="loading" size="medium">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'login',
  name: 'login',
  components: {},
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '请输入账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    login() {
      if (this.form.username === 'admin' && this.form.password === '123') {
        this.loading = false
        this.$router.replace('/')
      } else {
        this.$notify({
          title: '提示',
          message: '用户名密码错误',
          type: 'error'
        })
        return false
      }
    }
  }
}
</script>
