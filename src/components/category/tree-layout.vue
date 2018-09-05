<template>
  <div class="tree-layout"
       v-loading="loading">
    <div class="aside">
      <slot></slot>
    </div>
    <div class="content">
      <div class="up">
        <slot name='top'></slot>
      </div>
      <div class="down">
        <slot name='bottom'></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree-layout',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus">
.tree-layout {
  display: flex;
  padding: 20px;

  .aside {
    flex: 0 0 35%;
    height: 700px;
    margin-right: 10%;

    .header {
      margin-bottom: 20px;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .up {
      flex: 0 0 40%;
      margin-bottom: 10%;
    }

    .down {
      flex: 1;
    }
  }
}
</style>
