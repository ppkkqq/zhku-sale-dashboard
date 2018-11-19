<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="false"
      :isTree="false"
      :hasPagination="true"
      :searchForm="searchForm"
      :dataPath="payload"
      :totalPath="totalPath">
    </el-data-table>
  </div>
</template>

<script>
import {records} from '@/const/api'
import {formatDate} from '@/const/filter'

export default {
  name: 'top-up-record',
  data() {
    return {
      pageName: 'top-up-record',
      url: records,
      //实际中去掉了用户手机号的列，充值前值和充值后值合并为充值总额。
      columns: [
        {
          label: '序号',
          type: 'index',
          minwidth: 100
        },
        {
          prop: 'memberName',
          label: '会员昵称'
        },
        {
          prop: 'memberPhone',
          label: '会员手机号',
          width: '140px'
        },
        {
          prop: 'userName',
          label: '用户名称'
        },
        {
          prop: 'batchAmt',
          label: '充值总额'
        },
        {
          prop: 'balance',
          label: '充值余额'
        },
        {
          prop: 'eventTime',
          label: '充值时间',
          width: '150px',
          formatter: row => {
            return formatDate(row.eventTime, 'YYYY-MM-DD HH:mm:ss')
          }
        }
      ],

      //实际中去掉了会员名称和用户手机号输入框
      searchForm: [
        {
          $el: {
            placeholder: '请输入会员手机号'
          },
          label: '会员手机号',
          $id: 'memberPhone',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入用户名称'
          },
          label: '用户名称',
          $id: 'userName',
          $type: 'input'
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
