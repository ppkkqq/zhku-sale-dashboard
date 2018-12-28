<template>
  <div class="refund-detail">
    <el-card shadow="never" class="border-0">
      <div slot="header">
        <!-- <h2 class="bar-left">
          {{type == REFUND ? '退款详情' : '退货退款详情'}}
        </h2>-->
        <go-back class="ml-2"></go-back>
        <h2>
          售后申请状态：
          <span class="red">{{this.trade.status ? statusOpts[this.trade.status] : ''}}</span>
        </h2>
      </div>
      <h3 class="mb-1">{{type == REFUND ? '退款流转过程' : '退货流转过程'}}</h3>
      <el-steps :active="activeStep" align-center v-if="type != REFUND">
        <el-step title="提交订单" description></el-step>
        <el-step title="商家审核通过" description></el-step>
        <el-step title="买家寄回货物" description></el-step>
        <el-step title="签收货物" description></el-step>
        <el-step title="验收货物" description></el-step>
        <el-step title="已完成" description></el-step>
      </el-steps>
      <el-steps :active="activeStep" align-center v-if="type == REFUND">
        <el-step title="提交申请" description></el-step>
        <el-step title="商家审核通过" description></el-step>
        <el-step title="退款已受理" description></el-step>
      </el-steps>
      <card-table>
        <table-info :table="orderInfoTableForReturn" v-if="type != REFUND" @send="show"></table-info>
        <table-info :table="orderInfoTableForRefund" v-if="type == REFUND" @send="show"></table-info>
      </card-table>
      <div class="showRefundDes" v-if="isShowRefundDes">
        <div style="margin: 20px 30px;">内容说明<p style="margin: 10px 0 0 20px;">{{detail.description}}</p></div>
        <i class="el-icon-close" style="position: absolute;top: 10px;right: 10px;cursor:pointer;" @click="isShowRefundDes=false"></i>
        <div v-if="detail.refundProofUrlList">
          <p style="margin: 20px 30px;">图片</p>
          <ul class="refundImgs">
            <li v-for="(url) in detail.refundProofUrlList">
              <viewer :height="'100%'" :width="'100%'" :src=url
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="refund-table-info">
        <card-table header="退款人信息" v-if="type == REFUND">
          <table class="table-info-one-column">
            <tbody>
              <tr v-for="(tr,index) in customerInfoTable" :key="index">
                <template>
                  <td class="label">{{tr.label}}</td>
                  <td class="value">{{tr.value}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </card-table>
        <card-table header="退货人信息" v-if="type != REFUND">
          <table class="table-info-one-column">
            <tbody>
              <tr v-for="(tr,index) in customerInfoTable" :key="index">
                <template>
                  <td class="label">{{tr.label}}</td>
                  <td class="value">{{tr.value}}</td>
                </template>
              </tr>
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
      <card-table header="退款商品" v-if="type == REFUND">
        <el-table :data="products || []" border="">
          <el-table-column
            v-for="(item,index) in returnGoodsColumns"
            :prop="item.prop"
            :label="item.label"
            :key="item.prop"
            :formatter="item.formatter"
            :width="item.width"
          ></el-table-column>
        </el-table>
      </card-table>
      <card-table header="退货商品" v-if="type != REFUND">
        <el-table :data="products || []" border="">
          <el-table-column
            v-for="(item,index) in returnGoodsColumns"
            :prop="item.prop"
            :label="item.label"
            :key="item.prop"
            :formatter="item.formatter"
            :width="item.width"
          ></el-table-column>
        </el-table>
      </card-table>
      <card-table header="验货结果" v-if="type != REFUND">
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
import {productType} from '@/const/config'
import {
  statusOpts,
  REFUND,
  RETURN,
  under_review,
  failed_review,
  refunding,
  confirm_refund,
  cancel_refund,
  daifahuo,
  daishouhuo,
  returning,
  confirm_return,
  cancel_return
} from '@/const/aft'
import GoBack from '@/components/GoBack'
import Viewer from 'viewer'

export default {
  name: 'refund-detail',
  components: {
    CardTable,
    TableInfo,
    GoBack,
    Viewer
  },
  data() {
    return {
      query: this.$route.query,
      REFUND: REFUND,
      RETURN: RETURN,
      url: '',
      activeStep: 1,
      extraParams: {},
      detail: {},
      statusOpts,
      // paymentTable: [
      //   {prop: 'tradeOrderId', label: '支付流水号'},
      //   {
      //     prop: 'payMoney',
      //     label: '支付金额',
      //     formatter: row => price(row.payMoney)
      //   },
      //   {prop: 'payChannel', label: '支付通道'},
      //   {
      //     prop: 'payStatus',
      //     label: '支付状态'
      //   },
      //   {
      //     prop: 'paidAt',
      //     label: '支付时间',
      //     formatter: row => formatDate(row.paidAt),
      //     width: '180'
      //   }
      // ],
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
        // {prop: 'name', label: '序号'},
        {
          prop: 'imgUrl',
          label: '商品',
          formatter: row => this.imgFormatter(row),
          width: '300px'
        },
        {prop: 'skuId', label: '商品编码'},
        {prop: 'quantity', label: '数量'},
        {prop: 'itemMoney', label: '单价'},
        {
          prop: 'sum',
          label: '小计',
          formatter: row => price(row.quantity * row.itemMoney)
        },
        {prop: 'payMoney', label: '实际退款'}
      ],
      isShowRefundDes: false
    }
  },
  computed: {
    trade() {
      return this.detail || {}
    },
    type() {
      if (this.trade.refundTypeCode && this.trade.refundTypeCode == 1) {
        return REFUND
      }
      return RETURN
    },
    orderInfoTableForRefund() {
      //单据信息
      const {
        id,
        description,
        tradeOrderId,
        memberName,
        itemMoney = '',
        discountMoney = '',
        currency = '',
        freightMoney = '',
        payMoney = '',
        refundMoney = ''
      } = this.trade
      const data = {
        订单编号: tradeOrderId,
        退货原因: description,
        退货单号: id,
        退货说明: description,
        退款单号: id,
        会员账号: memberName,
        总商品金额: price(itemMoney),
        优惠金额: price(discountMoney),
        国源通币: currency,
        运费: price(freightMoney),
        实付金额: price(payMoney),
        实退款总金额: price(refundMoney)
      }
      return Object2Options(data, 'value')
    },
    orderInfoTableForReturn() {
      //单据信息
      const {
        id,
        description,
        tradeOrderId,
        memberName,
        itemMoney = '',
        discountMoney = '',
        currency = '',
        freightMoney = '',
        payMoney = '',
        refundMoney = ''
      } = this.trade
      const data = {
        退货单号: id,
        退货原因: description,
        订单编号: tradeOrderId,
        退货说明: description,
        退款单号: id,
        会员账号: memberName,
        总商品金额: price(itemMoney),
        优惠金额: price(discountMoney),
        国源通币: currency,
        运费: price(freightMoney),
        实付金额: price(payMoney),
        实退款总金额: price(refundMoney)
      }
      return Object2Options(data, 'value')
    },
    customerInfoTable() {
      const {memberName, mobile} = this.trade
      const data = {
        会员账号: memberName,
        联系电话: mobile
      }
      return Object2Options(data, 'value')
    },
    deliveryInfoTable() {
      const {
        logisticsType,
        logisticsCompany,
        freightMoney,
        logisticsCode
      } = this.trade
      const data = {
        物流方式: logisticsType,
        快递公司: logisticsCompany,
        运费: price(freightMoney),
        物流单号: logisticsCode
      }
      return Object2Options(data, 'value')
    },
    refundInfoTable() {
      const {
        refundType,
        refundChannel,
        refundDate,
        itemMoney,
        freightMoney,
        refundMoney
      } = this.trade
      const data = {
        退款方式: refundType,
        退款渠道: refundChannel,
        退款时间: formatDate(refundDate),
        商品总额: price(itemMoney),
        应支付金额: price(refundMoney),
        运费金额: price(freightMoney)
      }
      return Object2Options(data, 'value')
    },
    products() {
      if (this.detail.skuList && this.detail.skuList.length)
        return this.detail.skuList
      return []
    },
    productImgUrl() {
      if (
        this.detail.skuList &&
        this.detail.skuList.length &&
        this.detail.skuList[0].imgUrl
      )
        return this.detail.skuList[0].imgUrl.split(',')[0]
      return ''
    },
    aft() {
      return this.detail.returns || []
    },
    aftAudit() {
      // 当订单未审核的时候 退款审核不显示内容
      const {result, remark, imgUrl, invoiceReturn} = this.aft
      const data = {
        结果: result,
        备注: remark,
        图片: imgUrl,
        发票是否退回: invoiceReturn
      }
      return Object2Options(data, 'value')
    }
  },
  methods: {
    show(h) {
      this.isShowRefundDes = h
    },
    getDetail() {
      this.$axios
        .$get(refundDetail + `?id=${this.query.refundId}`)
        .then(resp => {
          this.detail = resp.payload
          this.getStep()
        })
        .catch(err => {
          this.$message.error('获取退款详情失败! 请稍后再试!')
        })
    },
    getStep() {
      if (this.detail.refundTypeCode == 1) {
        // 退款
        switch (this.trade.status) {
          case refunding: //'退款中':
            this.activeStep = 2
            break
          case confirm_refund: //'已完成':
            this.activeStep = 3
            break
          default:
            this.activeStep = 1
            break
        }
      } else if (this.detail.refundTypeCode == 2) {
        // 退货
        switch (this.trade.status) {
          case refunding: // '退款中':
            this.activeStep = 2
            break
          case daifahuo: //'待发货':
            this.activeStep = 3
            break
          case daishouhuo: //'待收货':
            this.activeStep = 4
            break
          case returning: // '确认退货':
            this.activeStep = 5
            break
          case confirm_return: //'已完成':
            this.activeStep = 6
            break
          default:
            this.activeStep = 1
            break
        }
      }
    },
    imgFormatter(row) {
      if (row.imgUrl) {
        let imgUrl = row.imgUrl.split(',')[0]
        return (
          <div style="display:flex;align-items:center">
            <img
              src={imgUrl ? imgUrl : ''}
              style={{
                width: '100px',
                background: 'transparent',
                padding: '0'
              }}
            />
            <div style="margin-left:10px">{row.itemName}</div>
          </div>
        )
      }
      return ''
    },

    formatDate,
    price,
    toOptionsLabel
  },
  mounted() {
    this.getDetail()
    this.getStep()
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
.showRefundDes {
  width: 500px;
  border: 1px solid #ccc;
  background-color: #fff;
  position: fixed;
  z-index: 3000
  top: 10%;
  left: 30%;
  padding-bottom: 20px;
}
.showRefundDes .refundImgs li{
  display: inline-block;
  list-style: none;
  width: 120px;
  height: 120px;
  margin: 12px;
}
</style>
