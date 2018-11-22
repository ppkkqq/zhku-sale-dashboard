<template>
  <div :class="pageName">
    <go-back></go-back>
    <base-layout
      title="设置商品"
      :hasEdit="!isView"
      btn-text="添加商品"
      @click="()=> {this.dialogVisible=true}"
    >
      <el-table :data="propsData">
        <el-table-column
        v-for="col in propsColumns"
        :key="col.prop"
        :prop="col.prop"
        minWidth="130px"
        v-bind="col"
      ></el-table-column>
        <el-table-column minWidth="130px" prop="tmagGoodsStockCount" label="活动库存">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.tmagGoodsStockCount" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column minWidth="130px" prop="tmagGoodsActivityPrice" label="预售金额">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.tmagGoodsActivityPrice" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column minWidth="130px" prop="tmagDepositMoney" label="*定金">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.tmagDepositMoney" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column minWidth="130px" prop="tmagOffsetMoney" label="*定金抵扣金额">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.tmagOffsetMoney" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" v-if="!isView">
          <template slot-scope="scope">
            <!--<el-button size="mini" v-show="scope.$index !== 0" @click="sortRow(scope.$index, 'up')">上移</el-button>-->
            <!--<el-button size="mini" v-show="scope.$index !== (propsData.length - 1)" @click="sortRow(scope.$index, 'down')">下移</el-button>-->
            <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">撤出活动</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
    <div class="form-box" style="width: 524px">
      <el-form ref="form" label-width="140px" size="mini">
        <el-form-item label="*规则名称：">
          <el-input v-model="tmarTitle" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="*支付定金时间：">
          <el-date-picker
            v-model="tmarDepositStmartTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 180px"
            :disabled="isView">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="tmarDepositEndTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 180px"
            :disabled="isView">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="*支付尾款时间：">
          <el-date-picker
            v-model="tmarFinalpayStmartTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 180px"
            :disabled="isView">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="tmarFinalpayEndTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 180px"
            :disabled="isView">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="tmarDesc"
            :disabled="isView">
          </el-input>
        </el-form-item>
        <el-form-item size="large" v-if="!(this.$route.query.tmarId && !this.$route.query.action)">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="添加商品" :visible.sync="dialogVisible" width="70%">
      <el-data-table
        ref="dataTable"
        :url="url"
        :columns="dialogColumns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :isTree="false"
        :hasPagination="true"
        data-path="payload.list"
        totalPath="payload.total"
        :searchForm="searchForm"
        :operationAttrs="operationAttrs"
        :extraButtons="extraButtons"
      ></el-data-table>
      <el-button type="primary" @click="()=> {this.dialogVisible=false}">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import GoBack from '@/components/GoBack'
