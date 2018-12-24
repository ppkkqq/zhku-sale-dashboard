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
      <el-table
        :data="assetsTableData"
        border
        style="width: 100%">
        <el-table-column
          prop="type"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="currentNum"
          label="当前总数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="usedNum"
          label="近3个月消耗数">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="showIntegralDetail(scope.row)" type="text" size="small">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="积分收支明细" :visible.sync="dialogVisible" width="50%">
      <el-table :data="integralList" size="small">
        <el-table-column prop="createdAt" label="时间">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.createdAt)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchAmt" label="收支明细">
          <template slot-scope="scope">
            <span v-if="scope.row.types === 'USED' || scope.row.types === 'REFUND' || scope.row.types === 'WASTED'" class="c-b" style="font-weight: 600">-{{scope.row.batchAmt}}</span>
            <span v-else class="c-r" style="font-weight: 600">+{{scope.row.batchAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="types" label="详细说明">
          <template slot-scope="scope">
            <span>{{integralType[scope.row.types]}}</span>
            <span> (
                    <span v-if="scope.row.types === 'REFUND'">售后单号</span>
                    <span v-else>订单号</span>
                    ：{{scope.row.mainOrderNum.slice(0,8)}} )
                  </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="text-align: right;">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-count="numPage" @prev-click="()=>{--page}" @next-click="()=>{++page}">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="国源通币明细" :visible.sync="currencyVisible" width="50%">
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane label="国源通币使用明细" name="detail">
            <el-table :data="currencyData">
              <el-table-column prop="batchNum" label="国源通币编号"></el-table-column>
              <el-table-column prop="useTime" label="使用时间"></el-table-column>
              <el-table-column prop="orderId" label="订单"></el-table-column>
              <el-table-column prop="useMoney" label="使用币数"></el-table-column>
              <el-table-column prop="balance" label="剩余币数"></el-table-column>
            </el-table>
              <div class="pagination" style="text-align: right;">
                <el-pagination background layout="prev, pager, next" :current-page.sync="detailPage" :page-count="numDetailPage" @prev-click="()=>{--detailPage}" @next-click="()=>{++detailPage}">
                </el-pagination>
              </div>
        </el-tab-pane>
        <el-tab-pane label="国源通币列表" name="list">
          <el-table :data="currencyList">
            <el-table-column prop="batchNum" label="国源通币编号"></el-table-column>
            <el-table-column prop="activityDate" label="有效期"></el-table-column>
            <el-table-column prop="usableScope" label="适用范围"></el-table-column>
            <el-table-column prop="balance" label="剩余币数"></el-table-column>
            <el-table-column prop="startDate" label="发放时间"></el-table-column>
          </el-table>
            <div class="pagination" style="text-align: right;">
              <el-pagination background layout="prev, pager, next" :current-page.sync="listPage" :page-count="numListPage" @prev-click="()=>{--listPage}" @next-click="()=>{++listPage}">
              </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
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
  memberBaseInfo,
  getUserIconInfo,
  queryIntegralList,
  queryIntegralCount,
  queryCurrencyDetail,
  queryCurrencyList
} from '@/const/api'
import {productType, certificateType, subscribeType} from '@/const/config'
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
      currencyVisible: false,
      activeTabName: 'detail',
      integralList: [],
      currencyList: [],
      page: 1,
      numPage: 0,
      detailPage: 1,
      numDetailPage: 0,
      listPage: 1,
      numListPage: 0,
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
      //todo:对接口
      assetsTableData: [
        {
          type: '积分',
          currentNum: 0,
          usedNum: 0
        },
        {
          type: '国源通币',
          currentNum: 100,
          usedNum: 200
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
      currencyData: [],
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
      会员等级: data.levelName
    }

    const assetsInfo = {
      国源通币: payload.userBalance,
      积分: `${payload.userPoint}分`
    }
    const statusInfo = {
      基础属性: data.memberType === 'NORMALACCOUNT' ? '外部会员' : '内部员工'
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
    showIntegralDetail(value) {
      if (value.type === '积分') {
        this.$axios
          .$get(
            `${queryIntegralList(this.$route.query.memberId)}?page=${this.page}`
          )
          .then(resp => {
            const payload = resp.payload
            const content = payload.content
            this.integralList = content
            this.numPage = payload.totalPages
          })
          .catch(resp => {})
          .finally(() => {
            this.dialogVisible = true
          })
      } else {
        //获取圆通币明细
        this.$axios
          .$get(
            `${queryCurrencyDetail}?memberId=${
              this.$route.query.memberId
            }&page=${this.detailPage}`
          )
          .then(resp => {
            const payload = resp.payload
            const content = payload.content
            this.integralList = content
            this.numDetailPage = payload.totalPages
          })
          .catch(resp => {})
          .finally(() => {
            this.currencyVisible = true
          })
        //获取列表
        this.$axios
          .$get(
            `${queryCurrencyList}?memberId=${this.$route.query.memberId}&page=${
              this.listPage
            }`
          )
          .then(resp => {
            const payload = resp.payload
            const content = payload.content
            this.currencyList = content
            this.numListPage = payload.totalPages
          })
          .catch(resp => {})
          .finally(() => {
            this.currencyVisible = true
          })
      }
    },
    getUserIconInfo() {
      //todo:对接口
      // this.$axios.$get(`${getUserIconInfo}?id=${this.$route.query.memberId}`)
      //   .then(res => {
      //     this.userIconInfo = res.payload.memberLaleb === 'INTERNALSTAFF' ? '内部员工' : '外部会员'
      //   })
      //   .catch()
    },
    getIntegralCount() {
      this.$axios
        .$get(`${queryIntegralCount(this.$route.query.memberId)}`)
        .then(resp => {
          const content = resp.payload
          this.assetsTableData[0].currentNum = content.balance
            ? content.balance
            : 0
          this.assetsTableData[0].usedNum = content.expendPoint
            ? content.expendPoint
            : 0
        })
        .catch(resp => {})
        .finally(() => {
          this.loading = false
        })
    },
    getCurrencyData() {
      this.$axios
        .$get(queryCurrencyDetail)
        .then(resp => {
          const content = resp.payload
          this.assetsTableData[0].currentNum = content.balance
            ? content.balance
            : 0
          this.assetsTableData[0].usedNum = content.expendPoint
            ? content.expendPoint
            : 0
        })
        .catch(resp => {})
        .finally(() => {
          this.loading = false
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  },
  created() {
    this.assetsUrl = queryIntegralList(this.$route.query.memberId)
    this.getUserIconInfo()
    this.getIntegralCount()
    // this.getCurrencyData()
    this.integralType = {
      USED: '购物扣积分',
      REFUND: '退货扣积分',
      WASTED: '过期扣积分',
      SHOPPING_GENERATED: '购物送积分',
      COMMENT_GENERATED: '评论送积分',
      INPOUR: '充值得积分'
    }
  },
  mounted() {}
}
</script>

<style lang="stylus">
.customer-detail {
}
</style>
