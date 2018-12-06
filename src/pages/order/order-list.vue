<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      totalPath="payload.total"
      dataPath="payload.orderList"
      :customQuery="customQuery"
      :headerButtons="headerButtons"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :searchForm="searchForm"
      @reset="handleReset"
      @update="saveImportData"
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
    <el-dialog
      title="查看订单物流"
      :visible.sync="outerVisible"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号: ">
          {{orderCode}}
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="trackList"
          style="width: 100%">
          <el-table-column
            prop="logisticsCompanyName"
            label="快递公司"
            width="180">
          </el-table-column>
          <el-table-column
            prop="trackNum"
            label="快递单号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="快递联系电话"
            min-width="140"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">查看
              </el-button>
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
        append-to-body>
        <el-form class="title-left" v-model="trackDetail" ref="form" label-width="120px">
          <el-form-item label="快递单号: ">
            {{trackDetail.trackNum}}
          </el-form-item>
          <el-form-item label="快递公司: ">
            {{trackDetail.logisticsCompanyName}}
          </el-form-item>
          <el-form-item label="快递联系电话: ">
            {{trackDetail.phone}}
          </el-form-item>
          <el-form-item label="收货地址: ">
            {{ trackDetail.deliveryAddress}}
          </el-form-item>
        </el-form>
        <template v-if="trackDetail.infos.length>0">
          <div  v-for="(step,index) in trackDetail.infos"
                :key="index" class="steps is-flex"
          >
            <div class="steps-head"></div>
            <div class="steps-body">
              <div class="steps-date">{{step.date}}</div>
              <div class="steps-day">{{step.day}}</div>
              <div class="steps-time">{{step.time}}</div>
              <div class="steps-description">{{step.remark}}</div>
            </div>
          </div>
        </template>
        <div v-else style="font-weight: bold;margin-top: 20px;margin-left: 30px;"> ：( 该单号暂无物流进展，请稍后再试，或检查公司和单号是否有误。</div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {orderStatusOptions, orderTypeOptions, productType} from '@/const/config'
import {orderList, logistics, exportExcel} from '@/const/api'
import qs from 'qs'
import {
  formatDate,
  price,
  toOptionsLabel,
  options2Object,
  source2Options
} from '@/const/filter'

import searchFormMixin from '@/mixins/search-form-slot'

const num2source = ['我买网订单', '自营订单']
const num2day = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const status2chinese = {
  to_be_paid: '待支付',
  paid: '已付款',
  paidAndAudit: '待发货',
  deliverying: '待收货',
  finished: '待评价',
  commented: '已评价',
  cancelled: '已取消'
}
export default {
  name: 'order-list',
  components: {},
  mixins: [searchFormMixin],
  data() {
    return {
      pageName: 'order-list',
      url: orderList,
      exportQuery: {},
      columns: [
        {
          prop: 'orderCode',
          minWidth: '120',
          label: '订单编号',
          'show-overflow-tooltip': true
        },
        {
          prop: 'memberName',
          minWidth: '120',
          label: '会员昵称',
          'show-overflow-tooltip': true
        },
        {
          prop: 'user',
          minWidth: '140',
          label: '会员手机号'
        },
        {
          prop: 'itemMoney',
          label: '订单金额',
          formatter: row => price(row.itemMoney)
        },
        {
          prop: 'payChannel',
          label: '支付渠道',
          minWidth: '120'
          // formatter: row => num2source[row.source]
        },
        {
          prop: 'source',
          label: '商品渠道',
          minWidth: '120'
          // formatter: row => num2source[row.source]
        },
        {
          prop: 'orderStatusName',
          label: '订单状态'
          // formatter: row => status2chinese[row.orderStatusId]
        },
        {
          prop: 'orderDate',
          label: '下单时间',
          minWidth: '150',
          formatter: row => formatDate(row.orderDate, 'YYYY-MM-DD HH:mm:ss')
        }
      ],
      extraButtons: [
        {
          text: '查看物流',
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
          $options: [],
          $el: {placeholder: '请输入商品渠道'},
          label: '商品渠道',
          $id: 'source',
          $type: 'select'
        },
        {
          // 1待支付，2待发货，3待收货，4待评价，5已取消，6已评价
          $options: [
            {
              value: '',
              label: '全部'
            },
            {value: 'to_be_paid', label: '待支付'},
            {value: 'paid', label: '已付款'},
            {value: 'paidAndAudit', label: '待发货'},
            {value: 'deliverying', label: '待收货'},
            {value: 'finished', label: '已完成'},
            {value: 'commented', label: '已评价'},
            {value: 'cancelled', label: '已取消'}
          ],
          $el: {placeholder: '请选择订单状态'},
          label: '订单状态',
          $id: 'orderStatus',
          $type: 'select'
        },
        {
          $el: {placeholder: '请输入会员手机号'},
          label: '会员手机号',
          $id: 'memberPhone',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入会员昵称'},
          label: '会员昵称',
          $id: 'memberName',
          $type: 'input'
        },
        {
          $options: [
            {
              value: '源通币支付',
              label: '源通币支付'
            },
            {
              value: '支付宝支付',
              label: '支付宝支付'
            },
            {
              value: '微信支付',
              label: '微信支付'
            }
          ],
          $el: {placeholder: '请选择支付渠道'},
          label: '支付渠道',
          $id: 'payChannel',
          $type: 'select'
        }
      ],
      headerButtons: [
        {
          text: '导出订单信息',
          type: 'primary',
          atClick: () => {
            window.open(
              `${exportExcel}?${qs.stringify(this.exportQuery)}`,
              '_blank'
            )
          }
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
        fixed: 'right',
        width: 200
      },
      trackDetail: {
        deliveryAddress: '',
        logisticsCompanyName: '',
        trackNum: '',
        phone: '',
        infos: []
      },
      trackList: [],
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
        row.orderStatusName === '已完成' ||
        row.orderStatusName === '已评价'
      )
    },
    go2Logistics(row) {
      this.$axios
        .$get(`${logistics}?orderCode=${row.orderCode}&orderId=${row.orderId}`)
        .then(res => {
          let address = res.payload.address

          this.trackList = res.payload.data
          this.trackList.forEach(item => {
            item.infos.forEach(info => {
              info.date = formatDate(info.createTime, 'YYYY-MM-DD')
              info.day = num2day[new Date(info.createTime).getUTCDay()]
              info.time = formatDate(info.createTime, 'HH:mm:ss')
            })
          })
          this.trackDetail.deliveryAddress =
            (address.provinceName || '') +
            (address.cityName || '') +
            (address.districtName || '') +
            ' ' +
            (address.postcode || ' ') +
            (address.receiverName || ' ') +
            (address.receiverPhone || '')
        })
        .catch()
      this.orderCode = row.orderCode
      this.visible = true
      this.outerVisible = true
    },
    go2Detail(row) {
      this.$router.push(`/order/order-detail?id=${row.orderId}`)
    },
    handleDetail(index, row) {
      console.log(this.trackList)
      this.trackDetail.trackNum = this.trackList[index].trackNum
      this.trackDetail.logisticsCompanyName = this.trackList[
        index
      ].logisticsCompanyName
      this.trackDetail.phone = this.trackList[index].phone
      this.trackDetail.infos = this.trackList[index].infos
      this.innerVisible = true
    },
    saveImportData() {
      let memberData = this.$refs.dataTable.$refs.searchForm.getFormValue()
      let authInfo = {
        token: this.token,
        tenantCode: this.tenantCode,
        shopOrPlat: 'plat'
      }
      Object.assign(this.exportQuery, memberData, this.customQuery, authInfo)
    }
  },
  computed: {
    ...mapState({
      tenantCode: function(state) {
        return state.tenantCode
      },
      token: function(state) {
        return state.token
      }
    }),
    ...mapGetters(['source'])
  },
  created() {
    this.searchForm[1].$options = source2Options(this.source)
  }
}
</script>

<style lang="stylus">
  .order-dialog{



  }
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