import InputPrice from '@/components/goods-template/props-manage/input-price.vue'
import BaseLayout from '@/components/goods-template/base-layout'
import {goodQuery} from '@/const/api.js'
import {addRule} from '@/const/api.js'
import {updateRule} from '@/const/api.js'
import {ruleDetail} from '@/const/api.js'
import {goodsStatus} from '../../const/config'
export default {
  name: 'promote-sales-detail',
  components: {
    GoBack,
    InputPrice,
    BaseLayout
  },
  data() {
    return {
      pageName: 'promote-sales-detail',
      // url: goodQuery,
      isView: false,
      // url: goodQuery,
      url:
        'http://levy.ren:3000/mock/477/mall-deepexi-marking-center/api/v1/presell/rule/goods/query',
      dialogVisible: false,
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
          prop: 'acc',
          label: '库存'
        },
        {
          prop: 'status',
          label: '商品状态'
        }
      ],
      dialogColumns: [
        {
          prop: 'goodsCode',
          label: '商品编号',
          default: ''
        },
        {
          prop: 'goodsName',
          label: '商品名称',
          default: ''
        },
        {
          prop: 'goodsSkuName',
          label: '商品规格',
          default: ''
        },
        {
          prop: 'goodsPrice',
          label: '单价',
          default: ''
        },
        {
          prop: 'goodsStock',
          label: '库存',
          default: ''
        },
        {
          prop: 'goodsStatus',
          label: '商品状态',
          default: ''
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品编号',
          $id: 'goodsCode',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品名称',
          $id: 'goodsName',
          $type: 'input'
        }
      ],
      operationAttrs: {
        width: 100,
        fixed: 'right'
      },
      extraButtons: [
        {
          text: '选择',
          type: 'primary',
          // atClick: this.addRow
          atClick: row => {
            this.addRow(row)
          }
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
    // isView() {
    //   return this.$route.query.isView > 0
    // }
  },
  methods: {
    addRow(data) {
      this.dialogVisible = true
      this.propsData.push({
        tmagGoodsCode: data.goodsCode,
        tmagGoodsName: data.goodsName,
        tmagSkuValue: data.goodsSkuName,
        tmagGoodsPrice: data.goodsPrice,
        acc: data.goodsStock,
        status: data.goodsStatus,
        tmagSkuId: data.goodsSkuId,
        tmagSkuCode: data.goodsSkuCode,
        tmagGoodsId: data.goodsId
      })
    },
    delRow(index, row) {
      this.$confirm('确定删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.propsData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    onSubmit() {
      const data = {
        goods: this.propsData,
        tmarTitle: this.tmarTitle,
        tmarDepositStmartTime: this.tmarDepositStmartTime,
        tmarDepositEndTime: this.tmarDepositEndTime,
        tmarFinalpayStmartTime: this.tmarFinalpayStmartTime,
        tmarFinalpayEndTime: this.tmarFinalpayEndTime,
        tmarDesc: this.tmarDesc
      }
      if (this.$route.query.action === 'edit') {
        this.$axios
          .$put(
            'http://levy.ren:3000/mock/477/mall-deepexi-marking-center/api/v1/presell/rule/update',
            data
          )
          .then(res => {
            if (res.payload) {
              this.$message.success('编辑成功！')
              this.$router.push('/promotion/promote-sales-list')
            } else {
              this.$message.error('操作失败，请重新操作！')
            }
          })
          .catch(e => {})
      } else {
        this.$axios
          .$post(
            'http://levy.ren:3000/mock/477/mall-deepexi-marking-center/api/v1/presell/rule/add',
            data
          )
          .then(res => {
            if (res.payload) {
              this.$message.success('新建成功！')
              this.$router.push('/promotion/promote-sales-list')
            } else {
              this.$message.error('操作失败，请重新操作！')
            }
          })
          .catch(e => {})
      }
    },
    onCancel() {
      this.$router.back()
    }
  },
  created() {
    if (this.$route.query.tmarId) {
      this.$axios
        .$get(
          'http://levy.ren:3000/mock/477/mall-deepexi-marking-center/api/v1/presell/rule/detail',
          {tmarId: this.$route.query.tmarId}
        )
        .then(result => {
          console.log(result)
          for (var i = 0; i < result.goods.length; i++) {
            this.propsData.push({
              tmagGoodsCode: result.goods[i].tmagGoodsCode,
              tmagGoodsName: result.goods[i].tmagGoodsName,
              tmagSkuValue: result.goods[i].tmagSkuValue,
              tmagGoodsPrice: result.goods[i].tmagGoodsPrice,
              acc: result.goods[i].goodsStock,
              status: result.goods[i].goodsStatus,
              tmagGoodsStockCount: result.goods[i].tmagGoodsStockCount,
              tmagGoodsActivityPrice: result.goods[i].tmagGoodsActivityPrice,
              tmagDepositMoney: result.goods[i].tmagDepositMoney,
              tmagOffsetMoney: result.goods[i].tmagOffsetMoney
            })
          }
          this.tmarTitle = result.tmarTitle
          this.tmarDepositStmartTime = result.tmarDepositStmartTime
          this.tmarDepositEndTime = result.tmarDepositEndTime
          this.tmarFinalpayStmartTime = result.tmarFinalpayStmartTime
          this.tmarFinalpayEndTime = result.tmarFinalpayEndTime
          this.tmarDesc = result.tmarDesc
        })
      if (this.$route.query.action) {
        this.isView = false
      } else {
        this.isView = true
      }
    }
  }
}
</script>
