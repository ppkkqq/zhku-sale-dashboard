<!--
 /*
 * @Author: wukunpeng 
 * @Date: 2018-08-25 15:53:39 
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-08-29 17:29:43
 * 保养订单详情页面
 */
 -->
<template>
  <div class="order-detail-maintain">
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
      <card-table header="发票信息"
                  v-if="invoices.length>0">
        <table-info :table="invoicesInfoTable"></table-info>
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
          <el-tab-pane label="预约"
                       name="1">
            <table-info :table="subscribesInfoTable"></table-info>
          </el-tab-pane>
          <el-tab-pane label="环车检车单"
                       name="2">
            <table-info :table="inspectionOrdersInfoTable.slice(0,8)">
              <tr v-for="item in inspectionOrdersInfoTable.slice(8,11)"
                  :key="item.label">
                <td class="label">{{item.label}}</td>
                <td class="value"
                    colspan="3">
                  <img :src="item"
                       alt=""
                       v-for="item in item.value.split(',')"
                       :key="item">
                </td>
              </tr>
              <tr v-if="inspectionOrdersInfoTable[11]">
                <td class="label">{{inspectionOrdersInfoTable[11].label}}</td>
                <td class="value"
                    colspan="3">{{inspectionOrdersInfoTable[11].value}}</td>
              </tr>

            </table-info>
          </el-tab-pane>
          <!--  后端接口暂时没有数据
            <el-tab-pane label="增项单"
                       name="3">增项单</el-tab-pane>
          <el-tab-pane label="质检单"
                       name="4">质检单</el-tab-pane>
          <el-tab-pane label="服务确认单"
                       name="5">服务确认单</el-tab-pane>
                        -->
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
  name: 'order-detail-maintain',
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
    trade() {
      //物流，是个对象
      return this.detail.outDtoTradeOrder || {}
    },
    payment() {
      //支付信息，是个数组
      return this.detail.outDtoOrderPayments || []
    },
    invoices() {
      //发票信息，是个数组
      return this.detail.invoices || []
    },
    subscribes() {
      //预约信息，是个数组
      return this.detail.subscribes || []
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
    invoicesInfoTable() {
      //发票
      const data = this.invoices[0] || {}
      const result = {
        发票类型: data.type,
        发票抬头: data.title,
        发票税号: data.code
      }
      return Object2Options(result, 'value')
    },
    subscribesInfoTable() {
      //预约
      const data = this.subscribes[0] || {}
      const result = {
        预约时间: formatDate(data.date),
        上门取车时间: formatDate(data.pickCarTime),
        取车地址: data.pickCarAddress
      }
      return Object2Options(result, 'value')
    },
    inspectionOrdersInfoTable() {
      //环车检车单
      const inspectionOrders = this.detail.inspectionOrders || []
      const data = inspectionOrders[0] || {}
      const result = {
        车型: data.carModel,
        车牌号: data.carNumber,
        里程数: data.carMileage,
        首次登记日期: formatDate(data.firstRegistTime),
        接车时间: formatDate(data.pickCarTime),
        预计完工时间: formatDate(data.expectedCompleteTime),
        是否洗车: data.isWashCar,
        是否回收旧件: data.isRecover,
        外观拍照: data.outPhoto || '',
        内饰拍照: data.internalPhoto || '',
        仪表盘拍照: data.dashBoardPhoto || '',
        其他需求: data.otherRequerment
      }

      return Object2Options(result, 'value')
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
.order-detail-maintain {
  .car-info {
    display: flex;
    width: 100%;

    .table {
      flex: 1;
    }
  }

  img {
    max-width: 120px;
    margin-right: 30px;
  }

  .tab-container {
    margin-top: 30px;
    min-height: 300px;
  }
}
</style>
