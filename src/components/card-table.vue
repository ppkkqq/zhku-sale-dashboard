<template>
  <div class="card-table">
    <div class="header">
      <h3>{{header}}</h3>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>

</template>

<script>
export default {
  name: 'card-table',
  props: ['header']
}
</script>

<style lang="stylus">
.card-table {
  .header {
    padding: 15px 0px;
  }

  .body {
    margin-left: 20px;
  }

  &+& {
    margin-top: 20px;
  }
}
</style>
