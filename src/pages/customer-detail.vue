<template>
  <div class="customer-detail">
    <el-card shadow="never"
             class="border-0">
      <div slot="header">
        <h2>客户详情</h2>
      </div>
      <div class="customer-info">
        <div class="img">
          <img class="rounded-circle"
               height="120"
               width="120"
               :src="accountInfo.avatarUrl" />
        </div>
        <div class="table">
          <div class="title">
            <h3>账号信息</h3>
          </div>
          <table-info>
            <tr>
              <td class="label">昵称</td>
              <td class="value"
                  colspan="3">{{accountInfo.nickName}}</td>
            </tr>
            <tr>
              <td class="label">姓名</td>
              <td class="value"
                  colspan="3">{{accountInfo.realName}}</td>
            </tr>
            <tr>
              <td class="label">手机号</td>
              <td class="value"
                  colspan="3">{{accountInfo.mobile}}</td>
            </tr>
            <tr>
              <td class="label">注册时间</td>
              <td class="value"
                  colspan="3">{{accountInfo.createdAt | formatDate}}</td>
            </tr>
          </table-info>

        </div>
      </div>
      <div class="tab-container">
        <el-tabs v-model="activeTab"
                 @tab-click="handleClick">
          <el-tab-pane label="预约"
                       name="1">
            <el-data-table :url="subscribesUrl"
                           :columns="subscribesColumns"
                           :customQuery="evaluateCustomQuery"
                           :hasNew="false"
                           :hasEdit="false"
                           :hasDelete="false"
                           :hasOperation="false"
                           :isTree="false"
                           :hasPagination="true">
            </el-data-table>
          </el-tab-pane>
          <el-tab-pane label="订单"
                       name="2">
            <el-data-table :url="orderUrl"
                           :columns="orderColumns"
                           totalPath="payload.total"
                           dataPath="payload.list"
                           :hasNew="false"
                           :customQuery="orderCustomQuery"
                           :hasEdit="false"
                           :hasDelete="false"
                           :hasOperation="false"
                           :isTree="false"
                           :hasPagination="true">
            </el-data-table>
          </el-tab-pane>
          <el-tab-pane label="关注"
                       name="3">
            <el-data-table :url="focusUrl"
                           :columns="focusColumns"
                           :hasNew="false"
                           :hasEdit="false"
                           :hasDelete="false"
                           :hasOperation="false"
                           :isTree="false"
                           :hasPagination="true">
            </el-data-table>
          </el-tab-pane>
          <el-tab-pane label="评价"
                       name="4">
            <el-data-table :url="evaluateUrl"
                           :columns="evaluateColumns"
                           :customQuery="evaluateCustomQuery"
                           :hasNew="false"
                           dataPath="payload.list"
                           :hasEdit="false"
                           :hasDelete="false"
                           :hasOperation="false"
                           :isTree="false"
                           :hasPagination="true">
            </el-data-table>
          </el-tab-pane>
          <el-tab-pane label="资料"
                       name="5">
            <table-info v-if="certificate.length > 0">
              <tr v-for="item in certificate"
                  :key="item.label">
                <td class="label"
                    style="width:10%">{{item.label}}</td>
                <td class="value"
                    colspan="3">
                  <img :src="item.front"
                       style="width:200px"
                       alt="">
                  <img :src="item.back"
                       style="width:200px"
                       alt="">
                </td>
              </tr>
            </table-info>
            <div class="text-center"
                 v-else>
              <p style="color:#909399;padding:20px">暂无数据</p>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="车辆"
                       name="6">
            <el-data-table :url="carUrl"
                           :columns="carColumns"
                           :customQuery="carCustomQuery"
                           :hasNew="false"
                           :hasEdit="false"
                           :hasDelete="false"
                           :hasOperation="false"
                           :isTree="false"
                           :hasPagination="true">
            </el-data-table>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import TableInfo from '@/components/table-info'
import {
  mcMemberInfos,
  orderList,
  customerFocus,
  // customerCars,
  customerCertificatess,
  customerSubscribes,
  customerEvaluate
} from '@/const/api'
import {
  orderStatusOptions,
  orderTypeOptions,
  productType,
  certificateType,
  subscribeType
} from '@/const/config'
import {formatDate, price, toOptionsLabel} from '@/const/filter'

