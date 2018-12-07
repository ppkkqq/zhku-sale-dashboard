<template>
  <table class="table-info">
    <tbody>
      <tr v-for="(tr,index) in trs"
          :key="index">
        <template v-for="(td) in tr">
          <td class="label">{{td.label}}</td>
          <td class="value">{{td.value}}<span v-if="td.label === '退货说明'" style="color: blue;cursor: pointer;" @click="showDetail">  查看详情</span></td>
          <!--<div class="instruction">-->
            <!--<el-form label-width="100px">-->
            <!--<el-form-item label="内容说明">-->
              <!--<span>{{td.value}}</span>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
          <!--</div>-->
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
      //console.log(1122,this.table)
      const trs = chunk(this.table, 2)
      // console.log(3344,trs)
      return trs.map(tr => {
        if (tr.length === 1) {
          //如果长度为1，增加空占位
          tr.push({label: '', value: ''})
        }
        // console.log(5566,tr)
        return tr
      })
    }
  },
  methods: {
    showDetail() {
      this.$emit('send', true)
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
  .instruction {

  }
}
</style>
