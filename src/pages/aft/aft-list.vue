<template>
  <div :class="pageName">
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
      :extraButtons="extraButtons"
      :operationAttrs="operationAttrs"
      data-path="payload.list"
      totalPath="payload.total"
      :searchForm="searchForm"
      :customQuery="customQuery"
      @reset="handleReset"
    >
      <template slot="search">
        <!--售后申请时间-->
        <el-form-item label="售后申请时间">
          <el-date-picker
            :clearable="false"
            @change="setTime"
            value-format="yyyy-MM-dd"
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </template>
    </el-data-table>
    <!-- 审核弹框 -->
    <el-dialog
      title="审核退款"
      :visible.sync="dialogVisible"
      class="verify-dialog"
      :before-close="beforeClose"
    >
      <el-form ref="comboForm" :model="reviewForm" label-width="120px" :rules="reviewRules">
        <el-form-item label="审核" prop="approve">
          <el-radio-group v-model="reviewForm.approve">
            <el-radio label="true">通过</el-radio>
            <el-radio label="false">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="rejectRemark">
          <el-input
            v-model="reviewForm.rejectRemark"
            placeholder="请输入"
            type="textarea"
            :rows="2"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" v-loading="comboLoading" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 物流弹框 -->
    <el-dialog title="查看订单物流" :visible.sync="outerVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号: ">{{orderCode}}</el-form-item>
      </el-form>
      <div>
        <el-table :data="trackList" style="width: 100%">
          <el-table-column prop="expTextName" label="快递公司" width="180"></el-table-column>
          <el-table-column prop="mailNo" label="快递单号" width="180"></el-table-column>
          <el-table-column prop="tel" label="快递联系电话" min-width="180"></el-table-column>
          <el-table-column label="操作" fixed="right" v-if="canViewInner">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDetail()">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        class="inner-dialog"
        title="查看"
        :visible.sync="innerVisible"
        @open="outerVisible=false"
        @close="outerVisible = true"
        append-to-body
      >
        <el-form class="title-left" v-model="trackDetail" ref="form" label-width="120px">
          <el-form-item label="快递单号: ">{{trackDetail.mailNo}}</el-form-item>
          <el-form-item label="快递公司: ">{{trackDetail.expTextName}}</el-form-item>
          <el-form-item label="快递联系电话: ">{{trackDetail.tel}}</el-form-item>
          <!-- <el-form-item label="收货地址: ">{{ trackDetail.deliveryAddress}}</el-form-item> -->
        </el-form>
        <div v-for="(step,index) in trackDetail.data" :key="index" class="steps is-flex">
          <div class="steps-head"></div>
          <div class="steps-body">
            <div class="steps-date">{{step.date}}</div>
            <div class="steps-day">{{step.day}}</div>
            <div class="steps-time">{{step.time}}</div>
            <div class="steps-description">{{step.remark}}</div>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {refundList, refundAudit, findLogisticsInfo} from '@/const/api'
import {
  statusOpts,
  searchForm,
  columns,
  daishouhuo,
  returning
} from '@/const/aft'
import {aftDetail} from '@/const/path'
import {formatDate} from '@/const/filter'

const num2day = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export default {
  name: 'aft-list',
  components: {},
  data() {
    return {
      pageName: 'aft-list',
      url: refundList,
      operationAttrs: {
        width: 180,
        fixed: 'right'
      },
      dialogVisible: false,
      outerVisible: false,
      innerVisible: false,
      comboLoading: false,
      canViewInner: false,
      reviewForm: {
        approve: 'true',
        rejectRemark: ''
      },
      orderCode: '',
      trackCache: {},
      trackList: [],
      trackDetail: {
        deliveryAddress: '',
        logisticsCompanyName: '',
        trackNum: '',
        phone: '',
        infos: []
      },
      columns,
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: this.go2Detail
        },
        // {
        //   text: '审核',
        //   atClick: row => {this.dialogVisible = true}
        // },
        {
          text: '查看物流',
          show: row => {
            return row.status === daishouhuo || row.status === returning
          },
          atClick: this.go2Logistics
        }
      ],
      dateRange: '',
      customQuery: {
        startDate: '',
        endDate: ''
      },
      searchForm,
      reviewRow: {}
    }
  },
  computed: {
    reviewRules() {
      let rules = {
        approve: [
          {
            required: true,
            message: '请输入审核结果',
            trigger: 'change'
          }
        ],
        rejectRemark: [
          {
            required: this.reviewForm.approve !== 'true',
            message: '请输入备注信息'
          }
        ]
      }
      return rules
    }
  },
  methods: {
    setTime() {
      this.customQuery.startDate = this.dateRange[0]
      this.customQuery.endDate = this.dateRange[1]
    },
    handleReset() {
      this.customQuery.startDate = ''
      this.customQuery.endDate = ''
      this.dateRange = []
    },
    go2Detail(row) {
      //查看
      this.$router.push(`${aftDetail}?refundId=${row.id}`)
    },
    go2Logistics(row) {
      let logisticsCompanyCode = row.logisticsCompanyCode
      let logisticsCode = row.logisticsCode
      this.trackList = []
      if (!logisticsCompanyCode || !logisticsCode) {
        this.$message({
          type: 'warn',
          message: '没有快递信息'
        })
        return
      }

      // 缓存
      let cache = this.trackCache[logisticsCode]
      if (cache && cache.data) {
        this.trackList = [cache]
        this.trackDetail = cache
        this.canViewInner = true
        this.orderCode = row.orderCode
        this.visible = true
        this.outerVisible = true
        return
      }

      let url = `${findLogisticsInfo}?logisticsCompanyCode=${logisticsCompanyCode}&logisticsOrder=${logisticsCode}`
      this.$axios
        .$post(url)
        .then(res => {
          let logisticsDetail = res.payload
          if (!logisticsDetail) {
            this.$message({
              type: 'warn',
              message: '没有快递信息'
            })
            return
          }
          this.canViewInner = true

          logisticsDetail.data.forEach(info => {
            info.date = formatDate(info.time, 'YYYY-MM-DD')
            info.day = num2day[new Date(info.time).getUTCDay()]
            info.time = formatDate(info.time, 'HH:mm:ss')
            info.remark = info.context
          })
          this.trackCache[logisticsDetail.mailNo] = logisticsDetail
          this.trackList = [logisticsDetail]
          this.trackDetail = logisticsDetail
        })
        .catch()
      this.orderCode = row.orderCode
      this.visible = true
      this.outerVisible = true
    },
    handleDetail() {
      this.innerVisible = true
    },
    handleConfirm() {
      this.$refs.comboForm.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    submit() {
      let data = {
        id: this.reviewRow.id,
        ...this.reviewForm
      }
      this.$axios
        .$post(refundAudit, data)
        .then(resp => {
          this.beforeClose()
          this.$refs.dataTable.getList()
        })
        .catch(err => {
          this.beforeClose()
        })
    },
    beforeClose(done) {
      this.$refs.comboForm.resetFields()
      done ? done() : (this.dialogVisible = false)
    }
  }
}
</script>
<style scoped lang="stylus">
.inner-dialog{
  .el-form-item {
    margin-bottom 0
  }
  .steps-body{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    .steps-date {
      margin-right 10px
      font-weight bold
    }
    .steps-day {
      margin-right 10px
      font-weight bold
    }
    .steps-time {
      margin-right 10px
    }
  }
}
</style>
