<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      totalPath="payload.total"
      dataPath="payload.orderList"
      :customQuery="customQuery"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :searchForm="searchForm"
      @reset="handleReset"
      :operationAttrs="operationAttrs"
    >
      <template slot="search">
        <!--//下单时间-->
        <el-form-item label="下单时间">
          <el-date-picker
            @change="setTime('order')"
            value-format="yyyy-MM-dd"
            v-model="orderTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!--//支付时间-->
        <el-form-item label="支付时间">
          <el-date-picker
            @change="setTime('pay')"
            value-format="yyyy-MM-dd"
            v-model="payTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

      </template>
    </el-data-table>
    <!--<el-dialog-->
    <!--class="order-dialog"-->
    <!--title="查看"-->
    <!--:visible.sync="visible"-->
    <!--append-to-body>-->
    <!--<el-form class="title-left" ref="form"  label-width="120px">-->
    <!--<el-form-item label="快递单号: ">-->
    <!--{{trackNum}}-->
    <!--</el-form-item>-->
    <!--<el-form-item label="快递公司: ">-->
    <!--{{''}}-->
    <!--</el-form-item>-->
    <!--<el-form-item label="快递联系电话: ">-->
    <!--{{''}}-->
    <!--</el-form-item>-->
    <!--<el-form-item label="收货地址: ">-->
    <!--&lt;!&ndash;{{'广东省广州市天河区 510510 秦* 176****8176'}}&ndash;&gt;-->
    <!--{{ deliveryAddress }}-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div v-for="(step,index) in steps"-->
    <!--:key="index" class="steps is-flex"-->
    <!--&gt;-->
    <!--<div class="steps-head"></div>-->
    <!--<div class="steps-body">-->
    <!--<div class="steps-date">{{step.date}} </div>-->
    <!--<div class="steps-day">{{step.day}}</div>-->
    <!--<div class="steps-time">{{step.time}}</div>-->
    <!--<div class="steps-description">{{step.remark}}</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!---->
    <el-dialog
      title="查看订单物流"
      :visible.sync="outerVisible"
    >
      <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号: ">
          {{orderCode}}
        </el-form-item>
      </el-form>
      <div>
        <div class="table-title">快递单号列表</div>
        <el-table
          :data="steps"
          style="width: 100%">
          <el-table-column
            prop="company"
            label="快递公司"
            width="180">
          </el-table-column>
          <el-table-column
            prop="trackNum"
            label="快递单号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="快递联系电话">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handle(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        title="查看"
        :visible.sync="innerVisible"
        @open="outerVisible=false"
        @close="outerVisible = true"
        append-to-body>
        <el-form class="title-left" ref="form"  label-width="120px">
          <el-form-item label="快递单号: ">
            {{trackNum}}
          </el-form-item>
          <el-form-item label="快递公司: ">
            {{''}}
          </el-form-item>
          <el-form-item label="快递联系电话: ">
            {{''}}
          </el-form-item>
          <el-form-item label="收货地址: ">
            <!--{{'广东省广州市天河区 510510 秦* 176****8176'}}-->
            {{ deliveryAddress }}
          </el-form-item>
        </el-form>
        <div v-for="(step,index) in steps"
             :key="index" class="steps is-flex"
        >
          <div class="steps-head"></div>
          <div class="steps-body">
            <div class="steps-date">{{step.date}} </div>
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
import {orderStatusOptions, orderTypeOptions, productType} from '@/const/config'
import {formatDate, price, toOptionsLabel, options2Object} from '@/const/filter'
import {orderList, logistics} from '@/const/api'
import searchFormMixin from '@/mixins/search-form-slot'
const num2source = ['我买网订单', '自营订单']
const num2day = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  name: 'order-list',
  components: {},
  mixins: [searchFormMixin],
  data() {
    return {
      pageName: 'order-list',
      url: orderList + '?shopId=67783a1d-1743-495f-a6e9-7a31a450ce47',
      columns: [
        {
          prop: 'orderCode',
          minWidth: '100',
          label: '订单编号'
        },
        {
          prop: 'itemMoney',
          label: '订单金额'
        },
        {
          prop: 'source',
          label: '商品来源',
          formatter: row => num2source[row.source]
        },
        {
          prop: 'orderStatusName',
          label: '订单状态'
        },
        {
          prop: 'user',
          label: '下单账号'
        },
        {
          prop: 'orderDate',
          label: '下单时间',
          formatter: row => formatDate(row.orderDate, 'YYYY-MM-DD HH:mm')
        }
      ],
      extraButtons: [
        {
          text: '查看物流',
          type: 'primary',
          show: this.showLogisticsButton,
          atClick: this.go2Logistics,
          fixed: 'left'
        },
        {
          text: '详情',
          type: 'primary',
          atClick: this.go2Detail,
          fixed: 'right'
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入订单编号'},
          label: '订单编号',
          $id: 'orderCode',
          $type: 'input'
        },
        {
          $options: [
            {
              value: '0',
              label: '我买网订单'
            },
            {
              value: '1',
              label: '自营订单'
            }
          ],
          $el: {placeholder: '请输入商品来源'},
          label: '商品来源',
          $id: 'source',
          $type: 'select'
        },
        {
          // 1待支付，2待发货，3待收货，4待评论，5已取消，6已评论
          $options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: 'to_be_paid',
              label: '待支付'
            },
            {
              value: 'paid',
              label: '待发货'
            },
            {
              value: 'deliverying',
              label: '待收货'
            },
            {
              value: 'finished',
              label: '待评论'
            },
            {
              value: 'commented',
              label: '已评论'
            },
            {
              value: 'cancelled',
              label: '已取消'
            }
          ],
          $el: {placeholder: '请选择订单状态'},
          label: '订单状态',
          $id: 'orderStatus',
          $type: 'select'
        }
      ],
      payTime: '',
      orderTime: '',
      customQuery: {
        orderStartDate: '',
        orderEndDate: '',
        payStartDate: '',
        payEndDate: ''
      },
      visible: false,
      outerVisible: false,
      innerVisible: false,
      operationAttrs: {
        width: 200
      },
      deliveryAddress: '',
      trackNum: '',
      steps: [],
      orderCode: ''
    }
  },
  methods: {
    handleReset() {
      this.orderTime = ''
      this.payTime = ''
      this.customQuery = {
        orderStartDate: '',
        orderEndDate: '',
        payStartDate: '',
        payEndDate: ''
      }
    },
    setTime(way) {
      if (this[way + 'Time']) {
        this.customQuery[way + 'EndDate'] = this[way + 'Time'][1]
        this.customQuery[way + 'StartDate'] = this[way + 'Time'][0]
      } else {
        this.customQuery[way + 'EndDate'] = ''
        this.customQuery[way + 'StartDate'] = ''
      }
    },
    showLogisticsButton(row) {
      return (
        row.orderStatusName === '待收货' ||
        row.orderStatusName === '待评论' ||
        row.orderStatusName === '已评论'
      )
    },
    go2Logistics(row) {
      this.$axios
        .$get(`${logistics}?orderCode=${row.orderCode}&orderId=${row.orderId}`)
        .then(res => {
          let logisticsContent = res.payload
          let firstItem = logisticsContent.list && logisticsContent.list[0]
          this.trackNum = firstItem && firstItem.trackNum
          let deliveryAddress = logisticsContent.deliveryAddress
          let list = logisticsContent.list
          this.deliveryAddress =
            deliveryAddress.provinceName +
            deliveryAddress.cityName +
            deliveryAddress.districtName +
            deliveryAddress.streetName +
            deliveryAddress.detailAddress +
            deliveryAddress.postcode +
            deliveryAddress.receiverName +
            deliveryAddress.receiverPhone
          list.forEach(item => {
            item.date = formatDate(item.createTime, 'YYYY-MM-DD')
            item.day = num2day[new Date(item.createTime).getUTCDay()]
            item.time = formatDate(item.createTime, 'HH:mm:ss')
          })
          this.steps = list
        })
        .catch()
      this.orderCode = row.orderCode
      this.visible = true
      this.outerVisible = true
    },
    go2Detail(row) {
      this.$router.push(`/order/order-detail?id=${row.orderId}`)
    }
  },
  computed: {}
}
</script>

<style lang="stylus">
  .order-dialog{
    .title-left{
      .el-form-item__label{
        text-align: left;
      }

    }
    .steps-body{
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;

      .steps-date{
        margin-right 10px
      }
      .steps-day{
        margin-right 10px
      }
      .steps-time{
        margin-right 10px
      }
    }
  }



</style>
