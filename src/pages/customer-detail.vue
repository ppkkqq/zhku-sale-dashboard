<template>
  <div class="customer-detail">
    <card-table header="基本信息">
      <table-info :table="baseInfo">
      </table-info>
    </card-table>
    <card-table header="用户画像">
      <table-info :table="statusInfo">
      </table-info>
    </card-table>
    <card-table header="资产信息">
      <el-data-table
        :columns="assetsColumns"
        :extraButtons="extraButtons"
        :hasNew="false"
        :hasPagination="false"
      >
      </el-data-table>
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
    <el-dialog title="积分收支明细" :visible.sync="dialogVisible" width="70%">
      <el-table :data="integralList" size="small">
        <el-table-column prop="createdAt" label="时间">
        </el-table-column>
        <el-table-column prop="batchAMT" label="收支明细">
          <template slot-scope="scope">
            <span v-if="scope.row.types === 'USED'">-{{scope.row.batchAMT}}</span>
            <span v-else>+{{scope.row.batchAMT}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="types" label="详细说明">
          <template slot-scope="scope">
            <span>{{scope.row.types === 'USED' ? '购买商品' : '购买商品'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import TableInfo from '@/components/table-info'
import CardTable from '@/components/card-table'
import {queryIntegralList} from '@/const/api'
import Viewer from 'viewer'
import {
  mcMemberInfos,
  address,
  browserHistory,
  collect,
  memberBaseInfo,
  getUserIconInfo
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
        formatter: row => price(row.price)
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
      statusInfo: [],
      addressInfo: [],
      invoiceInfo: [],
      collectInfo: [],
      browserHistoryInfo: [],
      dialogVisible: false,
      integralList: [],
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
      assetsUrl: '',
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
        {
          label: '商品编号',
          prop: 'code'
        },
        {
          label: '商品名称',
          prop: 'productName'
        },
        {
          label: '商品价格',
          prop: 'price',
          formatter: row => price(row.price)
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
        },
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
          prop: 'areaName',
          formatter: row =>
            `${row.provinceName} ${row.cityName} ${row.areaName}`
        },
        {
          label: '详细地址',
          prop: 'address'
        }
      ],
      assetsColumns: [
        {
          label: '类型'
          //prop: 'deliveryName'
        },
        {
          label: '当前总数'
          //prop: 'deliveryName'
        },
        {
          label: '近3个月消耗数'
          // prop: 'deliveryName'
        }
      ],
      extraButtons: [
        {
          text: '查看明细',
          type: 'primary',
          atClick: () => {
            this.showIntegralDetail()
          }
        }
      ],
      integralColumns: [
        {
          label: '时间',
          prop: 'deliveryName'
        },
        {
          label: '收支明细',
          prop: 'deliveryName'
        },
        {
          label: '详细说明',
          prop: 'deliveryName'
        }
      ],
      userIconInfo: ''
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
      生日: formatDate(data.birthday),
      邮箱: data.email,
      注册时间: formatDate(data.createdAt),
      最后登录时间: formatDate(data.lastLoginTime),
      会员等级: '注册会员'
    }
    //TODO： 会员等级接口数据

    const assetsInfo = {
      国源通币: payload.userBalance,
      积分: `${payload.userPoint}分`
    }
    const statusInfo = {
      基础属性: app.userIconInfo
    }
    return {
      baseInfo: Object2Options(baseInfo, ''),
      // assetsInfo: Object2Options(assetsInfo, ''),
      statusInfo: Object2Options(statusInfo, '')
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
    getBrowserHistory() {},
    showIntegralDetail() {
      this.$axios
        .$get(
          `${queryIntegralList(this.$route.query.memberId)}?page=${this.page}`
        )
        .then(resp => {
          const payload = resp.payload
          const content = payload.content
          this.integralList = content
        })
        .catch(resp => {})
        .finally(() => {
          this.dialogVisible = true
        })
    },
    getUserIconInfo() {
      //todo:对接口
      // this.$axios.$get(`${getUserIconInfo}?id=${this.$route.query.memberId}`)
      //   .then(res => {
      //     this.userIconInfo = res.payload.memberLaleb === 'INTERNALSTAFF' ? '内部员工' : '外部会员'
      //   })
      //   .catch()
    }
  },
  created() {
    this.assetsUrl = queryIntegralList(this.$route.query.memberId)
    this.getUserIconInfo()
  },
  mounted() {}
}
</script>

<style lang="stylus">
.customer-detail {
}
</style>
