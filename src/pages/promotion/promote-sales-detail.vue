<template>
  <div :class="pageName">
    <go-back></go-back>
     <div style="margin: 20px 10px">活动商品</div>
    <el-data-table
      ref="dataTable"
      :columns="propsColumns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :url="url"
      :customQuery="customQuery"
      data-path="goods"
      @update="getData"
    ></el-data-table>
    <div class="form-box" style="width: 524px;margin: 50px" >
      <el-form ref="form" label-width="140px" size="mini">
        <el-form-item label="规则名称：">
          <el-input v-model="tmarTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="支付定金时间：">
          <el-input
            :disabled="true"
            v-model="tmarDepositStmartTime"
            type="datetime"
            style="width: 180px">
          </el-input>
          <span>至</span>
          <el-input
            :disabled="true"
            v-model="tmarDepositEndTime"
            type="datetime"
            style="width: 180px">
          </el-input>
        </el-form-item>
        <el-form-item label="支付尾款时间：">
          <el-input
            :disabled="true"
            v-model="tmarFinalpayStmartTime"
            type="datetime"
            style="width: 180px">
          </el-input>
          <span>至</span>
          <el-input
            :disabled="true"
            v-model="tmarFinalpayEndTime"
            type="datetime"
            style="width: 180px">
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            :disabled="true"
            type="textarea"
            v-model="tmarDesc">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import GoBack from '@/components/GoBack'
import {goodQuery} from '@/const/api.js'
import {addRule} from '@/const/api.js'
import {goodsStatus} from '../../const/config'
export default {
  name: 'promote-sales-detail',
  components: {
    GoBack
  },
  data() {
    return {
      pageName: 'promote-sales-detail',
      dialogVisible: false,
      data: {},
      url:
        'http://levy.ren:3000/mock/477/mall-deepexi-marking-center/api/v1/presellRule/detail',
      customQuery: {
        tmarId: this.$route.query.tmarId
      },
      propsColumns: [
        {
          prop: 'tmagGoodsCode',
          label: '商品编号'
        },
        {
          prop: 'tmagGoodsName',
          label: '商品名称'
        },
        {
          prop: 'tmagSkuValue',
          label: '商品规格'
        },
        {
          prop: 'tmagGoodsPrice',
          label: '单价'
        },
        {
          prop: 'goodsStoc',
          label: '库存'
        },
        {
          prop: 'goodsStatus',
          label: '商品状态'
        },
        {
          prop: 'tmagGoodsStockCount',
          label: '活动库存'
        },
        {
          prop: 'tmagGoodsActivityPrice',
          label: '预售金额'
        },
        {
          prop: 'tmagDepositMoney',
          label: '定金'
        },
        {
          prop: 'tmagOffsetMoney',
          label: '定金抵扣金额'
        }
      ],
      propsData: [],
      form: {
        name: '',
        description: ''
      },
      tmarTitle: '',
      tmarDepositStmartTime: '',
      tmarDepositEndTime: '',
      tmarFinalpayStmartTime: '',
      tmarFinalpayEndTime: '',
      tmarDesc: ''
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
    }
  },
  methods: {
    getData(data, resp) {
      this.data = resp
      this.tmarTitle = this.data.tmarTitle
      this.tmarDepositStmartTime = this.data.tmarDepositStmartTime
      this.tmarDepositEndTime = this.data.tmarDepositEndTime
      this.tmarFinalpayStmartTime = this.data.tmarFinalpayStmartTime
      this.tmarFinalpayEndTime = this.data.tmarFinalpayEndTime
      this.tmarDesc = this.data.tmarDesc
    }
  }
}
</script>
