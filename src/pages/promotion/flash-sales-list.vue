
<template>
  <div :class="pageName">
    <el-row>
      <el-button @click="newRules()">新增规则</el-button>
    </el-row>
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasPagination="true"
      data-path="payload.list"
      totalPath="payload.total"
      :operationAttrs="operationAttrs"
      :extraButtons="extraButtons"
    >
    </el-data-table>

  </div>
</template>

<script>
import {flashSalesDetail} from '@/const/path'
import {flashSalesList, flashSalesStatus} from '@/const/api'
import {activityStatus} from '@/const/marketing'

const NORMAL = 'NORMAL'
const FORBIDDEN = 'FORBIDDEN'
export default {
  name: 'flash-sales-list',
  components: {},
  data() {
    return {
      url: flashSalesList,
      columns: [
        {
          prop: 'tmarTitle',
          label: '规则名称'
        },
        {
          prop: 'tmarPartakeCount',
          label: '参与次数'
        },
        {
          prop: 'tmarLimitCount',
          label: '抢购限定数量'
        },
        {
          prop: 'tmarDesc',
          label: '描述'
        },
        {
          prop: 'tmarCreatedAt',
          label: '创建时间'
        },
        {
          prop: 'tmarUpdatedAt',
          label: '修改时间'
        },
        {
          prop: 'tmarStatus',
          label: '状态',
          formatter: row => activityStatus[row.tmarStatus]
        }
      ],
      pageName: 'flash-sales-list',
      operationAttrs: {
        width: 240,
        fixed: 'right'
      },
      extraButtons: [
        {
          text: '编辑',
          type: 'primary',
          atClick: row => {
            this.$router.push({
              path: flashSalesDetail,
              query: {
                id: row.tmarId
              }
            })
          }
        },
        {
          type: 'primary',
          text: '启用',
          show: row => {
            return activityStatus[row.tmarStatus] === '禁用'
          },
          atClick: row => {
            this.switchStatus(row)
          }
        },
        {
          type: 'default',
          text: '禁用',
          show: row => {
            return activityStatus[row.tmarStatus] === '启用'
          },
          atClick: row => {
            this.switchStatus(row)
          }
        },
        {
          text: '查看',
          type: 'primary',
          atClick: row => {
            this.$router.push({
              path: flashSalesDetail,
              query: {
                isView: 1,
                id: row.tmarId
              }
            })
          }
        }
      ]
    }
  },
  mounted() {},
  computed: {},
  methods: {
    newRules() {
      this.$router.push(flashSalesDetail)
    },
    switchStatus(row) {
      let changeStatus = {
        tmarId: row.tmarId,
        tmarStatus: row.tmarStatus
      }
      this.$axios.put(flashSalesStatus, changeStatus).then(resp => {
        console.log(resp)
      })
    }
  }
}
</script>
