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
// import {discountDetail} from '@/const/path'
import {Object2Options} from '@/const/filter'
import {goodsLists} from '@/const/api'
import {status, actStatus} from '@/const/marketing'

export default {
  name: 'discount-list',
  components: {},
  data() {
    return {
      pageName: 'discount-list',
      url: goodsLists,
      // url: 'http://yapi.deepexi.io:5002/mock/398/http://yapi.deepexi.io:5002/mock/398/mall-deepexi-marking-center/api/v1/earnest/list',
      activeName: '',
      // TODO: 对接
      customQuery: {
        startEffectTime: '',
        endEffectTime: ''
      },
      effectTime: [],
      columns: [
        {
          prop: 'code',
          label: '活动名称'
        },
        {
          prop: 'code1',
          label: '所属商户'
        },
        {
          prop: 'code3',
          label: '有效时间'
        },
        {
          prop: 'code2',
          label: '活动订单总金额（元）',
          minWidth: 120
        },
        {
          prop: 'code14',
          label: '付款订单数'
        },
        {
          prop: 'timeStatus',
          label: '活动状态',
          formatter: row => this.actStatus[row.timeStatus]
        }
      ],
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => this.go2Detail(row, 1)
        },
        {
          text: '下架活动',
          type: 'danger',
          // show: row => {
          //   return row.status == ''
          // },
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
          $id: 'code',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请选择'
          },
          label: '所属商户',
          $id: 'mobile',
          $type: 'select',
          $options: [
            {
              label: '国投自营',
              value: 0
            },
            {
              label: '我买网',
              value: 1
            },
            {
              label: '京东',
              value: 3
            }
          ]
        }
      ]
    }
  },

  methods: {
    handleClick(val) {
      this.customQuery.status = val
      this.$refs.dataTable.getList()
    },
    go2Detail(row, isView) {
      this.$router.push({
        // path: discountDetail,
        query: {
          refundId: row ? row.id : undefined,
          isView: isView
        }
      })
    },
    onCancel(row) {
      this.$prompt('下架理由', '是否确定下架活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({value}) => {
          //TODO: 接口对value
          this.$message({
            type: 'success',
            message: '成功下架活动!'
          })
        })
        .catch()
    },
    setEffectTime() {
      this.customQuery.startEffectTime = this.effectTime[0]
      this.customQuery.endEffectTime = this.effectTime[1]
    },
    handleReset() {
      this.customQuery.startEffectTime = ''
      this.customQuery.endEffectTime = ''
      this.effectTime = []
    }
  },
  created() {
    this.tabs = tabs
    this.actStatus = actStatus
  }
}
</script>
<style lang="stylus">
</style>
