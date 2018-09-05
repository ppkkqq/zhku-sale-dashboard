<template>
  <el-row :class="isWithBorder">
    <el-button :type="btnType" :size="size" @click="defaultBack" icon="el-icon-arrow-left">{{btnText}}</el-button>
  </el-row>
</template>

<script>
export default {
  components: {},
  name: 'back',
  props: {
    btnType: {type: String, default: 'text'},
    btnText: {type: String, default: '返回'},
    size: {type: String, default: 'medium'},
    handleBack: {type: Function},
    withBorder: {type: Boolean, default: false}
  },
  data() {
    return {}
  },
  methods: {
    defaultBack() {
      if (this.handleBack) {
        this.handleBack()
        return
      }
      this.$router.back()
    }
  },
  computed: {
    isWithBorder() {
      return this.withBorder ? 'with-border' : ''
    }
  }
}
</script>
<style lang="stylus">
  .with-border {
    border-bottom: 1px solid #ddd;
    padding: 5px 0;
  }
</style>
