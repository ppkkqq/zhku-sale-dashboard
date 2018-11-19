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
        <el-table-column minWidth="130px" prop="stock" label="活动库存">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.stock" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column minWidth="130px" prop="price1" label="*抢购价">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.price1" :disabled="isView"/>
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
    <el-card shadow="never" status-icon class="base-layout" :hasEdit="!isView" @click="addRow" btn-text>
      <el-form ref="form" :model="form" :rules="rules2"  class='demo-r' label-width="100px" :disabled="isView">


        <el-form-item label="规则名称" prop='name'>
          <el-input v-model="form.name" placeholder="限30字符" ></el-input>
        </el-form-item>
        <el-form-item label="参与次数" prop='time'>
          <el-input v-model="form.time" placeholder="未填写表示不限定" ></el-input>
        </el-form-item>
        <el-form-item label="限定数量" prop='number'>
          <el-input v-model="form.number" placeholder="未填写表示不限定" ></el-input>
        </el-form-item>


        <el-form-item label="规则描述">
          <el-input type="textarea" :rows="2" placeholder="限200字符" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
          <el-button @click="onCancel" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="添加商品" :visible.sync="dialogVisible" width="70%">
      <el-data-table
        ref="dataTable"
        @update='update'
        :url='url'
        :columns="dialogColumns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :isTree="false"
        :hasPagination="true"
        data-path="goods"
        totalPath="payload.total"
        :searchForm="searchForm"
        :operationAttrs="operationAttrs"
        :extraButtons="extraButtons"
      ></el-data-table>
    </el-dialog>
  </div>
</template>
<script>
import GoBack from '@/components/GoBack'
import InputPrice from '@/components/goods-template/props-manage/input-price.vue'
import BaseLayout from '@/components/goods-template/base-layout'
import {
  buyingRuleList,
  buyingRuleAddRule,
  buyingRuleDetail
} from '@/const/api.js'
import {NUMBERPattern, CHINESEPattern, onlyChina} from '@/const/pattern.js'
export default {
  name: 'flash-sales-detail',
  components: {
    GoBack,
    InputPrice,
    BaseLayout
  },
  created() {
    this.$axios.get(buyingRuleDetail).then(res => {
      console.log(res)
      this.propsData = res.data.goods
      console.log(this.propsData)
    })
  },
  data() {
    var ruleName = (rule, value, callback) => {
      if (onlyChina.test(value)) {
        callback()
      } else {
        callback(new Error('请输入文字'))
      }
    }
    var ruleTime = (rule, value, callback) => {
      if (NUMBERPattern.test(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    var ruleNumber = (rule, value, callback) => {
      if (NUMBERPattern.test(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      pageName: 'flash-sales-detail',
      url: buyingRuleDetail,
      buyingRuleDetailGood: [],
      dialogVisible: false,
      form: {
        name: '',
        time: '',
        number: ''
      },
      rules2: {
        name: [{validator: ruleName, trigger: 'blur'}],
        time: [
          {
            validator: ruleTime,
            trigger: 'blur'
          }
        ],
        number: [
          {
            validator: ruleNumber,
            trigger: 'blur'
          }
        ]
      },
      propsColumns: [
        {
          prop: 'tmagGoodsId',
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
          prop: 'goodsStock',
          label: '库存'
        },
        {
          prop: 'goodsStatus',
          label: '商品状态'
        }
      ],
      dialogColumns: [
        {
          prop: 'tmagGoodsId',
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
          prop: 'goodsStock',
          label: '库存'
        },
        {
          prop: 'goodsStatus',
          label: '商品状态'
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品编号',
          $id: 'id',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品类目',
          $id: 'id',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品名称',
          $id: 'id',
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
          atClick: this.addRow
        }
      ],
      propsData: [],
      form: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
    }
  },
  methods: {
    // 基础属性
    addRow() {
      this.dialogVisible = true
      console.log()
      this.propsData.push({
        // key: [],
        // value: [],
        // tmagGoodsId: '',
        // propNames: '',
        // propValues: ''
        // propCodes: ''
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
    onSubmit() {},
    onCancel() {
      this.$router.back()
    },
    update(data, resp) {
      console.log(data)
    }
  }
}
</script>
<style lang="stylus">
.flash-sales-detail {
  .base-layout {
    margin-bottom: 50px

    .base--edit-btn {
      float: right
      padding: 3px 0
    }
  }
}
</style>
