
<template>
  <div :class="pageName">
    <el-row>
      <el-button @click="newRules()" type="primary"  size="small">新增规则</el-button>
    </el-row>
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasDialog="true"
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
import {
  flashSalesList,
  flashSalesStatus,
  flashSalesActivityStatus
} from '@/const/api'
import {activityStatus} from '@/const/marketing'

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
          label: '抢购限定数量',
          minWidth: '120px'
        },
        {
          prop: 'tmarDesc',
          label: '描述'
        },
        {
          prop: 'tmarCreatedAt',
          label: '创建时间',
          width: '150px'
        },
        {
          prop: 'tmarUpdatedAt',
          label: '修改时间',
          width: '150px'
        },
        {
          prop: 'tmarStatus',
          label: '状态',
          formatter: row => activityStatus[row.tmarStatus]
        }
      ],
      pageName: 'flash-sales-list',
      operationAttrs: {
        width: 220,
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
            return row.tmarStatus === '0'
          },
          atClick: row => {
            this.switchStatus(row)
          }
        },
        {
          type: 'default',
          text: '禁用',
          show: row => {
            return row.tmarStatus === '1'
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
      let status = row.tmarStatus

      let changeStatus = {
        tmarId: row.tmarId,
        tmarStatus: status
      }

      if (status === '1') {
        changeStatus.tmarStatus = '0'
        this.$confirm('确定禁用吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$axios.put(flashSalesStatus, changeStatus).then(resp => {
            if (resp.data.payload === 1) {
              this.$message({
                type: 'error',
                message: '此类型规则参与的活动正在进行中,无法禁用！'
              })
            } else if (resp.data.payload === 0) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$refs.dataTable.getList() //刷新页面
            } else {
              this.$message({
                type: 'error',
                message: '操作失败'
              })
            }
          })
        })
      } else {
        changeStatus.status = '1'
        this.$confirm('确定启用吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$axios.put(flashSalesStatus, changeStatus).then(resp => {
            if (resp.data.payload === 0) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$refs.dataTable.getList() //刷新页面
            } else {
              this.$message({
                type: 'error',
                message: '操作失败！'
              })
            }
          })
        })
      }
    }
  }
}
</script>
