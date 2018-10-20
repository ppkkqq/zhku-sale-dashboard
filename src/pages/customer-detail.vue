<template>
  <div class="customer-detail">
    <card-table header="基本信息">
      <table-info :table="baseInfo">
      </table-info>
    </card-table>

    <card-table header="资金信息">
      <table-info :table="assetsInfo">
      </table-info>
    </card-table>
    <card-table header="收货地址">
      <el-data-table
        :url="address"
        :columns="addressColumns"
        v-bind="dataTableConfig"
      >
      </el-data-table>
    </card-table>
    <!--<card-table header="发票信息"></card-table>-->
    <card-table header="收藏夹">
      <el-data-table
        :url="collect"
        :columns="collectColumns"
        v-bind="dataTableConfig"
      ></el-data-table>
    </card-table>
    <card-table header="足迹">
      <el-data-table
        :url="browserHistory"
        :columns="browserHistoryColumns"
        v-bind="dataTableConfig"
      ></el-data-table>
    </card-table>

  </div>
</template>

<script>
import TableInfo from '@/components/table-info'
import CardTable from '@/components/card-table'
import Viewer from 'viewer'
import {
  mcMemberInfos,
  address,
  browserHistory,
  collect,
  memberBaseInfo
} from '@/const/api'
import {
  orderStatusOptions,
  orderTypeOptions,
  productType,
  certificateType,
  subscribeType
} from '@/const/config'
import {formatDate, price, toOptionsLabel, Object2Options} from '@/const/filter'
import {onelineStatus} from '@/const/goods'

export default {
  name: 'customer-detail',
  components: {
    TableInfo,
    CardTable,
    Viewer
  },
  data() {
    const commonColumns = [
      {
        label: '商品编号',
        prop: 'code'
      },
      {
        label: '商品名称',
        prop: 'name'
      },
      {
        label: '商品价格',
        prop: 'price',
        formatter: ({val}) => price(val)
      },
      {
        label: '图片',
        prop: 'productPhoto',
        formatter: ({productPhoto}) => {
          if (productPhoto) {
            let showFirstImg = productPhoto.split(',')[0] || ''
            return <viewer src={showFirstImg} />
          }
        }
      }
    ]
    let accountId = `?accountId=${this.$route.query.memberId}`
    return {
      baseInfo: [],
      addressInfo: [],
      invoiceInfo: [],
      collectInfo: [],
      browserHistoryInfo: [],

      dataTableConfig: {
        hasNew: false,
        hasOperation: false,
        dataPath: 'payload.list',
        totalPath: 'payload.total',
        paginationSize: 5,
        paginationSizes: [5, 10]
      },
      collect: collect + accountId,
      browserHistory: browserHistory + accountId,
      address: address + accountId,

      collectColumns: [
        ...commonColumns,
        {
          label: '商品状态',
          prop: 'status',
          formatter: ({status}) => onelineStatus[status]
        },
        {
          label: '收藏时间',
          prop: 'collectTime',
          formatter: ({collectTime}) => formatDate(collectTime)
        }
      ],
      browserHistoryColumns: [
        ...commonColumns,
        {
          label: '访问时间',
          prop: 'createdAt',
          formatter: ({createdAt}) => formatDate(createdAt)
        }
      ],
      addressColumns: [
        {
          label: '收货人姓名',
          prop: 'deliveryName'
        },
        {
          label: '电话',
          prop: 'deliveryMobile'
        },
        {
          label: '所在地区',
          prop: 'areaName'
        },
        {
          label: '详细地址',
          prop: 'address'
        }
      ]
    }
  },
  async asyncData({app, query}) {
    let accountInfo
    try {
      accountInfo = await app.$axios.$get(
        `${memberBaseInfo}?id=${query.memberId}`
      )
    } catch (e) {
      console.log(e)
    }

    let payload = (accountInfo && accountInfo.payload) || {}
    let data = payload.userBasicInfo || {}

    const baseInfo = {
      昵称: data.nickName,
      手机号: data.mobile,
      性别: data.gender,
      生日: data.birthday,
      邮箱: data.email,
      注册时间: formatDate(data.createdAt),
      最后登录时间: formatDate(data.updatedAt)
    }

    const assetsInfo = {
      源通币: payload.userBalance,
      积分: `${payload.userPoint}分`
    }
    return {
      baseInfo: Object2Options(baseInfo, ''),
      assetsInfo: Object2Options(assetsInfo, '')
    }
  },
  computed: {
    id() {
      return this.$route.query.memberId
    }
  },
  filters: {
    formatDate: formatDate
  },
  methods: {
    getData({url, loadingName}) {
      this[loadingName] = true
      return this.$axios
        .$get(url)
        .then(resp => {
          return resp
        })
        .catch(e => console.error(e))
        .finally(() => {
          this[loadingName] = false
        })
    },
    getAssets() {
      // 暂无 优惠券
    },
    async getAddress() {
      let resp = await this.getData({
        url: address,
        loadingName: 'addressLoading'
      })
      let data = (resp && resp.payload.list) || {}

      const addressInfo = {
        收货人姓名: data.deliveryName,
        电话: data.deliveryMobile,
        所在地区: data.areaName,
        详细地址: data.address
      }
      this.addressInfo = Object2Options(addressInfo, '')
    },
    getInvoice() {
      // 暂无
    },
    getCollect() {},
    getBrowserHistory() {}
  },

  mounted() {}
}
</script>

<style lang="stylus">
.customer-detail {
}
</style>
