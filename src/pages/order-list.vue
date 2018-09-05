<template>
  <div :class="pageName">
    <el-data-table ref="dataTable" :url="url" :columns="columns" totalPath="payload.total" dataPath="payload.list" :customQuery="customQuery" :hasNew="false" :hasEdit="false" :hasDelete="false" :hasOperation="true" :isTree="false" :hasPagination="true" :extraButtons="extraButtons" :searchForm="searchForm">
      <template slot="search">
        <el-form-item label="门店" prop="shopId">
          <store-select @change="handleSelect('shopId', $event)" ref="shopId"></store-select>
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
          prop: 'orderType',
          label: '订单类型',
          formatter: row => toOptionsLabel(row.orderType, orderTypeOptions)
        },
        {
          prop: 'createdAt',
          label: '单据时间',
          minWidth: 130,
          formatter: row => formatDate(row.createdAt)
        },
        {
          prop: 'id',
          label: '订单号',
          minWidth: 160
        },
        {
          prop: 'shopName',
          label: '门店',
          minWidth: 180,
          'show-overflow-tooltip': true
        },
        {
          prop: 'memberName',
          label: '客户姓名'
        },
        {
          prop: 'memberPhone',
          label: '客户手机号',
          minWidth: 120
        },
        {prop: 'carType', label: '车型', formatter: this.formatterCarType},
        {prop: 'payMoney', label: '支付金额', formatter: this.formatterMoney},
        {
          prop: 'status',
          label: '订单状态',
          minWidth: 120,
          formatter: this.formatterOrderStatus
        }
      ],
      customQuery: {
        entranceType: 'ENTRANCE_TYPE_ZONGBU'
      },
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          show: this.showButton,
          atClick: this.go2Detail
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入客户姓名'},
          label: '客户姓名',
          $id: 'memberName',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入客户手机号'},
          label: '客户手机号',
          $id: 'memberPhone',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入订单号'},
          label: '订单号',
          $id: 'id',
          $type: 'input'
        },
        {
          $options: orderTypeOptions,
          $el: {placeholder: '请选择订单类型'},
          label: '订单类型',
          $id: 'orderType',
          $type: 'select'
        },
        {
          $options: orderStatusOptions,
          $el: {placeholder: '请选择订单状态'},
          label: '订单状态',
          $id: 'status',
          $type: 'select'
        }
      ]
    }
  },
  methods: {
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
  }
}
</script>
