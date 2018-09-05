<template>
  <el-card shadow="never" class="base-layout">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <el-button
        v-if="hasEdit"
        v-bind="$attrs"
        class="base--edit-btn"
        type="text"
        v-on="$listeners">
        {{ btnText }}
      </el-button>
    </div>
    <slot />
  </el-card>
</template>
<script>
import {Card} from 'element-ui'

export default {
  name: 'BaseLayout',
  props: {
    title: String,
    hasEdit: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '新增'
    }
  }
}
</script>

<style lang="stylus">
  .base-layout {
    margin-bottom 50px
    .base--edit-btn {
      float right
      padding 3px 0
    }
  }
</style>
