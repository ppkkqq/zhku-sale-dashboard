<template>
  <div class="refund-detail">
    <el-card shadow="never" class="border-0">
      <div slot="header">
        <h2>退款单详情</h2>
      </div>
      <card-table header="单据信息">
        <table-info :table="orderInfoTable"></table-info>
      </card-table>
      <card-table header="车辆信息">
        <div class="car-info">
          <div class="img">
            <img :src="this.car.imgUrl" />
          </div>
          <div class="table">
            <table-info :table="carInfoTable"></table-info>
          </div>
        </div>
      </card-table>
      <card-table header="支付信息"
                  v-if="payment.length>0">
        <el-table :data="payment"
                  border
                  style="width: 100%">
          <el-table-column v-for="(data, index) in paymentTable"
                           :key="index"
                           :prop="data.prop"
                           :label="data.label"
                           :formatter="data.formatter"
                           :width="data.width">
          </el-table-column>
        </el-table>
      </card-table>

      <card-table header="退款信息"
                  v-if="refund.length>0">
        <el-table :data="refund"
                  border
                  style="width: 100%">
          <el-table-column v-for="(data, i) in refundTable"
                           :key="i"
                           :prop="data.prop"
                           :label="data.label"
                           :width="data.width"
                           :formatter="data.formatter"
                           >
          </el-table-column>
        </el-table>
      </card-table>
      <card-table header="退款审核">
        <table-info :table="refundAudit"></table-info>
      </card-table>
    </el-card>
  </div>
</template>

<script>
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import {refundDetail} from '@/const/api'
import {formatDate, Object2Options, toOptionsLabel, price} from '@/const/filter'
import {orderStatusOptions, orderTypeOptions, productType} from '@/const/config'
import {statusOpts} from '@/const/refund'

export default {
  name: 'refund-detail',
  components: {
    CardTable,
    TableInfo
  },
  data() {
    return {
      query: this.$route.query,
      tableData: [
        {
          date: '2016-05-02',
          name: '张三',
          result: '通过',
          desc: '还没提车'
        }
      ],
      detail: {},
      statusOpts,
      orderStatusOptions,
      paymentTable: [
        {prop: 'tradeOrderId', label: '支付流水号'},
        {
          prop: 'payMoney',
          label: '支付金额',
          formatter: row => price(row.payMoney)
        },
        {prop: 'payChannel', label: '支付通道'},
        {
          prop: 'payStatus',
          label: '支付状态',
          formatter: row => toOptionsLabel(row.payStatus, orderStatusOptions)
        },
        {
          prop: 'paidAt',
          label: '支付时间',
          formatter: row => formatDate(row.paidAt),
          width: '180'
        }
      ],
      refundTable: [
        {
          prop: 'createdAt',
          label: '退款时间',
          formatter: row => formatDate(row.createdAt),
          width: '180'
        },
        {
          prop: 'refundMoney',
          label: '退款金额',
          formatter: row => price(row.refundMoney)
        },
        {prop: 'id', label: '退款单号'},
        {
          prop: 'status',
          label: '退款状态',
          formatter: row => statusOpts[row.status]
        },
        {prop: 'refundTypeId', label: '退款原因'},
        {prop: 'description', label: '退款说明'}
      ]
    }
  },
  computed: {
    trade() {
      return this.detail.outDtoTradeOrder || {}
    },
    orderInfoTable() {
      //单据信息
      const {
        id,
        createdAt,
        memberName,
        memberPhone,
        shopName,
        remark,
        status,
        payMoney = '',
        maxDeposit = ''
      } = this.trade
      const data = {
        创建时间: formatDate(createdAt),
        订单号: id,
        客户姓名: memberName,
        手机号: memberPhone,
        门店: shopName,
        订单金额: price(payMoney),
        订金: price(maxDeposit),
        订单状态: toOptionsLabel(status, orderStatusOptions),
        客户备注: remark
      }
      return Object2Options(data, 'value')
    },
    products() {
      //商品，多个，是个数组
      return this.detail.outDtoTradeOrderLines || []
    },
    car() {
      //新车
      const data = this.products.filter(
        item => item.productType === productType['新车']
      )
      return data[0] || {}
    },
    carInfoTable() {
      const data = {
        车系: this.car.bundleCarSeriesName,
        品牌: this.car.bundleCarBrandName,
        车型编号: this.car.vehicleModelCode,
        车型名称: this.car.bundleCarModelName,
        指导价: price(this.car.guidancePrice),
        门店单价: price(this.car.shopPrice),
        规格组合: this.car.propValues
      }
      return Object2Options(data, 'value')
    },
    payment() {
      return this.detail.outDtoOrderPayments || []
    },
    refund() {
      return this.detail.refundOrders || []
    },
    refundAudit() {
      // 当订单未审核的时候 退款审核不显示内容
      let init = {
        updatedAt: '',
        updatedBy: '',
        status: '',
        rejectRemark: ''
      }
      let auditData =
        this.refund[0] && this.refund[0].status !== 'WAIT_AUDIT'
          ? this.refund[0]
          : init
      const data = {
        操作时间: formatDate(auditData.updatedAt),
        审核人: auditData.updatedBy,
        审核结果: statusOpts[auditData.status],
        备注信息: auditData.rejectRemark
      }
      return Object2Options(data, 'value')
    }
  },
  methods: {
    getDetail() {
      this.$axios
        .$get(refundDetail + `?orderId=${this.query.id}`)
        .then(resp => {
          this.detail = resp.payload
        })
        .catch(err => {
          this.$message.error('获取退款详情失败! 请稍后再试!')
        })
    },
    formatDate,
    price,
    toOptionsLabel
  },
  mounted() {
    this.getDetail()
  }
}
</script>

<style lang="stylus">
.refund-detail {
  .car-info {
    display flex
    width 100%

    .img {
      margin auto
      margin-right: 30px;
    }

    .table {
      flex 1
    }

    img {
      max-width 120px
    }
  }
  .tab-container {
    margin-top 30px
    min-height 300px
  }
}
</style>
