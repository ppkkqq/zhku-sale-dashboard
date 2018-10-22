<template>
  <div class="refund-detail">
    <el-card shadow="never" class="border-0">
      <div slot="header">
        <h2 class="bar-left">退货详情
          <go-back class="ml-2"></go-back>
        </h2>
        <h2>
          订单状态：
          <span class="red">{{toOptionsLabel(this.trade.status, orderStatusOptions)}}</span>
        </h2>
      </div>
      <h3 class="mb-1">退款流转过程</h3>
      <el-steps :active="3" align-center>
        <el-step title="提交订单" description></el-step>
        <el-step title="商家审核通过" description></el-step>
        <el-step title="买家寄回货物" description></el-step>
        <el-step title="签收货物" description></el-step>
        <el-step title="验收货物" description></el-step>
        <el-step title="已完成" description></el-step>
      </el-steps>
      <card-table>
        <table-info :table="orderInfoTable"></table-info>
      </card-table>
      <div class="refund-table-info">
        <card-table header="退货人信息">
          <table class="table-info-one-column">
            <tbody>
              <tr v-for="(tr,index) in customerInfoTable" :key="index">
                <template>
                  <td class="label">{{tr.label}}</td>
                  <td class="value">{{tr.value}}</td>
                </template>
              </tr>
              <slot></slot>
            </tbody>
          </table>
        </card-table>
        <card-table header="配送信息">
          <table class="table-info-one-column">
            <tbody>
              <tr v-for="(tr,index) in deliveryInfoTable" :key="index">
                <template>
                  <td class="label">{{tr.label}}</td>
                  <td class="value">{{tr.value}}</td>
                </template>
              </tr>
              <slot></slot>
            </tbody>
          </table>
        </card-table>
        <card-table header="退款信息">
          <table class="table-info-one-column">
            <tbody>
              <tr v-for="(tr,index) in refundInfoTable" :key="index">
                <template>
                  <td class="label">{{tr.label}}</td>
                  <td class="value">{{tr.value}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </card-table>
      </div>
      <card-table header="退货商品">
        <el-data-table
          ref="dataTable"
          :url="url"
          :columns="returnGoodsColumns"
          :hasNew="false"
          :hasEdit="false"
          :hasDelete="false"
          :hasOperation="false"
          :isTree="false"
          :hasPagination="false"
          :extraParams="extraParams"
        ></el-data-table>
      </card-table>
      <card-table header="验货结果">
        <table-info :table="aftAudit"></table-info>
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
import {statusOpts} from '@/const/aft'
import GoBack from '@/components/GoBack'

export default {
  name: 'refund-detail',
  components: {
    CardTable,
    TableInfo,
    GoBack
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
      aftTable: [
        {
          prop: 'createdAt',
          label: '退款时间',
          formatter: row => formatDate(row.createdAt),
          width: '180'
        },
        {
          prop: 'aftMoney',
          label: '退款金额',
          formatter: row => price(row.aftMoney)
        },
        {prop: 'id', label: '退款单号'},
        {
          prop: 'status',
          label: '退款状态',
          formatter: row => statusOpts[row.status]
        },
        {prop: 'aftTypeId', label: '退款原因'},
        {prop: 'description', label: '退款说明'}
      ],
      returnGoodsColumns: [
        {prop: 'name', label: '序号'},
        {
          prop: 'logoUrl',
          label: '商品',
          formatter: this.logoFormatter,
          width: '300px'
        },
        {prop: 'name', label: '商品编码'},
        {prop: 'alias', label: '数量'},
        {prop: 'alias', label: '单价'},
        {prop: 'alias', label: '小计'},
        {prop: 'alias', label: '实际退款'}
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
        退货单号: '',
        退货原因: '',
        订单编号: id,
        退货说明: '',
        退款单号: '',
        会员账号: '',
        总商品金额: '',
        优惠金额: price(payMoney),
        源通币: '',
        运费: '',
        实付金额: '',
        实退款总金额: ''
      }
      return Object2Options(data, 'value')
    },
    customerInfoTable() {
      // const {
      //   id,
      //   createdAt,
      //   memberName,
      //   memberPhone,
      //   shopName,
      //   remark,
      //   status,
      //   payMoney = '',
      //   maxDeposit = ''
      // } = this.trade
      const data = {
        会员账号: '',
        联系电话: ''
      }
      return Object2Options(data, 'value')
    },
    deliveryInfoTable() {
      // const {
      //   id,
      //   createdAt,
      //   memberName,
      //   memberPhone,
      //   shopName,
      //   remark,
      //   status,
      //   payMoney = '',
      //   maxDeposit = ''
      // } = this.trade
      const data = {
        物流方式: '',
        快递公司: '',
        运费: '',
        物流单号: ''
      }
      return Object2Options(data, 'value')
    },
    refundInfoTable() {
      // const {
      //   id,
      //   createdAt,
      //   memberName,
      //   memberPhone,
      //   shopName,
      //   remark,
      //   status,
      //   payMoney = '',
      //   maxDeposit = ''
      // } = this.trade
      const data = {
        退款方式: '',
        退款渠道: '',
        退款时间: '',
        商品总额: '',
        应支付金额: '',
        运费金额: ''
      }
      return Object2Options(data, 'value')
    },
    products() {
      //商品，多个，是个数组
      return this.detail.outDtoTradeOrderLines || []
    },
    payment() {
      return this.detail.outDtoOrderPayments || []
    },
    aft() {
      return this.detail.aftOrders || []
    },
    aftAudit() {
      // 当订单未审核的时候 退款审核不显示内容
      let init = {
        updatedAt: '',
        updatedBy: '',
        status: '',
        rejectRemark: ''
      }
      let auditData =
        this.aft[0] && this.aft[0].status !== 'WAIT_AUDIT' ? this.aft[0] : init
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
        .$get(refundDetail + `?id=${this.query.refundId}`)
        .then(resp => {
          this.detail = resp.payload
        })
        .catch(err => {
          this.$message.error('获取退款详情失败! 请稍后再试!')
        })
    },
    logoFormatter(row) {
      return (
        <img
          src={row.logoUrl ? row.logoUrl : ''}
          style={{
            width: '100px',
            background: 'transparent',
            padding: '0'
          }}
        />
      )
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
    display: flex
    width: 100%

    .img {
      margin: auto
      margin-right: 30px
    }

    .table {
      flex: 1
    }

    img {
      max-width: 120px
    }
  }

  .red {
    color: #F70321
  }

  .bar-left {
    border-left: 4px solid #F70321
    padding-left: 10px
    margin-bottom: 20px
    display: flex
  }

  .ml-2 {
    margin-left: 20px
  }

  .mb-1 {
    margin-bottom: 10px
  }

  .is-finish {
    color: #F70321
    border-color: #F70321
  }

  .tab-container {
    margin-top: 30px
    min-height: 300px
  }

  .refund-table-info {
    display: flex
    width: 100%
    justify-content: space-between

    .card-table+.card-table {
      margin-top: 0
    }

    .card-table {
      width: 30%
    }
  }

  .table-info-one-column {
    border: 1px solid #dee2e6
    border-collapse: collapse
    width: 100%

    tbody {
      width: 100%
    }

    td {
      padding: 12px
      text-align: center
      border: 1px solid #dee2e6
    }

    .label {
      background-color: #f5f5f5
      width: 40%
    }

    .value {
      width: 60%
      word-wrap: break-word
    }
  }
}
</style>
