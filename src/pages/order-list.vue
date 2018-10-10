<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      totalPath="payload.total"
      dataPath="payload.list"
      :customQuery="customQuery"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :searchForm="searchForm">
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
  </div>
</template>

<script>
import {orderStatusOptions, orderTypeOptions, productType} from '@/const/config'
import {formatDate, price, toOptionsLabel, options2Object} from '@/const/filter'
import {orderList} from '@/const/api'
import StoreSelect from '@/container/store-select/'
import searchFormMixin from '@/mixins/search-form-slot'

export default {
  name: 'order-list',
  components: {StoreSelect},
  mixins: [searchFormMixin],
  data() {
    return {
      pageName: 'order-list',
      url: orderList,
      columns: [
        {
          prop: 'num',
          label: '序号'
        },
        {
          prop: 'orderId',
          label: '订单编号'
        },
        {
          prop: 'orderCost',
          label: '订单金额',
          formatter: row => toOptionsLabel(row.orderType, orderTypeOptions)
        },
        {
          prop: 'itemSource',
          label: '商品来源'
        },
        {
          prop: 'status',
          label: '订单状态',
          formatter: row => toOptionsLabel(row.orderType, orderTypeOptions)
        },
        {
          prop: 'account',
          label: '下单账号'
        },
        {
          prop: 'time',
          label: '下单时间',
          formatter: row => toOptionsLabel(row.orderType, orderTypeOptions)
        }
      ],
      extraButtons: [
        {
          text: '查看物流' || '发货',
          type: 'primary',
          show: this.showButton,
          atClick: this.go2Detail
        },
        {
          text: '详情',
          type: 'primary',
          show: this.showButton,
          atClick: this.go2Detail
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入订单编号'},
          label: '订单编号',
          $id: 'orderId',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入商品来源'},
          label: '商品来源',
          $id: 'itemSource',
          $type: 'input'
        },
        {
          // 1待支付，2待发货，3待收货，4待评论，5已取消，6已评论
          $options: [
            {
              value: '1',
              label: '待支付'
            },
            {
              value: '2',
              label: '待发货'
            },
            {
              value: '3',
              label: '待收货'
            },
            {
              value: '4',
              label: '待评论'
            },
            {
              value: '5',
              label: '已取消'
            },
            {
              value: '6',
              label: '已评论'
            }
          ],
          $el: {placeholder: '请选择订单状态'},
          label: '订单状态',
          $id: 'status',
          $type: 'select'
        }
      ],
      payTime: '',
      orderTime: '',
      customQuery: {
        orderTime: '',
        payTime: ''
      }
    }
  },
  methods: {
    setTime(way) {
      if (this[way + 'Time']) {
        this.customQuery[way + 'Time'] = this[way + 'Time'].join(',')
      }
    },
    formatterCarType(row, column) {
      const {outDtoTradeOrderLines = []} = row
      const data = outDtoTradeOrderLines.filter(
        item => item.productType === productType['新车']
      )
      if (data[0]) {
        return data[0].bundleCarModelName
      }
      return ''
    },
    formatterMoney(row, column) {
      return price(row.payMoney || 0)
    },
    formatterOrderStatus(row, column) {
      return toOptionsLabel(row.status, orderStatusOptions)
    },
    showButton(row) {
      const type = row.orderType
      const options = options2Object(orderTypeOptions)
      return options[type] === '保养订单' || options[type] === '新车订单'
    },
    go2Detail(row) {
      const type = row.orderType
      const options = options2Object(orderTypeOptions)

      if (options[type] === '保养订单') {
        this.$router.push(`/order-detail-maintain?id=${row.id}`)
      } else {
        this.$router.push(`/order-detail-car?id=${row.id}`)
      }
    }
  },
  computed: {}
}
</script>
