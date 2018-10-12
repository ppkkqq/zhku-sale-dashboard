<!--
 /*
 * @Author: wukunpeng 
 * @Date: 2018-08-25 15:53:14 
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-08-30 15:12:08
 * 新车订单详情页面
 */
 -->
<template>
  <div class="order-detail-car">
    <el-card shadow="never"
             class="border-0">
      <div slot="header">
        <h2>订单详情</h2>
      </div>
      <card-table header="订单信息">
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
          <el-table-column prop="tradeOrderId"
                           label="支付流水号">
          </el-table-column>
          <el-table-column prop="payMoney"
                           width='80'
                           label="支付金额">
          </el-table-column>
          <el-table-column prop="payChannel"
                           width='80'
                           label="支付通道">
          </el-table-column>
          <el-table-column prop="payStatus"
                           width='80'
                           label="支付状态">
          </el-table-column>
          <el-table-column prop="paidAt"
                           width='180'
                           :formatter="row=>formatDate(row.paidAt)"
                           label="支付时间">
          </el-table-column>

        </el-table>
      </card-table>

      <div class="tab-container">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="贷款信息"
                       name="1">
            <table-info :table="installmentInfoTable"></table-info>
          </el-tab-pane>
          <el-tab-pane label="保险信息"
                       name="2">
            <table-info :table="insuranceInfoTable"></table-info>
          </el-tab-pane>
          <el-tab-pane label="精品信息"
                       name="3">
            <el-table :data="boutiqueInfoTable"
                      border
                      style="width: 100%">
              <el-table-column prop="itemName"
                               label="商品名称"
                               width="180">
              </el-table-column>
              <el-table-column prop="quantity"
                               label="数量"
                               width="180">
              </el-table-column>
              <el-table-column prop="itemMoney"
                               label="价格">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="服务信息"
                       name="4">
            <table-info :table="serviceInfoTable"></table-info>
          </el-tab-pane>
          <el-tab-pane label="订单资料"
                       name="5">
            <div v-if="detail.images">
              <img  style="width:200px;margin-right:10px" :src="item.url" :alt="item.type" v-for="item in (detail.images)" :key="item.id">
            </div>
            <div class="text-center"
                 v-else>
              <p style="color:#909399;padding:20px">暂无数据</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import {orderDetail} from '@/const/api'
import {formatDate, Object2Options, toOptionsLabel, price} from '@/const/filter'
import {orderStatusOptions, orderTypeOptions, productType} from '@/const/config'
import zipObject from 'lodash/zipObject'
import zipWith from 'lodash/zipWith'
import split from 'lodash/split'
export default {
  name: 'order-detail-car',
  components: {
    CardTable,
    TableInfo
  },
  data() {
    return {
      activeTab: '1',
      detail: {} //订单详情
    }
  },
  methods: {
    formatterOrderStatus(status) {
      return toOptionsLabel(status, orderStatusOptions)
    },
    formatDate
  },
  computed: {
    orderId() {
      return this.$route.query.id
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
    installment() {
      //分期
      const data = this.products.filter(
        item => item.productType === productType['分期']
      )
      return data[0] || {}
    },
    insurance() {
      //保险
      const data = this.products.filter(
        item => item.productType === productType['保险']
      )
      return data[0] || {}
    },
    boutique() {
      //精品
      const data = this.products.filter(
        item => item.productType === productType['精品']
      )
      return data[0] || {}
    },
    service() {
      //服务
      const data = this.products.filter(
        item => item.productType === productType['服务']
      )
      return data[0] || {}
    },
    trade() {
      //物流，是个对象
      return this.detail.outDtoTradeOrder || {}
    },
    payment() {
      //支付信息，是个数组
      return this.detail.outDtoOrderPayments || []
    },
    orderInfoTable() {
      //订单信息
      //Todo:定金,客户类型,订单状态
      const {
        id,
        createdAt,
        memberName,
        memberType,
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
        手机号: memberPhone,
        客户姓名: memberName,
        // 客户类型: memberType, //30号演示版本去掉
        门店: shopName,
        订单金额: price(payMoney),
        定金: price(maxDeposit),
        订单状态: toOptionsLabel(status, orderStatusOptions),
        客户备注: remark
      }
      return Object2Options(data, 'value')
    },
    carInfoTable() {
      //车辆状态 0=不可交付, 1=可交付, 2=已交付(订单完成)
      const config = {
        0: '不可交付',
        1: '可交付',
        2: '已交付'
      }
      const data = {
        车系: this.car.bundleCarSeriesName,
        品牌: this.car.bundleCarBrandName,
        车型编号: this.car.vehicleModelCode,
        车型名称: this.car.bundleCarModelName,
        指导价: price(this.car.guidancePrice),
        门店单价: price(this.car.hopPrice),
        规格组合: this.car.propValues,
        车架号: this.car.vehicleVinCode,
        物流状态: config[this.car.vehicleDeliver]
      }
      return Object2Options(data, 'value')
    },
    installmentInfoTable() {
      //贷款信息
      const installmentInfo = this.installment.lines
        ? this.installment.lines[0]
        : {}
      const {
        itemName,
        propNames,
        propValues,
        loadAmount,
        servicePrice,
        responsiblePeopleName
      } = installmentInfo

      const props = zipObject(split(propNames, ','), split(propValues, ','))

      const data = {
        商品名称: itemName,
        首付比例: props['首付比例'],
        期数: props['期数'],
        首付金额: price(props['首付']),
        贷款额: price(loadAmount),
        月供: price(props['月供']),
        手续费: price(servicePrice),
        金融经理: responsiblePeopleName
      }
      return Object2Options(data, 'value')
    },
    insuranceInfoTable() {
      //保险信息
      const insuranceInfo = this.insurance.lines ? this.insurance.lines[0] : {}
      const {
        itemName,
        propNames,
        propValues,
        itemMoney = '',
        responsiblePeopleName
      } = insuranceInfo

      const props = zipWith(
        split(propNames, ','),
        split(propValues, ','),
        function(a, b) {
          return `${a}:${b}`
        }
      )

      const data = {
        商品名称: itemName,
        套餐内容: props.join(';'),
        商品金额: price(itemMoney),
        承保顾问: responsiblePeopleName
      }
      return Object2Options(data, 'value')
    },
    boutiqueInfoTable() {
      //精品信息
      return this.boutique.lines || []
    },
    serviceInfoTable() {
      //服务信息
      const data = {
        商品名称: this.service.bundleName,
        套餐内容: this.service.bundleContent,
        商品金额: price(this.service.bundlePrice),
        验车专员: this.service.responsiblePeopleName
      }
      return Object2Options(data, 'value')
    }
  },
  mounted() {
    this.$axios.$get(`${orderDetail}?id=${this.orderId}`).then(result => {
      this.detail = result.payload
    })
  }
}
</script>

<style lang="stylus">
.order-detail-car {
  .car-info {
    display: flex;
    width: 100%;

    .img {
      margin-right: 30px;
    }

    .table {
      flex: 1;
    }

    img {
      max-width: 120px;
    }
  }

  .tab-container {
    margin-top: 30px;
    min-height: 300px;
  }
}
</style>