export default {
  name: 'customer-detail',
  components: {
    TableInfo
  },
  data() {
    return {
      activeTab: '1',
      subscribesUrl: customerSubscribes,
      subscribesColumns: [
        {
          prop: 'id',
          label: '预约单号'
        },
        {
          prop: 'name',
          formatter: row => formatDate(row.createdAt),
          label: '预约时间'
        },
        {
          prop: 'shopName',
          label: '门店'
        },
        {
          prop: 'status',
          label: '预约状态',
          formatter: row => subscribeType[row.status]
        }
      ],
      orderColumns: [
        {
          prop: 'orderType',
          label: '订单类型',
          formatter: row => toOptionsLabel(row.orderType, orderTypeOptions)
        },
        {
          prop: 'createdAt',
          label: '单据时间',
          formatter: row => formatDate(row.createdAt)
        },
        {prop: 'id', label: '订单号'},
        {prop: 'shopName', label: '门店'},
        {prop: 'memberName', label: '客户姓名'},
        {prop: 'memberPhone', label: '客户手机号'},
        {prop: 'carType', label: '车型', formatter: this.formatterCarType},
        {prop: 'payMoney', label: '支付金额', formatter: this.formatterMoney},
        {
          prop: 'status',
          label: '订单状态',
          formatter: this.formatterOrderStatus
        }
      ],
      focusColumns: [
        {
          prop: 'createdAt',
          label: '关注时间',
          formatter: row => formatDate(row.createdAt)
        },
        {prop: 'goodsInfo.shopName', label: '门店'},
        {prop: 'goodsInfo.name', label: '商品名称'}
      ],
      evaluateColumns: [
        {prop: 'orderId', label: '订单编号'},
        {prop: 'orderType', label: '订单类型'},
        {prop: 'itemName', label: '商品信息'},
        {prop: 'satisfactionScore', label: '评价分数'},
        {prop: 'content', label: '评价内容'},
        {
          prop: 'createdAt',
          label: '评价时间',
          formatter: row => formatDate(row.createdAt)
        }
      ],
      carColumns: [
        {prop: 'brandName', label: '品牌'},
        {prop: 'seriesName', label: '车系'},
        {prop: 'modelName', label: '车型'},
        {prop: 'plateNumber', label: '车牌号'},
        {prop: 'hasMileage', label: '公里数'},
        {
          prop: 'isDefault',
          label: '是否默认车辆',
          formatter: row => (row.isDefault == '1' ? '是' : '否')
        }
      ],
      certificate: [],

      orderUrl: '',
      focusUrl: '',
      evaluateUrl: '',
      carUrl: ''
    }
  },
  async asyncData({app, query}) {
    let accountInfo
    try {
      accountInfo = await app.$axios.$get(`${mcMemberInfos}/${query.memberId}`)
    } catch (e) {
      console.log(e)
    }
    return {
      accountInfo: (accountInfo && accountInfo.payload) || {}
    }
  },
  computed: {
    orderCustomQuery() {
      return {
        entranceType: 'ENTRANCE_TYPE_ZONGBU',
        memberId: this.id
      }
    },
    evaluateCustomQuery() {
      return {
        memberId: this.id
      }
    },
    carCustomQuery() {
      return {
        accountId: this.id
      }
    },
    id() {
      return this.$route.query.memberId
      // return '5b7d38f635c242945fcaba7d'//测试账号
    }
  },
  filters: {
    formatDate: formatDate
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case '2':
          this.orderUrl = this.accountInfo.mobile ? orderList : ''
          break
        case '3':
          this.focusUrl = `${customerFocus}/${this.id}`
          break
        case '4':
          this.evaluateUrl = customerEvaluate
          break
        case '5':
          if (this.certificateLoaded) return

          //证件类型 1:身份证；2：护照；3：台胞证；4：军官证；5：回乡证; 6 : 驾驶证; 7 : 行驶证
          this.$axios
            .$get(`${customerCertificatess}?accountId=${this.id}`)
            .then(response => {
              this.certificateLoaded = true
              const data = response.payload.content
              this.certificate = data.map(item => {
                return {
                  label: certificateType[item.type],
                  front: item.frontageImageUrl,
                  back: item.backageImageUrl
                }
              })
            })
            .catch(error => {
              this.$message.error('获取我的证件失败')
            })
          break
        case '6':
          // this.carUrl = customerCars
          break
      }
    },
    formatterCarType(row, column) {
      const {outDtoTradeOrderLines = []} = row
      const data = outDtoTradeOrderLines.filter(
        item => item.productType === productType['新车']
      )
      if (data[0]) {
        return data[0].itemName
      }
      return ''
    },
    formatterMoney(row, column) {
      return price(row.payMoney || 0)
    },
    formatterOrderStatus(row, column) {
      return toOptionsLabel(row.status, orderStatusOptions)
    }
  }
}
</script>

<style lang="stylus">
.customer-detail {
  .customer-info {
    display: flex;
    width: 100%;
    margin-bottom: 30px;

    .title {
      margin: 10px 0;
    }

    .img {
      padding: 40px;
      margin-right: 20px;
    }

    .table {
      flex: 1;

      .table-info {
        width: 400px;

        .label {
          width: 10%;
        }
      }
    }
  }
}
</style>
