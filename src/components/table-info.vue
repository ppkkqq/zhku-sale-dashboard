<template>
  <table class="table-info">
    <tbody>
      <tr v-for="(tr,index) in trs"
          :key="index">
        <template v-for="(td) in tr">
          <td class="label">{{td.label}}</td>
          <td class="value">{{td.value}}</td>
        </template>
      </tr>
      <slot></slot>
    </tbody>
  </table>

</template>

<script>
import chunk from 'lodash/chunk'
export default {
  name: 'table-info',
  props: ['table'],
  computed: {
    trs() {
      //处理下数据格式
      const trs = chunk(this.table, 2)
      return trs.map(tr => {
        if (tr.length === 1) {
          //如果长度为1，增加空占位
          tr.push({label: '', value: ''})
        }
        return tr
      })
    }
  }
}
</script>

<style lang="stylus">
.table-info {
  border: 1px solid #dee2e6;
  border-collapse: collapse;
  width: 100%;

  td {
    padding: 12px;
    text-align: center;
    border: 1px solid #dee2e6;
  }

  .label {
    background-color: #f5f5f5;
    width: 20%;
  }

  .value {
    width: 30%;
    word-wrap: break-word;
  }
}
</style>
