<template>
  <div :class="pageName">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value"></el-tab-pane>
    </el-tabs>
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :operationAttrs="operationAttrs"
      :extraButtons="extraButtons"
      :customQuery="customQuery"
      :searchForm="searchForm"
      totalPath="payload.total"
      data-path="payload.list"
      @reset="handleReset"
    >
      <template slot="search">
        <el-form-item label="有效期">
          <el-date-picker
            @change="setEffectTime"
            value-format="yyyy-MM-dd"
            v-model="effectTime"
            type="daterange"
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
      </template>
    </el-data-table>
  </div>
</template>

<script>
const tabs = Object2Options(status)
import {discountDetail} from '@/const/path'
import {Object2Options} from '@/const/filter'
import {goodsLists, limitedTimePlatList, activityCancel} from '@/const/api'
import {status} from '@/const/marketing'
import {formatDate} from '@/const/filter'

export default {
  name: 'discount-list',
  components: {},
  data() {
    return {
      pageName: 'discount-list',
      url: limitedTimePlatList,
      activeName: '',
      // TODO: 对接
      customQuery: {
        startTime: '',
        endTime: '',
        timeStatus: ''
      },
      effectTime: [],
      columns: [
        {
          prop: 'title',
          label: '活动名称'
        },
        {
          prop: 'shopName',
          label: '所属商户'
        },
        {
          prop: 'effectTime',
          label: '有效时间',
          width: '168px',
          formatter: row => {
            return (
              formatDate(row.startTime, 'YYYY-MM-DD HH:mm:ss') +
              '至' +
              formatDate(row.endTime, 'YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          prop: 'activeOrderTotalMoney',
          label: '活动订单总金额（元）',
          minWidth: 120
        },
        {
          prop: 'paymentOrderCount',
          label: '付款订单数'
        },
        {
          prop: 'timeStatus',
          label: '活动状态',
          formatter: row => status[row.timeStatus]
        }
      ],
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => this.goDetail(row)
        },
        {
          text: '下架活动',
          type: 'danger',
          show: row => {
            return (
              row.timeStatus == 'not_start' || row.timeStatus == 'processing'
            )
          },
          atClick: row => this.onCancel(row)
        }
      ],
      operationAttrs: {
        width: 200,
        fixed: 'right'
      },
      searchForm: [
        {
          $el: {
            placeholder: '请输入活动名称'
          },
          label: '活动名称',
          $id: 'title',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请选择'
          },
          label: '所属商户',
          $id: 'shopId',
          $type: 'select',
          //todo：对接口
          $options: [
            {
              label: '自营',
              value: '383f672aba6b43ec9dbe474dfcaf1702'
            },
            {
              label: '我买网',
              value: '67783a1d-1743-495f-a6e9-7a31a450ce47'
            },
            {
              label: '云投',
              value: '4e5817f5e5d64c4e98c7e14955fce0cd'
            }
          ]
        }
      ]
    }
  },

  methods: {
    handleClick(val) {
      this.customQuery.timeStatus = val.name
      this.$refs.dataTable.getList()
    },
    goDetail(row) {
      console.log(1122)
      this.$router.push({
        path: discountDetail,
        query: {
          activityId: row.id
        }
      })
    },
    onCancel(row) {
      this.$prompt('下架理由', '是否确定下架活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({value}) => {
          this.$axios
            .$put(
              `${activityCancel}?activityId=${row.id}&obtainedReason=${value}`
            )
            .then(res => {
              if (res.payload.code === '0') {
                this.$message({
                  type: 'success',
                  message: '成功下架活动!'
                })
                this.$refs.dataTable.getList()
              } else {
                this.$message.error('操作失败')
              }
            })
        })
        .catch()
    },
    setEffectTime() {
      this.customQuery.startTime = `${this.effectTime[0]} 00:00:00`
      this.customQuery.endTime = `${this.effectTime[1]} 23:59:59`
    },
    handleReset() {
      this.customQuery.startTime = ''
      this.customQuery.endTime = ''
      this.effectTime = []
    }
  },
  created() {
    this.tabs = tabs
  }
}
</script>
<style lang="stylus">
</style>
