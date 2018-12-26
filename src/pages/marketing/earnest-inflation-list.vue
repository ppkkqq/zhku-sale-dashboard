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
import {earnestInflationDetail} from '@/const/path'
import {Object2Options, source4Options} from '@/const/filter'
import {earnestList, earnestCancel, shopName} from '@/const/api'
import {status} from '@/const/marketing'
import {formatDate} from '@/const/filter'
export default {
  name: 'discount-list',
  components: {},
  data() {
    return {
      pageName: 'discount-list',
      url: earnestList,
      activeName: '',
      customQuery: {
        startTime: '',
        endTime: ''
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
          prop: 'earnestPayTime',
          label: '定金支付时间',
          minWidth: 168,
          formatter: row => {
            return (
              formatDate(row.earnestPayStartTime, 'YYYY-MM-DD HH:mm:ss') +
              '至' +
              formatDate(row.earnestPayEndTime, 'YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          prop: 'finalPayTime',
          label: '尾款支付时间',
          minWidth: 168,
          formatter: row => {
            return (
              formatDate(row.finalPayStartTime, 'YYYY-MM-DD HH:mm:ss') +
              '至' +
              formatDate(row.finalPayEndTime, 'YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          prop: 'earnestPayCount',
          label: '定金支付人数'
        },
        {
          prop: 'finalPayCount',
          label: '尾款支付人数'
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
          $options: []
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
      this.$router.push({
        path: earnestInflationDetail,
        query: {
          id: row.id
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
            .$put(`${earnestCancel}?id=${row.id}&obtainedReason=${value}`)
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
    },
    getShopName() {
      this.$axios.$get(shopName).then(res => {
        this.searchForm[1].$options = source4Options(res.payload)
      })
    }
  },
  created() {
    this.tabs = tabs
    this.getShopName()
  }
}
</script>
<style lang="stylus">
</style>
