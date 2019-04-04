<template>
  <div >
    <div v-for="m in menuList" :key="m.id" class="menu-item">
      <!--展示外链开始，外链默认没有子菜单-->
      <!-- 没有子菜单，url有协议  -->
      <li class="el-menu-item"
          role="menuitem"
          tabindex="-1"
          :style="linkStyle"
          v-if="!m.children && isFullUrl(m.url)"
          @click="handleItem(m.url)"
      >
        <!-- 侧边栏收起 -->
        <el-tooltip
          effect="dark"
          placement="right"
          v-if="collapse"
        >
          <span slot="content">{{m.name}}</span>
          <!-- element menu-item 的默认样式-->
          <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;">
            <icon-font :icon="m.icon"></icon-font>
          </div>
        </el-tooltip>

        <!-- 侧边栏展开 -->
        <template v-else>
          <icon-font :icon="m.icon"></icon-font>
          <span>{{m.name}}</span>
        </template>
      </li>
      <!--展示外链结束-->

      <!-- 没有子菜单，url没有不带协议 -->
      <el-menu-item :index="m.url" v-if="!m.children && !isFullUrl(m.url)">
        <icon-font :icon="m.icon"></icon-font>
        <span slot="title">{{m.name}}</span>
      </el-menu-item>

      <el-submenu v-if="m.children" :index="m.id + ''">
        <template slot="title">
          <!--<i class="el-icon-menu"></i>-->
          <icon-font :icon="m.icon"></icon-font>
          <span class="sub-menu-title">{{m.name}}</span>
        </template>

        <menu-item :menuList="m.children"></menu-item>
      </el-submenu>
    </div>
  </div>
</template>

<script>
import IconFont from '@/components/IconFont.vue'

export default {
  name: 'MenuItem',
  components: {
    IconFont
  },
  props: {
    menuList: {
      type: Array
    },
    collapse: {
      type: Boolean
    },
    linkStyle: {type: Object} // 外链样式
  },
  methods: {
    isFullUrl(url) {
      // return url.indexOf('http') > -1
    },
    handleItem(url) {
      this.$emit('handleItem', url)
    }
  }
}
</script>
<style>
</style>
