<template>
  <div class="order-detail" v-loading="loading">
    <el-card shadow="never"
             class="border-0">
      <div slot="header">
        <go-back></go-back>
      </div>
      <card-table header="订单基本信息">
        <table-info :table="orderInfoTable"></table-info>
      </card-table>

      <card-table header="收货信息">
        <table-info :table="deliveryInfoTable"></table-info>
      </card-table>

      <card-table header="订单商品信息">
        <el-table :data="skuList"
                  border
                  style="width: 100%">
          <el-table-column prop="skuId"
                           min-width='120'
                           :show-overflow-tooltip="true"
                           label="商品编码">
          </el-table-column>
          <el-table-column prop="skuName"
                           min-width='120'
                           :show-overflow-tooltip="true"
                           label="商品名称">
          </el-table-column>
          <el-table-column prop="sellPrice"
                           min-width='120'
                           label="商品单价（元）">
          </el-table-column>
          <el-table-column prop="quantity"
                           min-width='80'
                           label="购买数量">
          </el-table-column>
          <el-table-column prop="itemMoney"
                           min-width='100'
                           label="合计金额">
          </el-table-column>
          <el-table-column prop="freight"
                           min-width='100'
                           label="运费">
          </el-table-column>
          <el-table-column prop="discountMoney"
                           min-width='100'
                           label="优惠金额">
          </el-table-column>
          <el-table-column prop="integrationMoney"
                           min-width='160'
                           label="积分金额（分/金额）">
          </el-table-column>
          <el-table-column prop="couponMoney"
                           min-width='160'
                           label="优惠券（名称/金额）">
          </el-table-column>
        </el-table>
      </card-table>

      <!-- <card-table header="订单发票信息">
      </card-table> -->

      <card-table header="订单支付信息"
                  v-if="payList.length>0">
        <el-row  class="row-bg">
          <el-col :span="12" style="margin-bottom: 20px">订单编号: {{detail.orderCode}}</el-col>
          <el-col :span="12" style="margin-bottom: 20px">国源通币支付: {{detail.currencyPay}}</el-col>
          <el-col :span="12" style="margin-bottom: 20px">现金支付: {{detail.crashPay}}</el-col>
        </el-row>
        <el-table :data="payList"
                  border
                  style="width: 100%;">
          <el-table-column prop="payType"
                           label="支付方式">
          </el-table-column>
          <el-table-column prop="payStreamId"
                           width='80'
                           label="支付流水">
          </el-table-column>
          <el-table-column prop="payChannel"
                           width='80'
                           label="支付通道">
          </el-table-column>
          <el-table-column prop="payMoney"
                           width='80'
                           label="支付金额">
          </el-table-column>
          <el-table-column prop="payDateStr"
                           width='180'
                           label="支付时间">
          </el-table-column>
        </el-table>
      </card-table>
    </el-card>
  </div>
</template>

<script>
import GoBack from '@/components/GoBack'
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import {orderDetail} from '@/const/api'
import {formatDate, Object2Options, toOptionsLabel, price} from '@/const/filter'

const itemSource = {
  '0': '我买网',
  '1': '自营'
}
export default {
  name: 'order-detail-car',
  components: {
    CardTable,
    TableInfo,
    'go-back': GoBack
  },
  data() {
    return {
      loading: false,
      detail: {} //订单详情
    }
  },
  methods: {
    // formatterOrderStatus(status) {
    //   return toOptionsLabel(status, orderStatusOptions)
    // },
    getDetail() {
      this.loading = true
      this.$axios
        .$get(`${orderDetail}?orderId=${this.orderId}`)
        .then(result => {
          this.detail = result.payload
          // this.detail.payList = [
          //   {
          //     payType: '', //支付方式
          //     payStreamId: '', //支付流水id
          //     payChannel: '', //支付通道
          //     payMoney: '', //支付金额
          //     payDateStr: '' //支付时间
          //   }
          // ]
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    orderId() {
      return this.$route.query.id
    },
    skuList() {
      //商品，多个，是个数组
      return this.detail.skuList || []
    },
    payList() {
      //支付信息，是个数组
      return this.detail.payList || []
    },
    orderInfoTable() {
      //订单信息
      const {
        orderCode,
        itemMoney,
        source, // 0 我买网 1自营
        orderDateStr,
        status,
        payDateStr,
        user,
        remark
      } = this.detail
      const data = {
        订单编号: orderCode,
        订单总金额: price(itemMoney),
        商品来源: itemSource[source],
        下单时间: orderDateStr,
        支付状态: status,
        支付时间: payDateStr,
        下单账号: user,
        下单备注: remark
      }
      return Object2Options(data, 'value')
    },
    deliveryInfoTable() {
      const {
        receiverName,
        receiverEmail,
        receiverMobile,
        province,
        city,
        area,
        address
      } = this.detail

      const data = {
        收货人: receiverName,
        收货人邮箱: receiverEmail,
        收货人电话: receiverMobile,
        '省/直辖市': province,
        '市/直辖市': city,
        '区/县': area,
        详细地址: address
      }
      return Object2Options(data, 'value')
    }
  },
  mounted() {
    this.getDetail()
  }
}
</script>

<style lang="stylus">
.order-detail {
  position: relative;
}
</style>
